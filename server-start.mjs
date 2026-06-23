// Production launcher for the Next.js standalone server.
// Next's standalone output doesn't include static assets or /public, so copy
// them next to the server, then run it as a plain Node process (no `next` CLI).
import { cpSync, existsSync } from "node:fs";
import { spawn } from "node:child_process";

if (existsSync(".next/static")) {
  cpSync(".next/static", ".next/standalone/.next/static", { recursive: true });
}
if (existsSync("public")) {
  cpSync("public", ".next/standalone/public", { recursive: true });
}

const child = spawn(process.execPath, [".next/standalone/server.js"], {
  stdio: "inherit",
  env: process.env,
});
child.on("exit", (code) => process.exit(code ?? 0));
