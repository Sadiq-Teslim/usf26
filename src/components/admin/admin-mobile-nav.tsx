"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { AdminNav } from "./admin-nav";

export function AdminMobileNav({
  email,
  logout,
}: {
  email: string;
  logout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  // Close on navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close drawer when route changes
    setOpen(false);
  }, [path]);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="rounded-lg p-1.5 text-foreground hover:bg-white/10"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80%] flex-col border-r border-border-brand p-4 shadow-2xl sm:hidden"
              style={{ backgroundColor: "#171340" }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-xl">
                  USF<span className="text-brand-yellow">&rsquo;26</span> Admin
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="rounded-lg p-1.5 text-muted hover:bg-white/10 hover:text-foreground"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-6">
                <AdminNav />
              </div>

              <div className="mt-auto border-t border-border-brand pt-4 text-xs text-muted">
                <p className="mb-2 truncate font-medium text-foreground/70">
                  {email}
                </p>
                <Link
                  href="/"
                  target="_blank"
                  className="block py-1 hover:text-foreground"
                >
                  View public site &rarr;
                </Link>
                <form action={logout}>
                  <button className="mt-1 text-brand-magenta hover:underline">
                    Sign out
                  </button>
                </form>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
