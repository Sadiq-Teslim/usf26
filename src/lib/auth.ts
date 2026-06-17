import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { db } from "@/lib/db";

const COOKIE = "usf_session";
const SECRET = process.env.AUTH_SECRET ?? "dev-secret-change-me";

function sign(value: string) {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

export async function createSession(adminId: string) {
  const token = `${adminId}.${sign(adminId)}`;
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getAdmin() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  const [id, sig] = token.split(".");
  if (!id || !sig) return null;
  const expected = sign(id);
  if (
    sig.length !== expected.length ||
    !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  )
    return null;
  return db.adminUser.findUnique({
    where: { id },
    select: { id: true, email: true, name: true },
  });
}
