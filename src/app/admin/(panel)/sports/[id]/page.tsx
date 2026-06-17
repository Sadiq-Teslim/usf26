import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { SportForm } from "@/components/admin/sport-form";
import { ResultsEditor } from "@/components/admin/results-editor";
import { updateSport, deleteSport } from "../actions";
import {
  addDivision,
  deleteDivision,
  toggleDivisionPublished,
  setParticipants,
  addStage,
  deleteStage,
  toggleStageFlag,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function ManageSportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [sport, groups] = await Promise.all([
    db.sport.findUnique({
      where: { id },
      include: {
        resultEntries: { orderBy: { sortOrder: "asc" } },
        divisions: {
          orderBy: { sortOrder: "asc" },
          include: {
            participants: true,
            stages: { orderBy: { sortOrder: "asc" } },
          },
        },
      },
    }),
    db.group.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!sport) notFound();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center gap-3">
        <Link href="/admin/sports" className="text-sm text-muted hover:text-foreground">
          &larr; Sports
        </Link>
        <h1 className="font-display text-2xl">{sport.name}</h1>
      </div>

      {/* Config */}
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg">Configuration</h2>
        <SportForm
          action={updateSport.bind(null, sport.id)}
          sport={sport}
          submitLabel="Save changes"
        />
        <form action={deleteSport.bind(null, sport.id)}>
          <button className="text-xs text-brand-magenta hover:underline">
            Delete sport
          </button>
        </form>
      </section>

      {/* Divisions */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg">
          {sport.displayMode === "RESULTS_ONLY" ? "Results" : "Divisions"}
        </h2>

        {sport.displayMode === "RESULTS_ONLY" ? (
          <ResultsEditor sportId={sport.id} entries={sport.resultEntries} />
        ) : (
          <>
            {sport.divisions.map((d) => {
              const selected = new Set(d.participants.map((p) => p.groupId));
              return (
                <div
                  key={d.id}
                  className="rounded-xl border border-border-brand bg-surface p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display">{d.name}</h3>
                    <div className="flex items-center gap-3">
                      <form
                        action={toggleDivisionPublished.bind(
                          null,
                          d.id,
                          sport.id,
                          !d.isPublished,
                        )}
                      >
                        <button
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            d.isPublished
                              ? "bg-brand-green/15 text-brand-green"
                              : "bg-white/10 text-muted"
                          }`}
                        >
                          {d.isPublished ? "Published" : "Hidden"}
                        </button>
                      </form>
                      <form action={deleteDivision.bind(null, d.id, sport.id)}>
                        <button className="text-xs text-brand-magenta hover:underline">
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Participants */}
                  <form
                    action={setParticipants.bind(null, d.id, sport.id)}
                    className="mt-4"
                  >
                    <p className="text-xs uppercase tracking-wide text-muted">
                      Participating groups
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
                            defaultChecked={selected.has(g.id)}
                          />
                          {g.code}
                        </label>
                      ))}
                    </div>
                    <button className="mt-2 rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold hover:bg-white/20">
                      Save participants
                    </button>
                  </form>

                  {/* Stages */}
                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-wide text-muted">
                      Stages
                    </p>
                    <ul className="mt-2 flex flex-col gap-2">
                      {d.stages.map((st) => (
                        <li
                          key={st.id}
                          className="flex flex-wrap items-center gap-3 rounded-lg border border-border-brand px-3 py-2 text-sm"
                        >
                          <span className="font-medium">{st.name}</span>
                          <span className="text-xs text-muted">{st.type}</span>
                          <div className="ml-auto flex items-center gap-2">
                            <form
                              action={toggleStageFlag.bind(
                                null,
                                st.id,
                                sport.id,
                                "isPublished",
                                !st.isPublished,
                              )}
                            >
                              <button
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  st.isPublished
                                    ? "bg-brand-green/15 text-brand-green"
                                    : "bg-white/10 text-muted"
                                }`}
                              >
                                {st.isPublished ? "Visible" : "Hidden"}
                              </button>
                            </form>
                            <form
                              action={toggleStageFlag.bind(
                                null,
                                st.id,
                                sport.id,
                                "tablePublished",
                                !st.tablePublished,
                              )}
                            >
                              <button
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  st.tablePublished
                                    ? "bg-brand-blue/20 text-brand-blue"
                                    : "bg-white/10 text-muted"
                                }`}
                              >
                                Table {st.tablePublished ? "on" : "off"}
                              </button>
                            </form>
                            <Link
                              href={`/admin/sports/${sport.id}/stages/${st.id}`}
                              className="text-xs text-brand-yellow hover:underline"
                            >
                              Fixtures &amp; table
                            </Link>
                            <form action={deleteStage.bind(null, st.id, sport.id)}>
                              <button className="text-xs text-brand-magenta hover:underline">
                                ✕
                              </button>
                            </form>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <form
                      action={addStage.bind(null, d.id, sport.id)}
                      className="mt-3 flex flex-wrap items-end gap-2"
                    >
                      <input
                        name="name"
                        placeholder="Stage name (e.g. Group A)"
                        required
                        className="rounded-lg border border-border-brand bg-indigo-deep px-3 py-1.5 text-sm"
                      />
                      <select
                        name="type"
                        className="rounded-lg border border-border-brand bg-indigo-deep px-3 py-1.5 text-sm"
                      >
                        <option value="LEAGUE">League / Group</option>
                        <option value="KNOCKOUT">Knockout</option>
                      </select>
                      <button className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20">
                        + Add stage
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}

            {/* Add division */}
            <form
              action={addDivision.bind(null, sport.id)}
              className="flex flex-wrap items-end gap-2 rounded-xl border border-dashed border-border-brand p-4"
            >
              <div>
                <label className="block text-xs text-muted">Kind</label>
                <select
                  name="kind"
                  className="mt-1 rounded-lg border border-border-brand bg-indigo-deep px-3 py-1.5 text-sm"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="MIXED">Mixed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted">Name</label>
                <input
                  name="name"
                  placeholder="Male"
                  className="mt-1 rounded-lg border border-border-brand bg-indigo-deep px-3 py-1.5 text-sm"
                />
              </div>
              <button className="rounded-lg bg-foreground px-4 py-1.5 text-sm font-semibold text-indigo-deep">
                + Add division
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
