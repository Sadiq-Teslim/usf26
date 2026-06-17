import Image from "next/image";
import Link from "next/link";
import { getPublishedSports } from "@/lib/queries";
import { SportCard } from "@/components/sport-card";
import { Sunburst } from "@/components/motion/sunburst";
import { Marquee } from "@/components/motion/marquee";
import { Reveal, StaggerGrid, StaggerItem } from "@/components/motion/reveal";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const sports = await getPublishedSports();

  return (
    <div className="flex flex-col gap-14">
      {/* Hero */}
      <section className="relative -mt-4 overflow-hidden rounded-[2rem] border border-border-brand">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-brand/40 via-transparent to-brand-magenta/20" aria-hidden />
        <Sunburst className="absolute left-1/2 top-[-30%] -translate-x-1/2" size={720} opacity={0.22} />

        <div className="relative flex flex-col items-center gap-6 px-6 py-16 text-center sm:py-24">
          <Reveal>
            <div className="rounded-3xl bg-white p-4 shadow-2xl">
              <Image
                src="/brand/usf26-logo-color.jpg"
                alt="USF'26 logo"
                width={120}
                height={160}
                className="h-28 w-auto sm:h-36"
                priority
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-5xl leading-[0.95] sm:text-8xl">
              ULES SPORT
              <br />
              <span className="text-gradient-rainbow">FESTIVAL 2026</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="font-display text-xl italic text-brand-yellow sm:text-2xl">
              ...all or nothing...
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#sports"
                className="rounded-full bg-foreground px-6 py-2.5 text-sm font-bold text-indigo-deep transition hover:scale-105"
              >
                Browse sports
              </a>
              <Link
                href="/schedule"
                className="rounded-full border border-border-brand px-6 py-2.5 text-sm font-bold text-foreground transition hover:border-white/40"
              >
                Schedule
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="relative border-t border-border-brand py-3 text-3xl text-white/[0.07] sm:text-5xl">
          <Marquee text="ALL OR NOTHING" outline />
        </div>
      </section>

      {/* Sports */}
      <section id="sports" className="scroll-mt-20">
        <Reveal>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-3xl sm:text-4xl">Sports</h2>
            <span className="text-sm text-muted">{sports.length} live</span>
          </div>
        </Reveal>
        {sports.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border-brand bg-surface/50 p-8 text-center text-muted">
            No sports published yet.
          </p>
        ) : (
          <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {sports.map((s) => (
              <StaggerItem key={s.id}>
                <SportCard sport={s} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </section>
    </div>
  );
}
