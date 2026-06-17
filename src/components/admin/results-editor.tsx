import {
  addResultEntry,
  updateResultEntry,
  deleteResultEntry,
  toggleResultEntryPublished,
} from "@/app/admin/(panel)/sports/[id]/result-actions";

type Entry = {
  id: string;
  title: string;
  category: string | null;
  firstCode: string | null;
  secondCode: string | null;
  thirdCode: string | null;
  lineText: string | null;
  detailText: string | null;
  isPublished: boolean;
};

const inp =
  "rounded-lg border border-border-brand bg-indigo-deep px-2 py-1 text-sm";

export function ResultsEditor({
  sportId,
  entries,
}: {
  sportId: string;
  entries: Entry[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted">
        Results-only sport. Add result rows — either placings (1st/2nd/3rd by
        group code) or a free-text line (e.g. <em>MECH 3 – 1 CHG</em>).
      </p>

      <ul className="flex flex-col gap-2">
        {entries.map((e) => (
          <li
            key={e.id}
            className="rounded-xl border border-border-brand bg-surface p-3"
          >
            <form
              action={updateResultEntry.bind(null, e.id, sportId)}
              className="flex flex-wrap items-end gap-2"
            >
              <div>
                <label className="block text-[10px] text-muted">Event/Title</label>
                <input name="title" defaultValue={e.title} className={`${inp} w-44`} />
              </div>
              <div>
                <label className="block text-[10px] text-muted">Category</label>
                <input name="category" defaultValue={e.category ?? ""} placeholder="Male" className={`${inp} w-20`} />
              </div>
              <div>
                <label className="block text-[10px] text-muted">🥇</label>
                <input name="firstCode" defaultValue={e.firstCode ?? ""} className={`${inp} w-16`} />
              </div>
              <div>
                <label className="block text-[10px] text-muted">🥈</label>
                <input name="secondCode" defaultValue={e.secondCode ?? ""} className={`${inp} w-16`} />
              </div>
              <div>
                <label className="block text-[10px] text-muted">🥉</label>
                <input name="thirdCode" defaultValue={e.thirdCode ?? ""} className={`${inp} w-16`} />
              </div>
              <div>
                <label className="block text-[10px] text-muted">or free line</label>
                <input name="lineText" defaultValue={e.lineText ?? ""} placeholder="MECH 3 – 1 CHG" className={`${inp} w-40`} />
              </div>
              <button className="rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold hover:bg-white/20">
                Save
              </button>
            </form>
            <div className="mt-1 flex items-center gap-3">
              <form
                action={toggleResultEntryPublished.bind(
                  null,
                  e.id,
                  sportId,
                  !e.isPublished,
                )}
              >
                <button
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    e.isPublished
                      ? "bg-brand-green/15 text-brand-green"
                      : "bg-white/10 text-muted"
                  }`}
                >
                  {e.isPublished ? "Published" : "Hidden"}
                </button>
              </form>
              <form action={deleteResultEntry.bind(null, e.id, sportId)}>
                <button className="text-[10px] text-brand-magenta hover:underline">
                  delete
                </button>
              </form>
            </div>
          </li>
        ))}
        {entries.length === 0 && (
          <p className="text-sm text-muted">No results yet.</p>
        )}
      </ul>

      {/* Add entry */}
      <form
        action={addResultEntry.bind(null, sportId)}
        className="flex flex-wrap items-end gap-2 rounded-xl border border-dashed border-border-brand p-4"
      >
        <div>
          <label className="block text-[10px] text-muted">Event/Title</label>
          <input name="title" required placeholder="Men's 100m" className={`${inp} w-44`} />
        </div>
        <div>
          <label className="block text-[10px] text-muted">Category</label>
          <input name="category" placeholder="Male" className={`${inp} w-20`} />
        </div>
        <div>
          <label className="block text-[10px] text-muted">🥇</label>
          <input name="firstCode" placeholder="MECH" className={`${inp} w-16`} />
        </div>
        <div>
          <label className="block text-[10px] text-muted">🥈</label>
          <input name="secondCode" className={`${inp} w-16`} />
        </div>
        <div>
          <label className="block text-[10px] text-muted">🥉</label>
          <input name="thirdCode" className={`${inp} w-16`} />
        </div>
        <div>
          <label className="block text-[10px] text-muted">or free line</label>
          <input name="lineText" placeholder="MECH 3 – 1 CHG" className={`${inp} w-40`} />
        </div>
        <button className="rounded-lg bg-foreground px-4 py-1.5 text-sm font-semibold text-indigo-deep">
          + Add result
        </button>
      </form>
    </div>
  );
}
