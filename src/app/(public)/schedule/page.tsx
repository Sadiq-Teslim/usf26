import { Reveal } from "@/components/motion/reveal";

const SCHEDULE = [
  { date: "Jun 12", day: "Fri", label: "Opening Ceremony & Indoor Games", color: "var(--usf-magenta)" },
  { date: "Jun 13", day: "Sat", label: "Football & Basketball", color: "var(--usf-blue)" },
  { date: "Jun 15", day: "Mon", label: "Lawn Tennis / Badminton, Volleyball", color: "var(--usf-green)" },
  { date: "Jun 16", day: "Tue", label: "Basketball & Volleyball", color: "var(--usf-orange)" },
  { date: "Jun 17", day: "Wed", label: "Lawn Tennis / Badminton, Football", color: "var(--usf-yellow)" },
  { date: "Jun 18", day: "Thu", label: "Basketball & Volleyball", color: "var(--usf-teal)" },
  { date: "Jun 19", day: "Fri", label: "Lawn Tennis / Badminton, Football", color: "var(--usf-magenta)" },
  { date: "Jun 20", day: "Sat", label: "Semis (Basketball, Volleyball), Swimming", color: "var(--usf-blue)" },
  { date: "Jun 22", day: "Mon", label: "Semis (Football) & Track Events", color: "var(--usf-green)" },
  { date: "Jun 23", day: "Tue", label: "Finals — Volleyball, Basketball", color: "var(--usf-orange)" },
  { date: "Jun 24", day: "Wed", label: "Grand Finale & Award Ceremony", color: "var(--usf-yellow)" },
];

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-8">
      <Reveal>
        <h1 className="font-display text-4xl sm:text-5xl">Overall Schedule</h1>
      </Reveal>

      <ol className="relative ml-3 flex flex-col gap-3 border-l border-border-brand pl-6">
        {SCHEDULE.map((s, i) => (
          <Reveal key={s.date} delay={i * 0.04}>
            <li className="relative">
              <span
                className="absolute left-[-1.95rem] top-3 h-3 w-3 rounded-full ring-4 ring-indigo-deep"
                style={{ background: s.color }}
                aria-hidden
              />
              <div className="flex flex-col gap-1 rounded-2xl border border-border-brand bg-surface/60 px-5 py-4 transition hover:border-white/25 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-semibold">{s.label}</span>
                <span className="font-display text-sm text-muted">
                  {s.day} · {s.date}
                </span>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
