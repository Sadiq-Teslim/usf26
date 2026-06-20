"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { motion } from "motion/react";

type Tab = { key: string; label: string };
type Division = { id: string; kind: string; name: string };

/**
 * Division + view tab bars with optimistic switching. The active tab updates
 * instantly on tap (no waiting for the server), the navigation runs inside a
 * transition, and the content shows a loading state until the new data lands.
 */
export function SportViews({
  slug,
  divisions,
  activeDiv,
  views,
  activeView,
  children,
}: {
  slug: string;
  divisions: Division[];
  activeDiv: string;
  views: Tab[];
  activeView: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  // Optimistic target shown only while the navigation transition is in flight;
  // once it resolves we fall back to the real props (no effect needed).
  const [target, setTarget] = useState<{ div: string; view: string } | null>(
    null,
  );
  const div = pending && target ? target.div : activeDiv;
  const view = pending && target ? target.view : activeView;

  const navigate = (nextDiv: string, nextView: string) => {
    if (nextDiv === div && nextView === view) return;
    setTarget({ div: nextDiv, view: nextView });
    startTransition(() => {
      router.push(`/sports/${slug}?div=${nextDiv}&view=${nextView}`, {
        scroll: false,
      });
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {divisions.length > 1 && (
        <nav className="flex flex-wrap gap-2">
          {divisions.map((d) => {
            const active = d.kind === div;
            return (
              <button
                key={d.id}
                onClick={() => navigate(d.kind, view)}
                className="relative rounded-full px-5 py-2 text-sm font-bold"
              >
                {active && (
                  <motion.span
                    layoutId="divtab-indicator"
                    className="absolute inset-0 rounded-full bg-foreground"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    active ? "text-indigo-deep" : "text-muted hover:text-foreground"
                  }`}
                >
                  {d.name}
                </span>
              </button>
            );
          })}
        </nav>
      )}

      {views.length > 1 && (
        <nav className="flex flex-wrap gap-2">
          {views.map((v) => {
            const active = v.key === view;
            return (
              <button
                key={v.key}
                onClick={() => navigate(div, v.key)}
                className="relative rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
              >
                {active && (
                  <motion.span
                    layoutId="viewtab-indicator"
                    className="absolute inset-0 rounded-full border border-white/20 bg-white/10"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    active ? "text-foreground" : "text-muted hover:text-foreground"
                  }`}
                >
                  {v.label}
                </span>
              </button>
            );
          })}
        </nav>
      )}

      <div className="relative mt-2 min-h-40">
        <div
          className={
            pending
              ? "pointer-events-none opacity-30 transition-opacity duration-200"
              : "transition-opacity duration-200"
          }
        >
          {children}
        </div>
        {pending && (
          <div className="absolute inset-x-0 top-10 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-border-brand bg-surface px-4 py-2 text-sm text-muted shadow-lg">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/25 border-t-white" />
              Loading…
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
