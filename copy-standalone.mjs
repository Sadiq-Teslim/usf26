// Build-time: Next's standalone output omits static assets + /public.
// Copy them next to the server so `node .next/standalone/server.js` serves them.
import { cpSync, existsSync } from "node:fs";
if (existsSync(".next/static")) {
  cpSync(".next/static", ".next/standalone/.next/static", { recursive: true });
}
if (existsSync("public")) {
  cpSync("public", ".next/standalone/public", { recursive: true });
}
console.log("[copy-standalone] static + public copied into .next/standalone");
