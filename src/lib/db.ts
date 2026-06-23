import { PrismaClient, Prisma } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof makeClient> | undefined;
};

function isColdStart(e: unknown): boolean {
  if (e instanceof Prisma.PrismaClientInitializationError) return true;
  const code = (e as { code?: string })?.code;
  if (code === "P1001" || code === "P1002" || code === "P1017") return true;
  const msg = String((e as { message?: string })?.message ?? "");
  return /reach database server|connection.*closed|Server has closed/i.test(msg);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Wrap the client so any query that fails because Neon is asleep (P1001 and
 * friends) is retried a few times while the database wakes (~1s), instead of
 * crashing the request. Fixes intermittent cold-start 500s (incl. deploy
 * health-checks). Real errors are rethrown immediately.
 */
function makeClient() {
  const base = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
  return base.$extends({
    query: {
      async $allOperations({ args, query }) {
        let lastErr: unknown;
        for (let attempt = 0; attempt < 4; attempt++) {
          try {
            return await query(args);
          } catch (e) {
            if (!isColdStart(e)) throw e;
            lastErr = e;
            await sleep(400 * (attempt + 1));
          }
        }
        throw lastErr;
      },
    },
  });
}

export const db = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
