import { db } from "@/lib/db";
import {
  PRESETS,
  applyOverrides,
  type PresetKey,
  type Stats,
} from "@/lib/standings";

/** Published sports for the public landing, ordered. */
export async function getPublishedSports() {
  return db.sport.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      colorHex: true,
      displayMode: true,
    },
  });
}

export type PublicSport = Awaited<ReturnType<typeof getSportBySlug>>;

/** Full published detail for one sport (divisions → stages → standings + fixtures). */
export async function getSportBySlug(slug: string) {
  const sport = await db.sport.findFirst({
    where: { slug, isPublished: true },
    include: {
      resultEntries: {
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
      },
      divisions: {
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
        include: {
          playerStats: {
            where: { isPublished: true },
            include: { group: true },
          },
          stages: {
            where: { isPublished: true },
            orderBy: { sortOrder: "asc" },
            include: {
              standings: { include: { group: true } },
              fixtures: {
                where: { isPublished: true },
                orderBy: [{ matchday: "asc" }, { scheduledAt: "asc" }],
                include: { homeGroup: true, awayGroup: true },
              },
            },
          },
        },
      },
    },
  });
  return sport;
}

/** Resolve a standings table for display: apply overrides, then sort. */
export function resolveTable(
  preset: PresetKey,
  rows: {
    group: {
      id: string;
      code: string;
      shortName: string;
      colorHex: string;
      logoUrl?: string | null;
    };
    stats: unknown;
    overrides: unknown;
    manualPosition: number | null;
  }[],
) {
  const def = PRESETS[preset];
  const resolved = rows.map((r) => {
    const stats = applyOverrides(
      (r.stats as Stats) ?? {},
      (r.overrides as Stats) ?? null,
    );
    return { group: r.group, stats, manualPosition: r.manualPosition };
  });
  resolved.sort((a, b) => {
    if (a.manualPosition != null && b.manualPosition != null)
      return a.manualPosition - b.manualPosition;
    return (
      (b.stats.Pts ?? 0) - (a.stats.Pts ?? 0) ||
      (b.stats[def.diffKey] ?? 0) - (a.stats[def.diffKey] ?? 0) ||
      (b.stats[def.forKey] ?? 0) - (a.stats[def.forKey] ?? 0) ||
      a.group.shortName.localeCompare(b.group.shortName)
    );
  });
  return { columns: def.columns, rows: resolved };
}
