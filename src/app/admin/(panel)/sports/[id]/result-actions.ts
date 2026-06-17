"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

function refresh(sportId: string) {
  revalidatePath(`/admin/sports/${sportId}`);
  revalidatePath("/");
}

function read(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim() || null,
    firstCode: String(formData.get("firstCode") ?? "").trim() || null,
    secondCode: String(formData.get("secondCode") ?? "").trim() || null,
    thirdCode: String(formData.get("thirdCode") ?? "").trim() || null,
    lineText: String(formData.get("lineText") ?? "").trim() || null,
    detailText: String(formData.get("detailText") ?? "").trim() || null,
  };
}

export async function addResultEntry(sportId: string, formData: FormData) {
  const data = read(formData);
  if (!data.title) return;
  const count = await db.resultEntry.count({ where: { sportId } });
  await db.resultEntry.create({
    data: { ...data, sportId, sortOrder: count, isPublished: true },
  });
  refresh(sportId);
}

export async function updateResultEntry(
  entryId: string,
  sportId: string,
  formData: FormData,
) {
  await db.resultEntry.update({ where: { id: entryId }, data: read(formData) });
  refresh(sportId);
}

export async function toggleResultEntryPublished(
  entryId: string,
  sportId: string,
  next: boolean,
) {
  await db.resultEntry.update({
    where: { id: entryId },
    data: { isPublished: next },
  });
  refresh(sportId);
}

export async function deleteResultEntry(entryId: string, sportId: string) {
  await db.resultEntry.delete({ where: { id: entryId } });
  refresh(sportId);
}
