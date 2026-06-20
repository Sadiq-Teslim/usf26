"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import {
  addPlayerStat,
  updatePlayerStat,
  togglePlayerStatPublished,
  deletePlayerStat,
} from "@/app/admin/(panel)/sports/[id]/player-stat-actions";

type Group = { id: string; code: string };
type Stat = {
  id: string;
  name: string;
  goals: number;
  assists: number;
  groupId: string;
  isPublished: boolean;
};

const inp =
  "rounded-lg border border-border-brand bg-indigo-deep px-2 py-1.5 text-sm focus:border-white/40 focus:outline-none";

function Spinner() {
  return (
    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
  );
}

function Row({
  stat,
  groups,
  sportId,
}: {
  stat: Stat;
  groups: Group[];
  sportId: string;
}) {
  const [pending, startTransition] = useTransition();
  function save(formData: FormData) {
    startTransition(async () => {
      try {
        await updatePlayerStat(stat.id, sportId, formData);
        toast.success("Saved");
      } catch {
        toast.error("Couldn't save");
      }
    });
  }
  return (
    <li className="flex flex-wrap items-center gap-2 rounded-lg border border-border-brand bg-surface/60 p-2">
      <form action={save} className="flex flex-1 flex-wrap items-center gap-2">
        <input
          name="name"
          defaultValue={stat.name}
          className={`${inp} min-w-32 flex-1`}
          placeholder="Player"
        />
        <select name="groupId" defaultValue={stat.groupId} className={inp}>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.code}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1 text-[11px] text-muted">
          G
          <input
            name="goals"
            type="number"
            inputMode="numeric"
            defaultValue={stat.goals}
            className={`${inp} w-14 text-center`}
          />
        </label>
        <label className="flex items-center gap-1 text-[11px] text-muted">
          A
          <input
            name="assists"
            type="number"
            inputMode="numeric"
            defaultValue={stat.assists}
            className={`${inp} w-14 text-center`}
          />
        </label>
        <button
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20 disabled:opacity-60"
        >
          {pending && <Spinner />}
          Save
        </button>
      </form>
      <form
        action={togglePlayerStatPublished.bind(
          null,
          stat.id,
          sportId,
          !stat.isPublished,
        )}
      >
        <button
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            stat.isPublished
              ? "bg-brand-green/15 text-brand-green"
              : "bg-white/10 text-muted"
          }`}
        >
          {stat.isPublished ? "Shown" : "Hidden"}
        </button>
      </form>
      <form action={deletePlayerStat.bind(null, stat.id, sportId)}>
        <button className="text-[10px] text-brand-magenta hover:underline">
          delete
        </button>
      </form>
    </li>
  );
}

export function PlayerStatsEditor({
  divisionId,
  sportId,
  groups,
  stats,
}: {
  divisionId: string;
  sportId: string;
  groups: Group[];
  stats: Stat[];
}) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function add(formData: FormData) {
    if (!String(formData.get("name") ?? "").trim()) {
      toast.error("Enter a player name");
      return;
    }
    startTransition(async () => {
      try {
        await addPlayerStat(divisionId, sportId, formData);
        toast.success("Player added");
        formRef.current?.reset();
      } catch {
        toast.error("Couldn't add player");
      }
    });
  }

  const sorted = [...stats].sort((a, b) => b.goals - a.goals || b.assists - a.assists);

  return (
    <div className="flex flex-col gap-2">
      {sorted.length > 0 && (
        <ul className="flex flex-col gap-2">
          {sorted.map((s) => (
            <Row key={s.id} stat={s} groups={groups} sportId={sportId} />
          ))}
        </ul>
      )}

      <form
        ref={formRef}
        action={add}
        className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border-brand p-3"
      >
        <input
          name="name"
          placeholder="Player name"
          className={`${inp} min-w-32 flex-1`}
        />
        <select name="groupId" className={inp} defaultValue={groups[0]?.id}>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.code}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1 text-[11px] text-muted">
          G
          <input
            name="goals"
            type="number"
            inputMode="numeric"
            defaultValue={0}
            className={`${inp} w-14 text-center`}
          />
        </label>
        <label className="flex items-center gap-1 text-[11px] text-muted">
          A
          <input
            name="assists"
            type="number"
            inputMode="numeric"
            defaultValue={0}
            className={`${inp} w-14 text-center`}
          />
        </label>
        <button
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-1.5 text-sm font-bold text-indigo-deep disabled:opacity-60"
        >
          {pending && <Spinner />}
          {pending ? "Adding…" : "+ Add player"}
        </button>
      </form>
    </div>
  );
}
