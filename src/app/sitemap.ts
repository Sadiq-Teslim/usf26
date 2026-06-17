import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getPublishedSports } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sports = await getPublishedSports();
  const now = new Date();
  return [
    { url: siteUrl, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${siteUrl}/schedule`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    ...sports.map((s) => ({
      url: `${siteUrl}/sports/${s.slug}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
  ];
}
