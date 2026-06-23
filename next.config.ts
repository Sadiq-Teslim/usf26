import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (multiple lockfiles exist higher up).
  turbopack: {
    root: __dirname,
  },
  // Self-contained production server (node server.js) — avoids the `next start`
  // CLI, which Pxxl's Node 26 runtime kills at launch.
  output: "standalone",
  // Pxxl skips native install scripts, so sharp has no binary. Skip the
  // image optimizer (serve originals) instead of crashing on a missing sharp.
  images: { unoptimized: true },
};

export default nextConfig;
