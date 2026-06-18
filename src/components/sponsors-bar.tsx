import Image from "next/image";

const SPONSORS = [
  { src: "/sponsors/tcl.png", alt: "TCL", h: "h-6 sm:h-8" },
  { src: "/sponsors/spade-full-logo.png", alt: "Spade", h: "h-5 sm:h-7" },
  {
    src: "/sponsors/king-lala.png",
    alt: "The KingLala Enterprise",
    h: "h-12 sm:h-14",
  },
];

export function SponsorsBar() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4">
      <div className="flex flex-col items-center gap-5 rounded-2xl bg-white px-6 py-5 shadow-xl sm:flex-row sm:justify-center sm:gap-10">
        <span className="rounded-full bg-brand-magenta px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
          Sponsors
        </span>
        <div className="flex flex-wrap items-center justify-center gap-7 sm:gap-12">
          {SPONSORS.map((s) => (
            <Image
              key={s.src}
              src={s.src}
              alt={s.alt}
              width={220}
              height={90}
              className={`${s.h} w-auto object-contain`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
