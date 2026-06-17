import { db } from "@/lib/db";
import {
  computeStandings,
  type FixtureInput,
  type PresetKey,
} from "@/lib/standings";

/**
 * Recompute the standings for a stage from its finished+published fixtures.
 * Table membership = existing Standing rows (set via setStageGroups).
 * Per-column `overrides` are preserved; only computed `stats` are rewritten.
 */
export async function recomputeStage(stageId: string) {
  const stage = await db.stage.findUnique({
    where: { id: stageId },
    include: {
      division: { include: { sport: true } },
      standings: true,
      fixtures: true,
    },
  });
  if (!stage) return;

  const sport = stage.division.sport;
  const preset = sport.tablePreset as PresetKey;
  const groupIds = stage.standings.map((s) => s.groupId);
  if (groupIds.length === 0) return;

  const inputs: FixtureInput[] = stage.fixtures.map((f) => ({
    homeGroupId: f.homeGroupId,
    awayGroupId: f.awayGroupId,
    homeScore: f.homeScore,
    awayScore: f.awayScore,
    homePoints: f.homePoints,
    awayPoints: f.awayPoints,
    status: f.status,
    resultPublished: f.resultPublished,
  }));

  const table = computeStandings(
    preset,
    {
      pointsWin: sport.pointsWin,
      pointsDraw: sport.pointsDraw,
      pointsLoss: sport.pointsLoss,
      allowDraws: sport.allowDraws,
    },
    groupIds,
    inputs,
  );

  await Promise.all(
    stage.standings.map((s) =>
      db.standing.update({
        where: { id: s.id },
        data: { stats: table[s.groupId] },
      }),
    ),
  );
}
