import type { Metadata } from "next";
import { Toaster } from "sonner";
import { db } from "@/lib/db";
import { PredictionCard, type Agg } from "@/components/prediction-card";
import { Sunburst } from "@/components/motion/sunburst";
import { Reveal, StaggerGrid, StaggerItem } from "@/components/motion/reveal";
import { AutoRefresh } from "@/components/auto-refresh";
import { submitPrediction, getDeviceToken } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Predict the Finals",
  description:
    "Predict the scorelines for the USF'26 football finals and 3rd-place playoffs. See what the crowd thinks.",
};

type Pred = { deviceToken: string; homeScore: number; awayScore: number };

function aggregate(preds: Pred[]): Agg {
  let homeW = 0,
    draw = 0,
    awayW = 0;
  const m = new Map<string, number>();
  for (const p of preds) {
    if (p.homeScore > p.awayScore) homeW++;
    else if (p.homeScore < p.awayScore) awayW++;
    else draw++;
    const k = `${p.homeScore}–${p.awayScore}`;
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  const total = preds.length;
  const top = [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([score, c]) => ({ score, pct: Math.round((c / total) * 100) }));
  return { total, homeW, draw, awayW, top };
}

export default async function PredictPage() {
  const token = await getDeviceToken();
  const fixtures = await db.fixture.findMany({
    where: {
      isPublished: true,
      division: { sport: { slug: "football" } },
      stage: { type: "KNOCKOUT", name: { in: ["Final", "3rd Place"] } },
    },
    include: {
      homeGroup: true,
      awayGroup: true,
      stage: true,
      division: true,
      predictions: true,
    },
  });

  const order = (f: (typeof fixtures)[number]) =>
    (f.division.kind === "MALE" ? 0 : 10) +
    (f.stage?.name === "Final" ? 0 : 1);
  fixtures.sort((a, b) => order(a) - order(b));

  return (
    <div className="flex flex-col gap-8">
      <AutoRefresh seconds={20} />
      <Toaster position="top-center" richColors theme="dark" />

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border-brand bg-surface/50">
        <Sunburst className="absolute -right-20 -top-24" size={320} opacity={0.16} />
        <div className="relative px-6 py-10 sm:px-10 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-yellow">
            USF&rsquo;26 · Football
          </p>
          <h1 className="font-display mt-2 text-4xl sm:text-6xl">Predict the Finals</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Call the scorelines for the finals &amp; 3rd-place playoffs. One pick
            per match — then see how the crowd voted. Locks at kickoff.
          </p>
        </div>
      </section>

      {fixtures.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-brand bg-surface/50 p-10 text-center text-muted">
          No finals to predict yet — check back soon.
        </p>
      ) : (
        <StaggerGrid className="grid gap-4 sm:grid-cols-2">
          {fixtures.map((f) => {
            const mine = token
              ? f.predictions.find((p) => p.deviceToken === token) ?? null
              : null;
            const kind = f.division.kind === "MALE" ? "Men's" : "Women's";
            return (
              <StaggerItem key={f.id}>
                <PredictionCard
                  fixture={{
                    id: f.id,
                    status: f.status,
                    resultPublished: f.resultPublished,
                    homeScore: f.homeScore,
                    awayScore: f.awayScore,
                    context: `${kind} · ${f.stage?.name ?? ""}`,
                    home: f.homeGroup,
                    away: f.awayGroup,
                  }}
                  agg={aggregate(f.predictions)}
                  mine={
                    mine
                      ? { homeScore: mine.homeScore, awayScore: mine.awayScore }
                      : null
                  }
                  action={submitPrediction.bind(null, f.id)}
                />
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      )}
    </div>
  );
}
