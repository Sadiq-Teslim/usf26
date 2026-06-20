"use client";

import { useTransition, type ReactNode } from "react";
import { toast } from "sonner";
import { Crest } from "@/components/crest";

type Group = { code: string; colorHex: string; logoUrl: string | null };

export type ResultFixture = {
  id: string;
  status: string;
  venue: string | null;
  homeScore: number | null;
  awayScore: number | null;
  homePoints: number | null;
  awayPoints: number | null;
  isPublished: boolean;
  resultPublished: boolean;
  homeGroup: Group;
  awayGroup: Group;
};

const inp =
  "rounded-lg border border-border-brand bg-indigo-deep px-2 py-1.5 text-sm focus:border-white/40 focus:outline-none";

export function FixtureResultCard({
  fixture: f,
  action,
  isSets,
  variant = "compact",
  context,
  when,
  footer,
}: {
  fixture: ResultFixture;
  action: (formData: FormData) => Promise<unknown>;
  isSets: boolean;
  variant?: "compact" | "full";
  context?: string;
  when?: string;
  footer?: ReactNode;
}) {
  const [pending, startTransition] = useTransition();
  const live = f.status === "LIVE";

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await action(formData);
        toast.success(
          `${f.homeGroup.code} v ${f.awayGroup.code} saved`,
        );
      } catch {
        toast.error("Couldn't save — please try again");
      }
    });
  }

  return (
    <li className="rounded-xl border border-border-brand bg-surface/70 p-3">
      {(context || when || live) && (
        <div className="mb-2 flex items-center gap-2 text-[11px] text-muted">
          {context && (
            <span className="truncate font-semibold text-foreground/75">
              {context}
            </span>
          )}
          {when && <span className="ml-auto shrink-0">{when}</span>}
          {live && (
            <span className="shrink-0 rounded-full bg-brand-magenta/20 px-2 py-0.5 font-bold text-brand-magenta">
              ● LIVE
            </span>
          )}
        </div>
      )}

      <form action={onSubmit} className="flex flex-col gap-3">
        {/* Match line — always a single aligned row */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="flex min-w-0 items-center justify-end gap-2">
            <span className="truncate text-sm font-bold">
              {f.homeGroup.code}
            </span>
            <Crest
              code={f.homeGroup.code}
              color={f.homeGroup.colorHex}
              logoUrl={f.homeGroup.logoUrl}
              size={24}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <input
              name="homeScore"
              type="number"
              inputMode="numeric"
              defaultValue={f.homeScore ?? ""}
              className={`${inp} w-12 text-center`}
              aria-label="home score"
            />
            <span className="text-muted">–</span>
            <input
              name="awayScore"
              type="number"
              inputMode="numeric"
              defaultValue={f.awayScore ?? ""}
              className={`${inp} w-12 text-center`}
              aria-label="away score"
            />
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <Crest
              code={f.awayGroup.code}
              color={f.awayGroup.colorHex}
              logoUrl={f.awayGroup.logoUrl}
              size={24}
            />
            <span className="truncate text-sm font-bold">
              {f.awayGroup.code}
            </span>
          </div>
        </div>

        {/* Sets points */}
        {isSets && (
          <div className="flex items-center justify-center gap-2 text-[11px] text-muted">
            <span>points</span>
            <input
              name="homePoints"
              type="number"
              inputMode="numeric"
              defaultValue={f.homePoints ?? ""}
              className={`${inp} w-14 text-center`}
              aria-label="home points"
            />
            <input
              name="awayPoints"
              type="number"
              inputMode="numeric"
              defaultValue={f.awayPoints ?? ""}
              className={`${inp} w-14 text-center`}
              aria-label="away points"
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <select name="status" defaultValue={f.status} className={inp}>
            <option value="SCHEDULED">Scheduled</option>
            <option value="LIVE">Live</option>
            <option value="FINISHED">Finished</option>
            <option value="POSTPONED">Postponed</option>
          </select>

          {variant === "full" && (
            <input
              name="venue"
              defaultValue={f.venue ?? ""}
              placeholder="venue"
              className={`${inp} w-24`}
            />
          )}

          {variant === "full" && (
            <label className="flex items-center gap-1.5 text-xs text-muted">
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked={f.isPublished}
              />
              show
            </label>
          )}

          <label className="flex items-center gap-1.5 text-xs text-muted">
            <input
              type="checkbox"
              name="resultPublished"
              defaultChecked={f.resultPublished || f.status !== "FINISHED"}
            />
            publish result
          </label>

          <button
            disabled={pending}
            className="ml-auto inline-flex items-center gap-2 rounded-lg bg-brand-yellow px-4 py-1.5 text-xs font-bold text-indigo-deep transition hover:brightness-110 disabled:opacity-60"
          >
            {pending && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-deep/40 border-t-indigo-deep" />
            )}
            {pending ? "Saving…" : "Save result"}
          </button>
        </div>
      </form>
      {footer && <div className="mt-2">{footer}</div>}
    </li>
  );
}
