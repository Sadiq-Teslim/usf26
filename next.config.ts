import type { NextConfig } from "next";

const onVercel = !!process.env.VERCEL;

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (multiple lockfiles exist higher up).
  turbopack: {
    root: __dirname,
  },
  // Self-contained production server (node server.js) for non-Vercel hosts (Pxxl).
  // On Vercel, let its native adapter handle output.
  output: onVercel ? undefined : "standalone",
  // Vercel has sharp; other hosts (Pxxl) skip its native install, so disable the
  // optimizer off-Vercel to avoid a missing-sharp crash.
  images: { unoptimized: !onVercel },
  async rewrites() {
    // On Vercel this deploy is prediction-focused: serve /predict at the root,
    // so the shared link has no /predict suffix. (No effect on other hosts.)
    // `beforeFiles` is required to override the existing "/" homepage route.
    return {
      beforeFiles: onVercel
        ? [{ source: "/", destination: "/predict" }]
        : [],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
