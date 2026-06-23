"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { recomputeStage } from "@/lib/recompute";

function num(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** Quick result/score entry from the dashboard Match Centre. */
export async function quickResult(fixtureId: string, formData: FormData) {
  const f = await db.fixture.update({
    where: { id: fixtureId },
    data: {
      homeScore: num(formData.get("homeScore")),
      awayScore: num(formData.get("awayScore")),
      homePoints: num(formData.get("homePoints")),
      awayPoints: num(formData.get("awayPoints")),
      homePens: num(formData.get("homePens")),
      awayPens: num(formData.get("awayPens")),
      status: String(formData.get("status") ?? "FINISHED"),
      resultPublished: formData.get("resultPublished") === "on",
    },
    include: { division: true },
  });
  if (f.stageId) await recomputeStage(f.stageId);
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/admin/sports/${f.division.sportId}`);
}

/** Create a fixture straight from the dashboard. */
export async function createFixture(formData: FormData) {
  const divisionId = String(formData.get("divisionId") ?? "");
  const stageId = String(formData.get("stageId") ?? "") || null;
  const homeGroupId = String(formData.get("homeGroupId") ?? "");
  const awayGroupId = String(formData.get("awayGroupId") ?? "");
  if (!divisionId || !homeGroupId || !awayGroupId || homeGroupId === awayGroupId)
    return;
  const when = String(formData.get("scheduledAt") ?? "").trim();
  await db.fixture.create({
    data: {
      divisionId,
      stageId,
      homeGroupId,
      awayGroupId,
      scheduledAt: when ? new Date(when) : null,
      venue: String(formData.get("venue") ?? "").trim() || null,
      status: "SCHEDULED",
      isPublished: true,
    },
  });
  if (stageId) await recomputeStage(stageId);
  const div = await db.division.findUnique({ where: { id: divisionId } });
  revalidatePath("/admin");
  revalidatePath("/");
  if (div) revalidatePath(`/admin/sports/${div.sportId}`);
}

/** Flip a fixture to LIVE / SCHEDULED quickly. */
export async function setFixtureStatus(fixtureId: string, status: string) {
  const f = await db.fixture.update({
    where: { id: fixtureId },
    data: { status },
    include: { division: true },
  });
  if (f.stageId) await recomputeStage(f.stageId);
  revalidatePath("/admin");
  revalidatePath("/");
}
