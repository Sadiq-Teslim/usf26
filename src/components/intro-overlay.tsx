"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Brand intro / loader. Plays public/usf-motion.mp4 full-screen the first time
 * someone enters the site (once per browser session), then fades to reveal the
 * page. Skippable, muted (so autoplay is allowed), and skipped entirely for
 * users who prefer reduced motion.
 *
 * Bump PLAYBACK_RATE to 2 to double-speed the clip.
 */
const PLAYBACK_RATE = 1.5;
const MAX_DURATION_MS = 12000; // safety: never trap the user behind the intro

export function IntroOverlay() {
  const [show, setShow] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem("usf-intro-seen");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!seen && !reduce) setShow(true);
    sessionStorage.setItem("usf-intro-seen", "1");
  }, []);

  useEffect(() => {
    if (!show) return;
    const v = videoRef.current;
    if (v) {
      v.playbackRate = PLAYBACK_RATE;
      v.play().catch(() => setShow(false));
    }
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => setShow(false), MAX_DURATION_MS);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-100 flex h-dvh w-screen items-center justify-center bg-indigo-deep"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <video
            ref={videoRef}
            src="/usf-motion.mp4"
            muted
            playsInline
            autoPlay
            preload="auto"
            onEnded={() => setShow(false)}
            className="h-full w-full object-cover"
          />
          <button
            onClick={() => setShow(false)}
            className="absolute bottom-6 right-6 rounded-full border border-white/30 bg-black/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/80 backdrop-blur transition hover:text-white"
          >
            Skip &rarr;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
