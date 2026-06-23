"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { recomputeStage } from "@/lib/recompute";
import { PRESETS, type PresetKey } from "@/lib/standings";

function refresh(sportId: string) {
  revalidatePath(`/admin/sports/${sportId}`);
  revalidatePath("/");
}

function num(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export async function addFixture(
  divisionId: string,
  sportId: string,
  formData: FormData,
) {
  const stageId = String(formData.get("stageId") ?? "") || null;
  const homeGroupId = String(formData.get("homeGroupId") ?? "");
  const awayGroupId = String(formData.get("awayGroupId") ?? "");
  if (!homeGroupId || !awayGroupId || homeGroupId === awayGroupId) return;
  const when = String(formData.get("scheduledAt") ?? "").trim();
  await db.fixture.create({
    data: {
      divisionId,
      stageId,
      homeGroupId,
      awayGroupId,
      matchday: num(formData.get("matchday")),
      venue: String(formData.get("venue") ?? "").trim() || null,
      scheduledAt: when ? new Date(when) : null,
      status: String(formData.get("status") ?? "SCHEDULED"),
      isPublished: formData.get("isPublished") === "on",
    },
  });
  if (stageId) await recomputeStage(stageId);
  refresh(sportId);
}

export async function updateFixture(
  fixtureId: string,
  sportId: string,
  formData: FormData,
) {
  const fixture = await db.fixture.update({
    where: { id: fixtureId },
    data: {
      homeScore: num(formData.get("homeScore")),
      awayScore: num(formData.get("awayScore")),
      homePoints: num(formData.get("homePoints")),
      awayPoints: num(formData.get("awayPoints")),
      homePens: num(formData.get("homePens")),
      awayPens: num(formData.get("awayPens")),
      status: String(formData.get("status") ?? "SCHEDULED"),
      venue: String(formData.get("venue") ?? "").trim() || null,
      isPublished: formData.get("isPublished") === "on",
      resultPublished: formData.get("resultPublished") === "on",
    },
  });
  if (fixture.stageId) await recomputeStage(fixture.stageId);
  refresh(sportId);
}

export async function deleteFixture(
  fixtureId: string,
  sportId: string,
) {
  const f = await db.fixture.delete({ where: { id: fixtureId } });
  if (f.stageId) await recomputeStage(f.stageId);
  refresh(sportId);
}

/** Save per-column manual overrides for one standing row. Empty cell = no override. */
export async function updateStandingOverride(
  standingId: string,
  sportId: string,
  preset: PresetKey,
  formData: FormData,
) {
  const overrides: Record<string, number> = {};
  for (const col of PRESETS[preset].columns) {
    const v = num(formData.get(`ov_${col.key}`));
    if (v != null) overrides[col.key] = v;
  }
  await db.standing.update({
    where: { id: standingId },
    data: {
      overrides: Object.keys(overrides).length ? overrides : Prisma.DbNull,
    },
  });
  refresh(sportId);
}

export async function resetStandingOverride(
  standingId: string,
  sportId: string,
) {
  await db.standing.update({
    where: { id: standingId },
    data: { overrides: Prisma.DbNull },
  });
  refresh(sportId);
}
