// Diagnostic: boot the standalone server inside the build (same Node runtime),
// stream its output, hit it once, then exit 0 so the build still succeeds.
// This surfaces the real runtime crash in the build log we can actually see.
import { spawn } from "node:child_process";
import { request } from "node:http";

console.log(
  "===== SMOKE TEST: launching standalone server on node " +
    process.version +
    " =====",
);

const child = spawn(process.execPath, [".next/standalone/server.js"], {
  env: { ...process.env, PORT: "3999", HOSTNAME: "127.0.0.1" },
});

child.stdout.on("data", (d) => process.stdout.write("[srv] " + d));
child.stderr.on("data", (d) => process.stdout.write("[srv-err] " + d));

let done = false;
const finish = (msg) => {
  if (done) return;
  done = true;
  console.log("===== " + msg + " =====");
  try {
    child.kill("SIGKILL");
  } catch {}
  process.exit(0); // never fail the build on the smoke test
};

child.on("exit", (code, sig) =>
  finish(`server EXITED EARLY: code=${code} signal=${sig}`),
);
child.on("error", (e) => finish("spawn error: " + e.message));

setTimeout(() => {
  const req = request(
    { host: "127.0.0.1", port: 3999, path: "/", timeout: 5000 },
    (res) => finish("GET / -> HTTP " + res.statusCode + " (server is UP)"),
  );
  req.on("error", (e) => finish("GET / failed: " + e.message));
  req.end();
}, 6000);

// hard safety
setTimeout(() => finish("hard timeout"), 15000);
