// Production launcher for the Next.js standalone server.
// Next's standalone output doesn't include static assets or /public, so copy
// them next to the server, then run it IN-PROCESS (no child process — keeps a
// single PID, which container runtimes expect).
import { cpSync, existsSync } from "node:fs";

if (existsSync(".next/static")) {
  cpSync(".next/static", ".next/standalone/.next/static", { recursive: true });
}
if (existsSync("public")) {
  cpSync("public", ".next/standalone/public", { recursive: true });
}

await import("./.next/standalone/server.js");
