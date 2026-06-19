/** Canonical site URL, resolved from env (set NEXT_PUBLIC_SITE_URL for a custom domain). */
function normalizeSiteUrl(url: string) {
  const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  return withProtocol.replace(/\/$/, "");
}

export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    "http://localhost:3000",
);

export const sharedOgImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "USF'26 - ULES Sport Festival 2026 - All or Nothing",
  type: "image/png",
};

export const sharedTwitterImage = {
  url: "/twitter-image",
  width: 1200,
  height: 630,
  alt: sharedOgImage.alt,
  type: "image/png",
};
