import Link from "next/link";
import { SportMotif } from "@/components/sport-motif";

export function SportCard({
  sport,
}: {
  sport: { name: string; slug: string; colorHex: string; displayMode: string };
}) {
  return (
    <Link
      href={`/sports/${sport.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border-brand bg-surface/60 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/30"
    >
      {/* hover glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(20rem 12rem at 50% 0%, ${sport.colorHex}33, transparent 70%)`,
        }}
        aria-hidden
      />
      <span
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ background: sport.colorHex }}
        aria-hidden
      />
      {/* sport motif */}
      <span
        className="pointer-events-none absolute -bottom-4 -right-3 text-white/8 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
        aria-hidden
      >
        <SportMotif sport={sport.name} size={92} />
      </span>

      <div className="relative">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ background: sport.colorHex }}
        />
        <h3 className="font-display mt-3 min-h-[2.5em] text-2xl leading-tight">
          {sport.name}
        </h3>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-muted">
          {sport.displayMode === "RESULTS_ONLY" ? "Results" : "Fixtures · Table"}
        </p>
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand-yellow opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">
          View &rarr;
        </span>
      </div>
    </Link>
  );
}
