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
