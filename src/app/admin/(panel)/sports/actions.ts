"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { PRESETS, type PresetKey } from "@/lib/standings";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readSportForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const preset = String(formData.get("tablePreset") ?? "FOOTBALL") as PresetKey;
  const slug =
    String(formData.get("slug") ?? "").trim() || slugify(name);
  return {
    name,
    slug,
    tablePreset: preset,
    statColumns: PRESETS[preset].columns as unknown as object,
    displayMode: String(formData.get("displayMode") ?? "STANDARD"),
    format: String(formData.get("format") ?? "LEAGUE_AND_KNOCKOUT"),
    colorHex: String(formData.get("colorHex") ?? "#2e2a8c"),
    pointsWin: Number(formData.get("pointsWin") ?? 3),
    pointsDraw: Number(formData.get("pointsDraw") ?? 1),
    pointsLoss: Number(formData.get("pointsLoss") ?? 0),
    allowDraws: formData.get("allowDraws") === "on",
    isPublished: formData.get("isPublished") === "on",
  };
}

export async function createSport(formData: FormData) {
  const data = readSportForm(formData);
  if (!data.name) return;
  const sport = await db.sport.create({ data });
  revalidatePath("/admin/sports");
  redirect(`/admin/sports/${sport.id}`);
}

export async function updateSport(id: string, formData: FormData) {
  const data = readSportForm(formData);
  await db.sport.update({ where: { id }, data });
  revalidatePath("/admin/sports");
  revalidatePath(`/admin/sports/${id}`);
  revalidatePath("/");
}

export async function toggleSportPublished(id: string, next: boolean) {
  await db.sport.update({ where: { id }, data: { isPublished: next } });
  revalidatePath("/admin/sports");
  revalidatePath("/");
}

export async function deleteSport(id: string) {
  await db.sport.delete({ where: { id } });
  revalidatePath("/admin/sports");
  revalidatePath("/");
  redirect("/admin/sports");
}
