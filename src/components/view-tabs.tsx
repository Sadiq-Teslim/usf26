"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function ViewTabs({
  slug,
  div,
  views,
  active,
}: {
  slug: string;
  div: string;
  views: { key: string; label: string }[];
  active: string;
}) {
  if (views.length < 2) return null;
  return (
    <nav className="flex flex-wrap gap-2">
      {views.map((v) => {
        const isActive = v.key === active;
        return (
          <Link
            key={v.key}
            href={`/sports/${slug}?div=${div}&view=${v.key}`}
            scroll={false}
            className="relative rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
          >
            {isActive && (
              <motion.span
                layoutId="viewtab-indicator"
                className="absolute inset-0 rounded-full border border-white/20 bg-white/10"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span
              className={`relative z-10 ${
                isActive ? "text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              {v.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
