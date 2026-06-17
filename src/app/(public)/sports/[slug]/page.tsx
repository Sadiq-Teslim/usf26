import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSportBySlug } from "@/lib/queries";
import { StandingsTable } from "@/components/standings-table";
import { FixtureList } from "@/components/fixture-list";
import { SportHero } from "@/components/sport-hero";
import { SportViews } from "@/components/sport-views";
import { Reveal } from "@/components/motion/reveal";
import type { PresetKey } from "@/lib/standings";
import type { CapsuleFixture } from "@/components/score-capsule";

export const dynamic = "force-dynamic";

const MEDAL = ["🥇", "🥈", "🥉"];

const isResult = (f: CapsuleFixture) =>
  f.resultPublished && f.homeScore != null;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sport = await getSportBySlug(slug);
  if (!sport) return { title: "Sport not found" };
  const description = `${sport.name} fixtures, results and standings at USF'26 — ULES Sport Festival 2026.`;
  return {
    title: sport.name,
    description,
    openGraph: { title: `${sport.name} — USF'26`, description },
    twitter: { title: `${sport.name} — USF'26`, description },
  };
}

export default async function SportPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ div?: string; view?: string }>;
}) {
  const { slug } = await params;
  const { div, view: viewParam } = await searchParams;
  const sport = await getSportBySlug(slug);
  if (!sport) notFound();

  const preset = sport.tablePreset as PresetKey;

  if (sport.displayMode === "RESULTS_ONLY") {
    return (
      <div className="flex flex-col gap-8">
        <SportHero name={sport.name} color={sport.colorHex} subtitle="Results" />
        {sport.resultEntries.length === 0 ? (
          <Empty>No results published yet.</Empty>
        ) : (
          <div className="flex flex-col gap-3">
            {sport.resultEntries.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.04}>
                <div className="rounded-2xl border border-border-brand bg-surface/60 px-5 py-4">
                  <p className="font-display text-lg">{r.title}</p>
                  {r.category && (
                    <p className="text-[11px] uppercase tracking-widest text-muted">
                      {r.category}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-muted">
                    {r.lineText ??
                      [r.firstCode, r.secondCode, r.thirdCode]
                        .map((c, idx) => (c ? `${MEDAL[idx]} ${c}` : null))
                        .filter(Boolean)
                        .join("   ")}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    );
  }

  const divisions = sport.divisions;
  const active = divisions.find((d) => d.kind === div) ?? divisions[0] ?? null;
  const subtitle = divisions.map((d) => d.name).join(" · ");

  // Per-stage buckets for the active division.
  const stagesData = (active?.stages ?? []).map((stage) => {
    const results = stage.fixtures.filter(isResult);
    const upcoming = stage.fixtures.filter((f) => !isResult(f));
    const hasTable = stage.tablePublished && stage.standings.length > 0;
    return { stage, results, upcoming, hasTable };
  });

  const anyTable = stagesData.some((s) => s.hasTable);
  const anyResults = stagesData.some((s) => s.results.length > 0);
  const anyUpcoming = stagesData.some((s) => s.upcoming.length > 0);

  const views = [
    anyTable && { key: "table", label: "Table" },
    anyResults && { key: "results", label: "Results" },
    anyUpcoming && { key: "fixtures", label: "Fixtures" },
  ].filter(Boolean) as { key: string; label: string }[];

  const view =
    views.find((v) => v.key === viewParam)?.key ?? views[0]?.key ?? "table";

  return (
    <div className="flex flex-col gap-6">
      <SportHero name={sport.name} color={sport.colorHex} subtitle={subtitle} />

      {!active || views.length === 0 ? (
        <Empty>Nothing published for this division yet.</Empty>
      ) : (
        <SportViews
          slug={slug}
          divisions={divisions.map((d) => ({ id: d.id, kind: d.kind, name: d.name }))}
          activeDiv={active.kind}
          views={views}
          activeView={view}
        >
          <div className="flex flex-col gap-10">
            {stagesData.map(({ stage, results, upcoming, hasTable }, i) => {
              const items =
                view === "results" ? results : view === "fixtures" ? upcoming : [];
              const showStage = view === "table" ? hasTable : items.length > 0;
              if (!showStage) return null;
              return (
                <Reveal key={stage.id} delay={i * 0.05}>
                  <section className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-5 w-1.5 rounded-full"
                        style={{ background: sport.colorHex }}
                      />
                      <h3 className="font-display text-2xl">{stage.name}</h3>
                    </div>
                    {view === "table" ? (
                      <StandingsTable
                        title={`${stage.name} table`}
                        preset={preset}
                        rows={stage.standings}
                      />
                    ) : (
                      <FixtureList fixtures={items} />
                    )}
                  </section>
                </Reveal>
              );
            })}
          </div>
        </SportViews>
      )}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-border-brand bg-surface/50 p-10 text-center text-muted">
      {children}
    </p>
  );
}
