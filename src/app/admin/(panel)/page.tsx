import Link from "next/link";
import { db } from "@/lib/db";
import { quickResult } from "./dashboard-actions";
import { AddFixtureForm } from "@/components/admin/add-fixture-form";
import { Crest } from "@/components/crest";

export const dynamic = "force-dynamic";

const inp =
  "rounded-lg border border-border-brand bg-indigo-deep px-2 py-1 text-sm";

function fmt(d: Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Row = {
  id: string;
  status: string;
  scheduledAt: Date | null;
  homeScore: number | null;
  awayScore: number | null;
  homePoints: number | null;
  awayPoints: number | null;
  resultPublished: boolean;
  homeGroup: { code: string; colorHex: string; logoUrl: string | null };
  awayGroup: { code: string; colorHex: string; logoUrl: string | null };
  stage: { name: string } | null;
  division: { name: string; sport: { name: string; tablePreset: string } };
};

function ResultForm({ f }: { f: Row }) {
  const isSets = f.division.sport.tablePreset === "SETS";
  const live = f.status === "LIVE";
  return (
    <li className="rounded-xl border border-border-brand bg-surface/70 p-3">
      <div className="mb-1.5 flex items-center gap-2 text-[11px] text-muted">
        <span className="font-semibold text-foreground/80">
          {f.division.sport.name}
        </span>
        <span>· {f.division.name}</span>
        {f.stage && <span>· {f.stage.name}</span>}
        {f.scheduledAt && <span className="ml-auto">{fmt(f.scheduledAt)}</span>}
        {live && (
          <span className="rounded-full bg-brand-magenta/20 px-2 py-0.5 font-bold text-brand-magenta">
            ● LIVE
          </span>
        )}
      </div>
      <form
        action={quickResult.bind(null, f.id)}
        className="flex flex-wrap items-center gap-2"
      >
        <span className="flex w-28 items-center justify-end gap-1.5 text-sm font-bold">
          {f.homeGroup.code}
          <Crest
            code={f.homeGroup.code}
            color={f.homeGroup.colorHex}
            logoUrl={f.homeGroup.logoUrl}
            size={22}
          />
        </span>
        <input
          name="homeScore"
          type="number"
          defaultValue={f.homeScore ?? ""}
          className={`${inp} w-14 text-center`}
          aria-label="home score"
        />
        <span className="text-muted">–</span>
        <input
          name="awayScore"
          type="number"
          defaultValue={f.awayScore ?? ""}
          className={`${inp} w-14 text-center`}
          aria-label="away score"
        />
        <span className="flex w-28 items-center gap-1.5 text-sm font-bold">
          <Crest
            code={f.awayGroup.code}
            color={f.awayGroup.colorHex}
            logoUrl={f.awayGroup.logoUrl}
            size={22}
          />
          {f.awayGroup.code}
        </span>

        {isSets && (
          <span className="flex items-center gap-1 text-[11px] text-muted">
            pts
            <input
              name="homePoints"
              type="number"
              defaultValue={f.homePoints ?? ""}
              className={`${inp} w-12 text-center`}
              aria-label="home points"
            />
            <input
              name="awayPoints"
              type="number"
              defaultValue={f.awayPoints ?? ""}
              className={`${inp} w-12 text-center`}
              aria-label="away points"
            />
          </span>
        )}

        <select name="status" defaultValue={f.status} className={inp}>
          <option value="SCHEDULED">Scheduled</option>
          <option value="LIVE">Live</option>
          <option value="FINISHED">Finished</option>
          <option value="POSTPONED">Postponed</option>
        </select>
        <label className="flex items-center gap-1 text-xs">
          <input
            type="checkbox"
            name="resultPublished"
            defaultChecked={f.resultPublished || f.status !== "FINISHED"}
          />
          publish
        </label>
        <button className="rounded-lg bg-brand-yellow px-3 py-1 text-xs font-bold text-indigo-deep hover:brightness-110">
          Save result
        </button>
      </form>
    </li>
  );
}

export default async function AdminDashboard() {
  const [
    sportsCount,
    published,
    fixtures,
    liveCount,
    pending,
    recent,
    sports,
    divisions,
  ] = await Promise.all([
      db.sport.count(),
      db.sport.count({ where: { isPublished: true } }),
      db.fixture.count(),
      db.fixture.count({ where: { status: "LIVE" } }),
      db.fixture.findMany({
        where: { status: { in: ["SCHEDULED", "LIVE"] } },
        orderBy: [{ scheduledAt: "asc" }],
        take: 50,
        include: {
          homeGroup: true,
          awayGroup: true,
          stage: true,
          division: { include: { sport: true } },
        },
      }),
      db.fixture.findMany({
        where: { status: "FINISHED" },
        orderBy: { updatedAt: "desc" },
        take: 6,
        include: {
          homeGroup: true,
          awayGroup: true,
          stage: true,
          division: { include: { sport: true } },
        },
      }),
      db.sport.findMany({
        orderBy: { name: "asc" },
        include: {
          divisions: {
            orderBy: { sortOrder: "asc" },
            include: { stages: { orderBy: { sortOrder: "asc" } } },
          },
        },
      }),
      db.division.findMany({
        where: { sport: { displayMode: "STANDARD" } },
        orderBy: { sortOrder: "asc" },
        include: {
          sport: true,
          stages: { orderBy: { sortOrder: "asc" } },
          participants: { include: { group: true } },
        },
      }),
    ]);

  const divisionOptions = divisions
    .map((d) => ({
      id: d.id,
      label: `${d.sport.name} — ${d.name}`,
      stages: d.stages.map((s) => ({ id: s.id, name: s.name })),
      groups: d.participants
        .map((p) => ({ id: p.group.id, code: p.group.code }))
        .sort((a, b) => a.code.localeCompare(b.code)),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const stats = [
    {
      label: "Sports",
      value: sportsCount,
      sub: `${published} published`,
      accent: "var(--usf-blue)",
    },
    {
      label: "Fixtures",
      value: fixtures,
      sub: `${pending.length} to play`,
      accent: "var(--usf-green)",
    },
    {
      label: "Live now",
      value: liveCount,
      sub: "in progress",
      accent: "var(--usf-magenta)",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Dashboard</h1>
        <Link
          href="/"
          className="text-sm text-muted hover:text-foreground"
          target="_blank"
        >
          View site &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="relative overflow-hidden rounded-2xl border border-border-brand bg-surface p-4"
          >
            <span
              className="absolute left-0 top-0 h-full w-1"
              style={{ background: s.accent }}
              aria-hidden
            />
            <p className="text-[11px] uppercase tracking-wide text-muted">
              {s.label}
            </p>
            <p className="font-display text-3xl sm:text-4xl">{s.value}</p>
            <p className="text-xs text-muted">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Match Centre — enter results fast (accordion) */}
      <section>
        <details
          open
          className="group rounded-2xl border border-border-brand bg-surface/40"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg">Match Centre</h2>
              <span className="rounded-full bg-brand-magenta/20 px-2 py-0.5 text-xs font-bold text-brand-magenta">
                {pending.length}
              </span>
            </div>
            <svg
              className="text-muted transition-transform duration-300 group-open:rotate-180"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div className="flex flex-col gap-3 border-t border-border-brand px-4 py-4">
            <p className="text-xs text-muted">
              Enter a score, set Finished + publish, Save. Tables recalculate
              automatically.
            </p>
            {pending.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border-brand p-4 text-sm text-muted">
                No scheduled or live fixtures. Add one below.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {pending.map((f) => (
                  <ResultForm key={f.id} f={f} />
                ))}
              </ul>
            )}

            {recent.length > 0 && (
              <details className="mt-1">
                <summary className="cursor-pointer text-xs font-semibold text-muted hover:text-foreground">
                  Recently finished ({recent.length}) — edit a result
                </summary>
                <ul className="mt-2 flex flex-col gap-2">
                  {recent.map((f) => (
                    <ResultForm key={f.id} f={f} />
                  ))}
                </ul>
              </details>
            )}
          </div>
        </details>
      </section>

      {/* Add a fixture from the dashboard */}
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg">Add a fixture</h2>
        <AddFixtureForm divisions={divisionOptions} />
      </section>

      {/* Navigator — full access to every competition */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg">Competitions</h2>
          <Link
            href="/admin/sports"
            className="rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold hover:bg-white/20"
          >
            + New sport / manage
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {sports.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-border-brand bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <Link
                  href={`/admin/sports/${s.id}`}
                  className="font-display hover:text-brand-yellow"
                >
                  {s.name}
                </Link>
                <span className="text-[10px] uppercase tracking-wide text-muted">
                  {s.isPublished ? "published" : "hidden"}
                </span>
              </div>
              {s.displayMode === "RESULTS_ONLY" ? (
                <Link
                  href={`/admin/sports/${s.id}`}
                  className="mt-2 inline-block text-xs text-brand-yellow hover:underline"
                >
                  Edit results &rarr;
                </Link>
              ) : (
                <div className="mt-2 flex flex-col gap-2">
                  {s.divisions.map((d) => (
                    <div key={d.id}>
                      <p className="text-[11px] uppercase tracking-wide text-muted">
                        {d.name}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {d.stages.map((st) => (
                          <Link
                            key={st.id}
                            href={`/admin/sports/${s.id}/stages/${st.id}`}
                            className="rounded-md border border-border-brand px-2 py-0.5 text-xs hover:border-white/40 hover:text-brand-yellow"
                          >
                            {st.name}
                          </Link>
                        ))}
                        {d.stages.length === 0 && (
                          <span className="text-xs text-muted">no stages</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {s.divisions.length === 0 && (
                    <span className="text-xs text-muted">no divisions</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
