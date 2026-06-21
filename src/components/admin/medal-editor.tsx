"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateMedalTable } from "@/app/admin/(panel)/medal-actions";

type Group = { id: string; code: string; shortName: string };
type Tally = { groupId: string; gold: number; silver: number; bronze: number };

const inp =
  "w-14 rounded-lg border border-border-brand bg-indigo-deep px-2 py-1 text-center text-sm focus:border-white/40 focus:outline-none";

export function MedalEditor({
  groups,
  tallies,
}: {
  groups: Group[];
  tallies: Tally[];
}) {
  const [pending, startTransition] = useTransition();
  const byId = new Map(tallies.map((t) => [t.groupId, t]));

  function save(formData: FormData) {
    startTransition(async () => {
      try {
        await updateMedalTable(formData);
        toast.success("Medal table updated");
      } catch {
        toast.error("Couldn't save medal table");
      }
    });
  }

  return (
    <form action={save} className="flex flex-col gap-2">
      <div className="overflow-x-auto rounded-xl border border-border-brand">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase text-muted">
              <th className="px-3 py-2 text-left font-medium">Team</th>
              <th className="px-2 py-2 font-medium">🥇</th>
              <th className="px-2 py-2 font-medium">🥈</th>
              <th className="px-2 py-2 font-medium">🥉</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => {
              const t = byId.get(g.id);
              return (
                <tr key={g.id} className="border-t border-border-brand/60">
                  <td className="px-3 py-1.5 font-semibold">{g.code}</td>
                  <td className="px-2 py-1.5 text-center">
                    <input name={`g_${g.id}`} type="number" inputMode="numeric" defaultValue={t?.gold ?? 0} className={inp} />
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <input name={`s_${g.id}`} type="number" inputMode="numeric" defaultValue={t?.silver ?? 0} className={inp} />
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <input name={`b_${g.id}`} type="number" inputMode="numeric" defaultValue={t?.bronze ?? 0} className={inp} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button
        disabled={pending}
        className="inline-flex w-fit items-center gap-2 rounded-lg bg-brand-yellow px-4 py-1.5 text-sm font-bold text-indigo-deep transition hover:brightness-110 disabled:opacity-60"
      >
        {pending && (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-deep/40 border-t-indigo-deep" />
        )}
        {pending ? "Saving…" : "Save medal table"}
      </button>
    </form>
  );
}
