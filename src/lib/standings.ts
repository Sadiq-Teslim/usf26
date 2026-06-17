// Canonical standings engine. Used by the seed and by admin recompute (Phase 5).
// Tables are sport-specific via "presets" (see PRD §6.2).

export type PresetKey = "FOOTBALL" | "BASKETBALL" | "SETS";

export interface StatColumn {
  key: string;
  label: string;
  /** auto = computed; false = manual-only */
  auto: boolean;
}

interface PresetDef {
  columns: StatColumn[];
  forKey: string; // "goals/points/sets for" column
  againstKey: string; // "against" column
  diffKey: string; // difference column
  hasDraw: boolean;
  /** SETS uses point-differential (homePoints-awayPoints) for diff, not for-against */
  diffFromPoints: boolean;
}

export const PRESETS: Record<PresetKey, PresetDef> = {
  FOOTBALL: {
    columns: [
      { key: "P", label: "P", auto: true },
      { key: "W", label: "W", auto: true },
      { key: "D", label: "D", auto: true },
      { key: "L", label: "L", auto: true },
      { key: "GF", label: "GF", auto: true },
      { key: "GA", label: "GA", auto: true },
      { key: "GD", label: "GD", auto: true },
      { key: "Pts", label: "Pts", auto: true },
    ],
    forKey: "GF",
    againstKey: "GA",
    diffKey: "GD",
    hasDraw: true,
    diffFromPoints: false,
  },
  BASKETBALL: {
    columns: [
      { key: "P", label: "P", auto: true },
      { key: "W", label: "W", auto: true },
      { key: "L", label: "L", auto: true },
      { key: "PF", label: "PF", auto: true },
      { key: "PA", label: "PA", auto: true },
      { key: "PD", label: "PD", auto: true },
      { key: "Pts", label: "Pts", auto: true },
    ],
    forKey: "PF",
    againstKey: "PA",
    diffKey: "PD",
    hasDraw: false,
    diffFromPoints: false,
  },
  SETS: {
    columns: [
      { key: "P", label: "P", auto: true },
      { key: "W", label: "W", auto: true },
      { key: "L", label: "L", auto: true },
      { key: "SW", label: "Sets W", auto: true },
      { key: "SL", label: "Sets L", auto: true },
      { key: "Diff", label: "Diff", auto: true },
      { key: "Pts", label: "Pts", auto: true },
    ],
    forKey: "SW",
    againstKey: "SL",
    diffKey: "Diff",
    hasDraw: false,
    diffFromPoints: true,
  },
};

export interface FixtureInput {
  homeGroupId: string;
  awayGroupId: string;
  homeScore: number | null;
  awayScore: number | null;
  homePoints?: number | null;
  awayPoints?: number | null;
  status: string;
  resultPublished: boolean;
}

export interface SportPoints {
  pointsWin: number;
  pointsDraw: number;
  pointsLoss: number;
  allowDraws: boolean;
}

export type Stats = Record<string, number>;

/** Compute keyed stats per group for one stage. */
export function computeStandings(
  preset: PresetKey,
  points: SportPoints,
  groupIds: string[],
  fixtures: FixtureInput[],
): Record<string, Stats> {
  const def = PRESETS[preset];
  const table: Record<string, Stats> = {};

  for (const id of groupIds) {
    const s: Stats = { P: 0, W: 0, L: 0, [def.forKey]: 0, [def.againstKey]: 0, [def.diffKey]: 0, Pts: 0 };
    if (def.hasDraw) s.D = 0;
    table[id] = s;
  }

  const counts = (f: FixtureInput) =>
    f.status === "FINISHED" &&
    f.resultPublished &&
    f.homeScore != null &&
    f.awayScore != null;

  for (const f of fixtures) {
    if (!counts(f)) continue;
    const sides = [
      {
        id: f.homeGroupId,
        my: f.homeScore!,
        opp: f.awayScore!,
        myPts: f.homePoints,
        oppPts: f.awayPoints,
      },
      {
        id: f.awayGroupId,
        my: f.awayScore!,
        opp: f.homeScore!,
        myPts: f.awayPoints,
        oppPts: f.homePoints,
      },
    ];
    for (const side of sides) {
      const s = table[side.id];
      if (!s) continue;
      s.P += 1;
      s[def.forKey] += side.my;
      s[def.againstKey] += side.opp;
      if (def.diffFromPoints && side.myPts != null && side.oppPts != null) {
        s[def.diffKey] += side.myPts - side.oppPts;
      }
      if (side.my > side.opp) {
        s.W += 1;
        s.Pts += points.pointsWin;
      } else if (side.my === side.opp && def.hasDraw && points.allowDraws) {
        s.D = (s.D ?? 0) + 1;
        s.Pts += points.pointsDraw;
      } else {
        s.L += 1;
        s.Pts += points.pointsLoss;
      }
    }
    if (!def.diffFromPoints) {
      // diff is for-against, recomputed below
    }
  }

  // Finalize for-against diff for non-points presets.
  for (const id of groupIds) {
    const s = table[id];
    if (!def.diffFromPoints) {
      s[def.diffKey] = s[def.forKey] - s[def.againstKey];
    }
  }

  return table;
}

/** Apply per-column overrides on top of computed stats. */
export function applyOverrides(stats: Stats, overrides?: Stats | null): Stats {
  if (!overrides) return stats;
  return { ...stats, ...overrides };
}

/** Sort group ids by Pts, then diff, then "for", then code-name tiebreak handled by caller. */
export function sortStandings(
  preset: PresetKey,
  table: Record<string, Stats>,
): string[] {
  const def = PRESETS[preset];
  return Object.keys(table).sort((a, b) => {
    const x = table[a];
    const y = table[b];
    return (
      y.Pts - x.Pts ||
      y[def.diffKey] - x[def.diffKey] ||
      y[def.forKey] - x[def.forKey]
    );
  });
}
