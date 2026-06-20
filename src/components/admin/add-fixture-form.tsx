"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { createFixture } from "@/app/admin/(panel)/dashboard-actions";

type Div = {
  id: string;
  label: string;
  stages: { id: string; name: string }[];
  groups: { id: string; code: string }[];
};

const inp =
  "rounded-lg border border-border-brand bg-indigo-deep px-2 py-1.5 text-sm";

export function AddFixtureForm({ divisions }: { divisions: Div[] }) {
  const [divId, setDivId] = useState(divisions[0]?.id ?? "");
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const div = divisions.find((d) => d.id === divId);

  function onSubmit(formData: FormData) {
    const home = formData.get("homeGroupId");
    const away = formData.get("awayGroupId");
    if (home && home === away) {
      toast.error("Home and away can't be the same team");
      return;
    }
    startTransition(async () => {
      try {
        await createFixture(formData);
        toast.success("Fixture added");
        formRef.current?.reset();
      } catch {
        toast.error("Couldn't add fixture — please try again");
      }
    });
  }

  if (divisions.length === 0) {
    return (
      <p className="text-sm text-muted">
        No divisions yet — create a sport and division first.
      </p>
    );
  }

  return (
    <form
      ref={formRef}
      action={onSubmit}
      className="flex flex-wrap items-end gap-2 rounded-xl border border-dashed border-border-brand p-4"
    >
      <div>
        <label className="block text-[11px] text-muted">Competition</label>
        <select
          name="divisionId"
          value={divId}
          onChange={(e) => setDivId(e.target.value)}
          className={`${inp} mt-1`}
        >
          {divisions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] text-muted">Stage / group</label>
        <select key={`stage-${divId}`} name="stageId" className={`${inp} mt-1`}>
          <option value="">— none —</option>
          {div?.stages.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] text-muted">Home</label>
        <select
          key={`home-${divId}`}
          name="homeGroupId"
          required
          className={`${inp} mt-1`}
        >
          {div?.groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.code}
            </option>
          ))}
        </select>
      </div>

      <span className="pb-1.5 text-muted">vs</span>

      <div>
        <label className="block text-[11px] text-muted">Away</label>
        <select
          key={`away-${divId}`}
          name="awayGroupId"
          required
          className={`${inp} mt-1`}
        >
          {div?.groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.code}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] text-muted">Date / time</label>
        <input name="scheduledAt" type="datetime-local" className={`${inp} mt-1`} />
      </div>

      <div>
        <label className="block text-[11px] text-muted">Venue</label>
        <input name="venue" placeholder="venue" className={`${inp} mt-1 w-24`} />
      </div>

      <button
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-1.5 text-sm font-bold text-indigo-deep disabled:opacity-60"
      >
        {pending && (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-deep/40 border-t-indigo-deep" />
        )}
        {pending ? "Adding…" : "+ Add fixture"}
      </button>
    </form>
  );
}
