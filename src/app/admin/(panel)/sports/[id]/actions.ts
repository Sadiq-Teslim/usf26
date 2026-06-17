"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { recomputeStage } from "@/lib/recompute";

function refresh(sportId: string) {
  revalidatePath(`/admin/sports/${sportId}`);
  revalidatePath("/");
}

// ---- Divisions ----
export async function addDivision(sportId: string, formData: FormData) {
  const kind = String(formData.get("kind") ?? "MIXED");
  const name = String(formData.get("name") ?? kind).trim() || kind;
  const count = await db.division.count({ where: { sportId } });
  await db.division.create({
    data: { sportId, kind, name, sortOrder: count },
  });
  refresh(sportId);
}

export async function toggleDivisionPublished(
  divisionId: string,
  sportId: string,
  next: boolean,
) {
  await db.division.update({
    where: { id: divisionId },
    data: { isPublished: next },
  });
  refresh(sportId);
}

export async function deleteDivision(divisionId: string, sportId: string) {
  await db.division.delete({ where: { id: divisionId } });
  refresh(sportId);
}

// ---- Participants ----
export async function setParticipants(
  divisionId: string,
  sportId: string,
  formData: FormData,
) {
  const groupIds = formData.getAll("groupIds").map(String);
  await db.sportParticipant.deleteMany({ where: { divisionId } });
  await db.sportParticipant.createMany({
    data: groupIds.map((groupId) => ({ divisionId, groupId })),
  });
  refresh(sportId);
}

// ---- Stages ----
export async function addStage(
  divisionId: string,
  sportId: string,
  formData: FormData,
) {
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "LEAGUE");
  if (!name) return;
  const count = await db.stage.count({ where: { divisionId } });
  await db.stage.create({
    data: { divisionId, name, type, sortOrder: count },
  });
  refresh(sportId);
}

export async function toggleStageFlag(
  stageId: string,
  sportId: string,
  field: "isPublished" | "tablePublished",
  next: boolean,
) {
  await db.stage.update({ where: { id: stageId }, data: { [field]: next } });
  refresh(sportId);
}

export async function deleteStage(stageId: string, sportId: string) {
  await db.stage.delete({ where: { id: stageId } });
  refresh(sportId);
}

/** Set which groups appear in a stage's table (creates/removes Standing rows), then recompute. */
export async function setStageGroups(
  stageId: string,
  sportId: string,
  formData: FormData,
) {
  const groupIds = formData.getAll("groupIds").map(String);
  const existing = await db.standing.findMany({ where: { stageId } });
  const existingIds = new Set(existing.map((s) => s.groupId));
  const wanted = new Set(groupIds);

  await db.standing.deleteMany({
    where: { stageId, groupId: { notIn: groupIds.length ? groupIds : ["__none__"] } },
  });
  const toAdd = groupIds.filter((g) => !existingIds.has(g));
  if (toAdd.length) {
    await db.standing.createMany({
      data: toAdd.map((groupId) => ({ stageId, groupId, stats: {} })),
    });
  }
  void wanted;
  await recomputeStage(stageId);
  refresh(sportId);
}

export async function recomputeStageAction(stageId: string, sportId: string) {
  await recomputeStage(stageId);
  refresh(sportId);
}
