import { Sunburst } from "@/components/motion/sunburst";
import { SponsorsBar } from "@/components/sponsors-bar";

export function SiteFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border-brand">
      <Sunburst
        className="absolute left-1/2 top-[-120%] -translate-x-1/2"
        size={360}
        opacity={0.1}
        spin={false}
      />
      <div className="relative pt-10">
        <SponsorsBar />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-12 text-center">
        <p className="font-display text-3xl">
          USF<span className="text-brand-yellow">&rsquo;26</span>
        </p>
        <p className="font-display text-sm italic text-brand-yellow">
          ...all or nothing...
        </p>
        <p className="text-xs text-muted">
          University of Lagos Engineering Society Sport Festival 2026
        </p>
      </div>
    </footer>
  );
}
