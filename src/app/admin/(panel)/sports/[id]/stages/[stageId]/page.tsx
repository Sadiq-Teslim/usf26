import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PRESETS, type PresetKey } from "@/lib/standings";
import { resolveTable } from "@/lib/queries";
import { setStageGroups, recomputeStageAction } from "../../actions";
import {
  addFixture,
  updateFixture,
  deleteFixture,
  updateStandingOverride,
  resetStandingOverride,
} from "../../fixture-actions";

export const dynamic = "force-dynamic";

const inp =
  "rounded-lg border border-border-brand bg-indigo-deep px-2 py-1 text-sm";

export default async function StagePage({
  params,
}: {
  params: Promise<{ id: string; stageId: string }>;
}) {
  const { id: sportId, stageId } = await params;
  const stage = await db.stage.findUnique({
    where: { id: stageId },
    include: {
      division: {
        include: {
          sport: true,
          participants: { include: { group: true } },
        },
      },
      standings: { include: { group: true } },
      fixtures: {
        orderBy: [{ matchday: "asc" }, { scheduledAt: "asc" }],
        include: { homeGroup: true, awayGroup: true },
      },
    },
  });
  if (!stage || stage.division.sport.id !== sportId) notFound();

  const sport = stage.division.sport;
  const preset = sport.tablePreset as PresetKey;
  const isSets = preset === "SETS";
  const groups = stage.division.participants
    .map((p) => p.group)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const inTable = new Set(stage.standings.map((s) => s.groupId));
  const { columns } = PRESETS[preset];
  const resolved = resolveTable(preset, stage.standings);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <Link
          href={`/admin/sports/${sportId}`}
          className="text-sm text-muted hover:text-foreground"
        >
          &larr; {sport.name}
        </Link>
        <h1 className="font-display text-2xl">
          {stage.division.name} · {stage.name}
        </h1>
      </div>

      {/* Table membership */}
      <section className="flex flex-col gap-2">
        <h2 className="font-display text-lg">Table groups</h2>
        <form
          action={setStageGroups.bind(null, stageId, sportId)}
          className="rounded-xl border border-border-brand bg-surface p-4"
        >
          <p className="text-xs text-muted">
            Choose which groups appear in this stage&rsquo;s table.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {groups.map((g) => (
              <label
                key={g.id}
                className="flex items-center gap-1.5 rounded-lg border border-border-brand px-2 py-1 text-sm"
              >
                <input
                  type="checkbox"
                  name="groupIds"
                  value={g.id}
                  defaultChecked={inTable.has(g.id)}
                />
                {g.code}
              </label>
            ))}
            {groups.length === 0 && (
              <span className="text-sm text-muted">
                No participants set for this division yet.
              </span>
            )}
          </div>
          <button className="mt-2 rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold hover:bg-white/20">
            Save table groups
          </button>
        </form>
      </section>

      {/* Standings with overrides */}
      {stage.standings.length > 0 && (
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">Standings</h2>
            <form action={recomputeStageAction.bind(null, stageId, sportId)}>
              <button className="rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold hover:bg-white/20">
                ↻ Recalculate
              </button>
            </form>
          </div>
          <p className="text-xs text-muted">
            Auto-calculated from published results. Edit any cell to override; blank = auto.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border-brand">
            <table className="w-full text-sm">
              <thead className="bg-surface text-xs uppercase text-muted">
                <tr>
                  <th className="px-3 py-2 text-left">Team</th>
                  {columns.map((c) => (
                    <th key={c.key} className="px-2 py-2 text-center">
                      {c.label}
                    </th>
                  ))}
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {stage.standings.map((s) => {
                  const ov = (s.overrides as Record<string, number>) ?? {};
                  const computed =
                    resolved.rows.find((r) => r.group.id === s.groupId)?.stats ??
                    {};
                  return (
                    <tr key={s.id} className="border-t border-border-brand">
                      <td className="px-3 py-2 font-medium">{s.group.code}</td>
                      {columns.map((c) => (
                        <td key={c.key} className="px-1 py-1 text-center">
                          <form
                            action={updateStandingOverride.bind(
                              null,
                              s.id,
                              sportId,
                              preset,
                            )}
                            className="contents"
                          >
                            {/* preserve other override cells */}
                            {columns
                              .filter((o) => o.key !== c.key && ov[o.key] != null)
                              .map((o) => (
                                <input
                                  key={o.key}
                                  type="hidden"
                                  name={`ov_${o.key}`}
                                  value={ov[o.key]}
                                />
                              ))}
                            <input
                              name={`ov_${c.key}`}
                              defaultValue={ov[c.key] ?? ""}
                              placeholder={String(computed[c.key] ?? 0)}
                              className={`w-12 rounded border bg-indigo-deep px-1 py-0.5 text-center text-xs ${
                                ov[c.key] != null
                                  ? "border-brand-orange text-brand-orange"
                                  : "border-border-brand text-muted"
                              }`}
                            />
                          </form>
                        </td>
                      ))}
                      <td className="px-2 py-1 text-right">
                        <form
                          action={resetStandingOverride.bind(null, s.id, sportId)}
                        >
                          <button className="text-[10px] text-muted hover:text-foreground">
                            reset
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Fixtures */}
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg">Fixtures &amp; results</h2>
        <ul className="flex flex-col gap-2">
          {stage.fixtures.map((f) => (
            <li
              key={f.id}
              className="rounded-xl border border-border-brand bg-surface p-3"
            >
              <form
                action={updateFixture.bind(null, f.id, sportId)}
                className="flex flex-wrap items-center gap-2"
              >
                <span className="w-28 text-right text-sm font-medium">
                  {f.homeGroup.code}
                </span>
                <input
                  name="homeScore"
                  type="number"
                  defaultValue={f.homeScore ?? ""}
                  className={`${inp} w-14 text-center`}
                />
                <span className="text-muted">–</span>
                <input
                  name="awayScore"
                  type="number"
                  defaultValue={f.awayScore ?? ""}
                  className={`${inp} w-14 text-center`}
                />
                <span className="w-28 text-sm font-medium">{f.awayGroup.code}</span>

                {isSets && (
                  <span className="flex items-center gap-1 text-xs text-muted">
                    pts
                    <input
                      name="homePoints"
                      type="number"
                      defaultValue={f.homePoints ?? ""}
                      className={`${inp} w-14 text-center`}
                    />
                    <input
                      name="awayPoints"
                      type="number"
                      defaultValue={f.awayPoints ?? ""}
                      className={`${inp} w-14 text-center`}
                    />
                  </span>
                )}

                <select name="status" defaultValue={f.status} className={inp}>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="LIVE">Live</option>
                  <option value="FINISHED">Finished</option>
                  <option value="POSTPONED">Postponed</option>
                </select>
                <input
                  name="venue"
                  defaultValue={f.venue ?? ""}
                  placeholder="venue"
                  className={`${inp} w-24`}
                />
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    name="isPublished"
                    defaultChecked={f.isPublished}
                  />
                  show
                </label>
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    name="resultPublished"
                    defaultChecked={f.resultPublished}
                  />
                  result
                </label>
                <button className="rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold hover:bg-white/20">
                  Save
                </button>
              </form>
              <form
                action={deleteFixture.bind(null, f.id, sportId)}
                className="mt-1"
              >
                <button className="text-[10px] text-brand-magenta hover:underline">
                  delete fixture
                </button>
              </form>
            </li>
          ))}
          {stage.fixtures.length === 0 && (
            <p className="text-sm text-muted">No fixtures in this stage yet.</p>
          )}
        </ul>

        {/* Add fixture */}
        <form
          action={addFixture.bind(null, stage.divisionId, sportId)}
          className="flex flex-wrap items-end gap-2 rounded-xl border border-dashed border-border-brand p-4"
        >
          <input type="hidden" name="stageId" value={stageId} />
          <div>
            <label className="block text-xs text-muted">Home</label>
            <select name="homeGroupId" required className={`${inp} mt-1`}>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted">Away</label>
            <select name="awayGroupId" required className={`${inp} mt-1`}>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted">Matchday</label>
            <input name="matchday" type="number" className={`${inp} mt-1 w-20`} />
          </div>
          <div>
            <label className="block text-xs text-muted">Date/time</label>
            <input
              name="scheduledAt"
              type="datetime-local"
              className={`${inp} mt-1`}
            />
          </div>
          <div>
            <label className="block text-xs text-muted">Venue</label>
            <input name="venue" className={`${inp} mt-1 w-24`} />
          </div>
          <label className="flex items-center gap-1 text-xs">
            <input type="checkbox" name="isPublished" defaultChecked />
            show
          </label>
          <button className="rounded-lg bg-foreground px-4 py-1.5 text-sm font-semibold text-indigo-deep">
            + Add fixture
          </button>
        </form>
      </section>
    </div>
  );
}
