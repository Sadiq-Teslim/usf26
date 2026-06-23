// Build-time prep for the Next.js standalone server on Pxxl.
import { cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";

// 1) Next's standalone output omits static assets + /public — copy them.
if (existsSync(".next/static")) {
  cpSync(".next/static", ".next/standalone/.next/static", { recursive: true });
}
if (existsSync("public")) {
  cpSync("public", ".next/standalone/public", { recursive: true });
}

// 2) Next's dependency tracing frequently misses Prisma's native query engine,
//    which then crashes at runtime. Copy the generated client + engine in.
if (existsSync("node_modules/.prisma")) {
  cpSync("node_modules/.prisma", ".next/standalone/node_modules/.prisma", {
    recursive: true,
  });
}

// 3) Inject crash visibility into the server entry so any boot/runtime error is
//    printed (Pxxl hides the runtime stderr by default).
const entry = ".next/standalone/server.js";
if (existsSync(entry)) {
  const shim =
    "process.on('uncaughtException',e=>{console.error('[usf-fatal] uncaughtException:',(e&&e.stack)||e);process.exit(1);});" +
    "process.on('unhandledRejection',e=>{console.error('[usf-fatal] unhandledRejection:',(e&&e.stack)||e);});" +
    "console.log('[usf-boot] starting on node '+process.version+' PORT='+(process.env.PORT||'')+' HOSTNAME='+(process.env.HOSTNAME||''));\n";
  writeFileSync(entry, shim + readFileSync(entry, "utf8"));
}

console.log(
  "[copy-standalone] static + public + prisma engine copied; boot shim injected",
);
