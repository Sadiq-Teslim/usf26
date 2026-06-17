import Link from "next/link";
import { Marquee } from "@/components/motion/marquee";
import { Sunburst } from "@/components/motion/sunburst";

export function SportHero({
  name,
  color,
  subtitle,
}: {
  name: string;
  color: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border-brand bg-surface/50">
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${color}55, transparent 65%)` }}
        aria-hidden
      />
      <Sunburst
        className="absolute -right-24 -top-28"
        size={380}
        opacity={0.16}
      />
      <div className="absolute inset-x-0 top-1 text-5xl text-white/[0.06] sm:text-7xl">
        <Marquee text={name} outline />
      </div>
      <div className="absolute inset-x-0 bottom-1 text-5xl text-white/[0.05] sm:text-7xl">
        <Marquee text={name} reverse />
      </div>

      <div className="relative px-6 py-10 sm:px-10 sm:py-16">
        <Link
          href="/"
          className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-foreground"
        >
          &larr; All sports
        </Link>
        <h1 className="font-display mt-3 text-5xl sm:text-7xl">{name}</h1>
        {subtitle && (
          <p className="mt-2 text-sm font-medium uppercase tracking-wide text-muted">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
