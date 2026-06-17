"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function DivisionTabs({
  slug,
  divisions,
  active,
  view,
}: {
  slug: string;
  divisions: { id: string; kind: string; name: string }[];
  active: string;
  view?: string;
}) {
  const suffix = view ? `&view=${view}` : "";
  return (
    <nav className="flex flex-wrap gap-2">
      {divisions.map((d) => {
        const isActive = d.kind === active;
        return (
          <Link
            key={d.id}
            href={`/sports/${slug}?div=${d.kind}${suffix}`}
            scroll={false}
            className="relative rounded-full px-5 py-2 text-sm font-bold"
          >
            {isActive && (
              <motion.span
                layoutId="divtab-indicator"
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span
              className={`relative z-10 ${
                isActive ? "text-indigo-deep" : "text-muted hover:text-foreground"
              }`}
            >
              {d.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
