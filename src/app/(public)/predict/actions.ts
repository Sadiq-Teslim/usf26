"use server";

import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

const DEVICE_COOKIE = "usf_predict_id";

export async function getDeviceToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(DEVICE_COOKIE)?.value;
}

export async function submitPrediction(fixtureId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const spade = String(formData.get("spadeUsername") ?? "").trim();
  const hs = parseInt(String(formData.get("homeScore") ?? ""), 10);
  const as = parseInt(String(formData.get("awayScore") ?? ""), 10);
  if (!name || name.length > 40) throw new Error("Enter your name");
  if (!spade || spade.length > 40) throw new Error("Enter your Spade username");
  if (!Number.isFinite(hs) || !Number.isFinite(as) || hs < 0 || as < 0 || hs > 50 || as > 50)
    throw new Error("Enter a valid score");

  const fixture = await db.fixture.findUnique({ where: { id: fixtureId } });
  if (!fixture || !fixture.isPublished) throw new Error("Match not found");
  if (fixture.status !== "SCHEDULED") throw new Error("Predictions are closed");

  const store = await cookies();
  let token = store.get(DEVICE_COOKIE)?.value;
  if (!token) {
    token = randomUUID();
    store.set(DEVICE_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  await db.prediction.upsert({
    where: { fixtureId_deviceToken: { fixtureId, deviceToken: token } },
    update: { name, spadeUsername: spade, homeScore: hs, awayScore: as },
    create: {
      fixtureId,
      deviceToken: token,
      name,
      spadeUsername: spade,
      homeScore: hs,
      awayScore: as,
    },
  });
  revalidatePath("/predict");
}
