import { Crest } from "@/components/crest";
import { CountUp } from "@/components/motion/count-up";

type Group = {
  code: string;
  shortName: string;
  colorHex: string;
  logoUrl?: string | null;
};

export type CapsuleFixture = {
  id: string;
  status: string;
  scheduledAt: Date | null;
  venue: string | null;
  homeScore: number | null;
  awayScore: number | null;
  resultPublished: boolean;
  homeGroup: Group;
  awayGroup: Group;
};

function fmt(d: Date | null) {
  if (!d) return null;
  return new Date(d).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ScoreCapsule({ fixture: f }: { fixture: CapsuleFixture }) {
  const showScore = f.resultPublished && f.homeScore != null;
  const live = f.status === "LIVE";
  const homeWin = showScore && (f.homeScore ?? 0) > (f.awayScore ?? 0);
  const awayWin = showScore && (f.awayScore ?? 0) > (f.homeScore ?? 0);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border-brand bg-surface/70 backdrop-blur transition-transform duration-300 hover:-translate-y-0.5">
      {/* color wash per side */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 opacity-25"
        style={{
          background: `linear-gradient(90deg, ${f.homeGroup.colorHex}, transparent)`,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-y-0 right-0 w-1/2 opacity-25"
        style={{
          background: `linear-gradient(270deg, ${f.awayGroup.colorHex}, transparent)`,
        }}
        aria-hidden
      />

      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-3 sm:gap-4 sm:px-5">
        {/* home */}
        <div className="flex items-center justify-end gap-2.5">
          <span
            className={`truncate text-right text-sm font-semibold sm:text-base ${
              homeWin ? "text-foreground" : "text-muted"
            }`}
          >
            {f.homeGroup.shortName}
          </span>
          <Crest code={f.homeGroup.code} color={f.homeGroup.colorHex} logoUrl={f.homeGroup.logoUrl} size={34} />
        </div>

        {/* center */}
        <div className="flex flex-col items-center">
          {showScore ? (
            <div className="capsule flex items-center gap-2 px-3 py-1.5">
              <span className="font-display text-2xl tabular-nums leading-none sm:text-3xl">
                <CountUp value={f.homeScore ?? 0} />
              </span>
              <span className="text-xs text-muted">–</span>
              <span className="font-display text-2xl tabular-nums leading-none sm:text-3xl">
                <CountUp value={f.awayScore ?? 0} />
              </span>
            </div>
          ) : (
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-indigo-deep/70 font-display text-sm text-muted ${
                live ? "animate-pulse-ring" : ""
              }`}
            >
              vs
            </div>
          )}
          <span
            className={`mt-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
              live
                ? "bg-brand-magenta/20 text-brand-magenta"
                : f.status === "FINISHED"
                  ? "bg-brand-green/15 text-brand-green"
                  : "text-muted"
            }`}
          >
            {live && (
              <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brand-magenta align-middle" />
            )}
            {f.status === "FINISHED" ? "FT" : f.status.toLowerCase()}
          </span>
        </div>

        {/* away */}
        <div className="flex items-center gap-2.5">
          <Crest code={f.awayGroup.code} color={f.awayGroup.colorHex} logoUrl={f.awayGroup.logoUrl} size={34} />
          <span
            className={`truncate text-sm font-semibold sm:text-base ${
              awayWin ? "text-foreground" : "text-muted"
            }`}
          >
            {f.awayGroup.shortName}
          </span>
        </div>
      </div>

      {(fmt(f.scheduledAt) || f.venue) && !showScore && (
        <p className="relative pb-2 text-center text-[11px] text-muted">
          {fmt(f.scheduledAt)}
          {f.venue ? ` · ${f.venue}` : ""}
        </p>
      )}
    </div>
  );
}
