"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

function refresh(sportId: string) {
  revalidatePath(`/admin/sports/${sportId}`);
  revalidatePath("/");
}

function int(v: FormDataEntryValue | null): number {
  const n = parseInt(String(v ?? "").trim(), 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export async function addPlayerStat(
  divisionId: string,
  sportId: string,
  formData: FormData,
) {
  const name = String(formData.get("name") ?? "").trim();
  const groupId = String(formData.get("groupId") ?? "");
  if (!name || !groupId) return;
  await db.playerStat.create({
    data: {
      divisionId,
      groupId,
      name,
      goals: int(formData.get("goals")),
      assists: int(formData.get("assists")),
      isPublished: true,
    },
  });
  refresh(sportId);
}

export async function updatePlayerStat(
  statId: string,
  sportId: string,
  formData: FormData,
) {
  const name = String(formData.get("name") ?? "").trim();
  const groupId = String(formData.get("groupId") ?? "");
  if (!name || !groupId) return;
  await db.playerStat.update({
    where: { id: statId },
    data: {
      name,
      groupId,
      goals: int(formData.get("goals")),
      assists: int(formData.get("assists")),
    },
  });
  refresh(sportId);
}

export async function togglePlayerStatPublished(
  statId: string,
  sportId: string,
  next: boolean,
) {
  await db.playerStat.update({
    where: { id: statId },
    data: { isPublished: next },
  });
  refresh(sportId);
}

export async function deletePlayerStat(statId: string, sportId: string) {
  await db.playerStat.delete({ where: { id: statId } });
  refresh(sportId);
}
