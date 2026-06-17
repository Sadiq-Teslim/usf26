"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Near-real-time updates for the public site: re-fetches the current server
 * components on an interval. Pauses when the tab is hidden. On production this
 * is the fallback alongside Supabase Realtime.
 */
export function AutoRefresh({ seconds = 20 }: { seconds?: number }) {
  const router = useRouter();
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const id = setInterval(tick, seconds * 1000);
    return () => clearInterval(id);
  }, [router, seconds]);
  return null;
}
