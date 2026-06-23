"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Crest } from "@/components/crest";

type Team = { code: string; shortName: string; colorHex: string; logoUrl: string | null };

export type PredictFixture = {
  id: string;
  status: string;
  resultPublished: boolean;
  homeScore: number | null;
  awayScore: number | null;
  context: string;
  home: Team;
  away: Team;
};

export type Agg = {
  total: number;
  homeW: number;
  draw: number;
  awayW: number;
  top: { score: string; pct: number }[];
};

const inp =
  "w-16 rounded-xl border border-border-brand bg-indigo-deep px-2 py-2 text-center text-2xl font-display focus:border-white/40 focus:outline-none";

function pct(n: number, total: number) {
  return total > 0 ? Math.round((n / total) * 100) : 0;
}

export function PredictionCard({
  fixture: f,
  agg,
  mine,
  action,
}: {
  fixture: PredictFixture;
  agg: Agg;
  mine: { homeScore: number; awayScore: number } | null;
  action: (formData: FormData) => Promise<unknown>;
}) {
  const [pending, startTransition] = useTransition();
  const open = f.status === "SCHEDULED";
  const showForm = open && !mine;

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await action(formData);
        toast.success("Prediction locked in 🔒");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Couldn't submit");
      }
    });
  }

  const hp = pct(agg.homeW, agg.total);
  const dp = pct(agg.draw, agg.total);
  const ap = pct(agg.awayW, agg.total);

  return (
    <div className="overflow-hidden rounded-2xl border border-border-brand bg-surface/60 backdrop-blur">
      <div className="border-b border-border-brand px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted">
        {f.context}
      </div>

      {/* teams */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-4">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <Crest code={f.home.code} color={f.home.colorHex} logoUrl={f.home.logoUrl} size={44} />
          <span className="text-sm font-bold">{f.home.shortName}</span>
        </div>
        <span className="font-display text-lg text-muted">vs</span>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <Crest code={f.away.code} color={f.away.colorHex} logoUrl={f.away.logoUrl} size={44} />
          <span className="text-sm font-bold">{f.away.shortName}</span>
        </div>
      </div>

      {showForm ? (
        <form action={onSubmit} className="flex flex-col gap-3 px-4 pb-4">
          <div className="flex items-center justify-center gap-3">
            <input name="homeScore" type="number" inputMode="numeric" min={0} placeholder="0" required className={inp} aria-label={`${f.home.code} score`} />
            <span className="text-muted">–</span>
            <input name="awayScore" type="number" inputMode="numeric" min={0} placeholder="0" required className={inp} aria-label={`${f.away.code} score`} />
          </div>
          <input
            name="name"
            placeholder="Your name"
            required
            maxLength={40}
            className="w-full rounded-xl border border-border-brand bg-indigo-deep px-3 py-2.5 text-sm focus:border-white/40 focus:outline-none"
          />
          <div className="rounded-xl border border-brand-magenta/40 bg-brand-magenta/5 p-2.5">
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-brand-magenta">
              <span aria-hidden>♠</span> Spade username
              <span className="ml-auto font-normal normal-case text-muted">
                required
              </span>
            </label>
            <input
              name="spadeUsername"
              placeholder="@your_spade_username"
              required
              maxLength={40}
              className="w-full rounded-lg border border-border-brand bg-indigo-deep px-3 py-2.5 text-sm focus:border-white/40 focus:outline-none"
            />
          </div>
          <button
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-yellow px-4 py-2.5 text-sm font-bold text-indigo-deep transition hover:brightness-110 disabled:opacity-60"
          >
            {pending && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-deep/40 border-t-indigo-deep" />
            )}
            {pending ? "Submitting…" : "Predict"}
          </button>
        </form>
      ) : (
        <div className="flex flex-col gap-3 px-4 pb-4">
          {mine && (
            <p className="text-center text-sm">
              Your pick:{" "}
              <span className="font-display text-base text-brand-yellow">
                {f.home.code} {mine.homeScore}–{mine.awayScore} {f.away.code}
              </span>
            </p>
          )}
          {!open && !f.resultPublished && (
            <p className="text-center text-xs text-muted">Predictions closed</p>
          )}
          {f.resultPublished && f.homeScore != null && (
            <p className="text-center text-sm">
              Result:{" "}
              <span className="font-display text-base text-brand-green">
                {f.home.code} {f.homeScore}–{f.awayScore} {f.away.code}
              </span>
            </p>
          )}

          {/* sentiment bar */}
          <div>
            <div className="mb-1 flex justify-between text-[11px] font-semibold text-muted">
              <span>{f.home.code} {hp}%</span>
              {dp > 0 && <span>Draw {dp}%</span>}
              <span>{ap}% {f.away.code}</span>
            </div>
            <div className="flex h-3 overflow-hidden rounded-full bg-indigo-deep">
              <div style={{ width: `${hp}%`, background: f.home.colorHex }} />
              <div style={{ width: `${dp}%`, background: "var(--usf-indigo-border)" }} />
              <div style={{ width: `${ap}%`, background: f.away.colorHex }} />
            </div>
          </div>

          {agg.top.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-muted">Popular:</span>
              {agg.top.map((t) => (
                <span key={t.score} className="rounded-full border border-border-brand px-2 py-0.5 text-[11px]">
                  {t.score} · {t.pct}%
                </span>
              ))}
            </div>
          )}

          <p className="text-center text-[11px] text-muted">
            {agg.total} {agg.total === 1 ? "prediction" : "predictions"}
          </p>
        </div>
      )}
    </div>
  );
}
