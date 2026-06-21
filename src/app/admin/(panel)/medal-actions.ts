"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

function int(v: FormDataEntryValue | null): number {
  const n = parseInt(String(v ?? "").trim(), 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Bulk-save the whole medal table from the dashboard editor. */
export async function updateMedalTable(formData: FormData) {
  const groups = await db.group.findMany();
  await Promise.all(
    groups.map((g) =>
      db.medalTally.upsert({
        where: { groupId: g.id },
        update: {
          gold: int(formData.get(`g_${g.id}`)),
          silver: int(formData.get(`s_${g.id}`)),
          bronze: int(formData.get(`b_${g.id}`)),
        },
        create: {
          groupId: g.id,
          gold: int(formData.get(`g_${g.id}`)),
          silver: int(formData.get(`s_${g.id}`)),
          bronze: int(formData.get(`b_${g.id}`)),
        },
      }),
    ),
  );
  revalidatePath("/admin");
  revalidatePath("/");
}
