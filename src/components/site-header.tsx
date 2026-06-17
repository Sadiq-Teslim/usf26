import Link from "next/link";
import Image from "next/image";

const RAINBOW = [
  "var(--usf-blue)",
  "var(--usf-orange)",
  "var(--usf-magenta)",
  "var(--usf-yellow)",
  "var(--usf-green)",
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-brand">
      {/* rainbow top line */}
      <div className="flex h-1 w-full">
        {RAINBOW.map((c) => (
          <span key={c} className="flex-1" style={{ background: c }} />
        ))}
      </div>
      <div className="glass">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="group flex items-center">
            <span className="rounded-xl bg-white p-1 shadow-md transition group-hover:scale-105">
              <Image
                src="/brand/usf26-logo-color.jpg"
                alt="USF'26 — ULES Sport Festival 2026"
                width={36}
                height={48}
                className="h-9 w-auto"
                priority
              />
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-bold">
            <Link
              href="/"
              className="rounded-full px-4 py-1.5 text-muted transition hover:bg-white/5 hover:text-foreground"
            >
              Sports
            </Link>
            <Link
              href="/schedule"
              className="rounded-full px-4 py-1.5 text-muted transition hover:bg-white/5 hover:text-foreground"
            >
              Schedule
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
