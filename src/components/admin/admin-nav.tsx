"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11 0h7v7h-7v-7zm0-11h7v7h-7V3z" />
    ),
  },
  {
    href: "/admin/sports",
    label: "Sports",
    icon: (
      <path d="M8 21h8m-4-4v4m-7-17h14v4a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5V4zm0 2H3a2 2 0 0 0 2 2m14-2h2a2 2 0 0 1-2 2" />
    ),
  },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex gap-1 sm:mt-6 sm:flex-col">
      {NAV.map((n) => {
        const active =
          n.href === "/admin" ? path === "/admin" : path.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              active
                ? "bg-foreground text-indigo-deep"
                : "text-muted hover:bg-white/5 hover:text-foreground"
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {n.icon}
            </svg>
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
