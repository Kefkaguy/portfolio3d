"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TransitionLink } from "./transition-link";

// Journal removed
const navItems = [
  { href: "/", label: "Index" },
  { href: "/projects", label: "Work" },
  { href: "/contact", label: "Contact" },
];

const EASE_OUT = [0.16, 1, 0.3, 1];
const SPRING = { type: "spring", stiffness: 320, damping: 28 };

export function OrbitChrome({
  activePath,
  ctaHref,
  ctaLabel,
  navMeta,
  leftRail,
  rightRail,
  progressStorageKey,
  liveClock,
}) {
  const [progress, setProgress] = useState(0);
  const [clock, setClock] = useState("—");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max > 0 ? (window.scrollY / max) * 100 : 0;
      setProgress(next);
      if (progressStorageKey) {
        window.localStorage.setItem(progressStorageKey, String(window.scrollY));
      }
    };
    if (progressStorageKey) {
      const saved = Number(window.localStorage.getItem(progressStorageKey) || 0);
      if (saved > 0) window.scrollTo({ top: saved });
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [progressStorageKey]);

  useEffect(() => {
    if (!liveClock) return undefined;
    const updateClock = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit", minute: "2-digit", hour12: false, timeZone: liveClock.timeZone,
        }),
      );
    };
    updateClock();
    const timer = window.setInterval(updateClock, 30000);
    return () => window.clearInterval(timer);
  }, [liveClock]);

  const rightMeta = useMemo(() => {
    if (liveClock) return `${clock} ${liveClock.label}`;
    return navMeta;
  }, [clock, liveClock, navMeta]);

  return (
    <>
      {/* Scroll progress bar — uses scaleX instead of width for GPU performance */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-[var(--accent)]"
        style={{ scaleX: progress / 100 }}
      />

      {/* Grain / vignette overlay */}
      <div className="grain-overlay fixed inset-0 z-[2] pointer-events-none" />

      {/* ---- Nav ---- */}
      <nav className="fixed inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-8 py-5 text-[12px] max-[820px]:grid-cols-[1fr_auto] max-[820px]:px-5">

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE_OUT }}
        >
          <TransitionLink
            href="/"
            className="inline-flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.22em]"
          >
            <motion.span
              className="size-2.5 rounded-full bg-[var(--accent)]"
              style={{ boxShadow: "0 0 18px var(--accent)" }}
              animate={{ opacity: [1, 0.4, 1], scale: [1, 0.85, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
            />
            KEFKA
            <span className="ml-1 text-[var(--ink-dim)]">™</span>
          </TransitionLink>
        </motion.div>

        {/* Centre nav links with stagger */}
        <motion.div
          className="mono u justify-self-center flex gap-7 text-[var(--ink-dim)] max-[820px]:hidden"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07, delayChildren: 0.6 } },
          }}
        >
          {navItems.map((item) => {
            const isActive = item.href === activePath;
            return (
              <motion.div
                key={item.href}
                className="relative"
                variants={{
                  hidden: { opacity: 0, y: -10 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
                }}
              >
                <TransitionLink
                  href={item.href}
                  className={`relative transition-colors duration-200 hover:text-[var(--ink)] ${isActive ? "text-[var(--ink)]" : ""}`}
                >
                  {/* Floating active dot slides between items via layoutId */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="absolute -left-3.5 top-1/2 -translate-y-1/2 text-[var(--accent)]"
                      transition={SPRING}
                    >
                      ·
                    </motion.span>
                  )}
                  {item.label}
                </TransitionLink>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Right: meta + CTA */}
        <motion.div
          className="mono justify-self-end flex items-center gap-4 text-[var(--ink-dim)]"
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE_OUT }}
        >
          <span className="u text-[10px] max-[820px]:hidden">{rightMeta}</span>
          <TransitionLink href={ctaHref} className="pill pill-primary">
            {ctaLabel}
          </TransitionLink>
        </motion.div>
      </nav>

      {/* Side rails — fade in after nav settles */}
      {mounted && (
        <>
          <motion.div
            className="mono u fixed left-5 top-1/2 z-40 -translate-y-1/2 text-[10px] tracking-[0.3em] text-[var(--ink-dim)] [writing-mode:vertical-rl] max-[820px]:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.9 }}
          >
            {leftRail}
          </motion.div>
          <motion.div
            className="mono u fixed right-5 top-1/2 z-40 -translate-y-1/2 rotate-180 text-[10px] tracking-[0.3em] text-[var(--ink-dim)] [writing-mode:vertical-rl] max-[820px]:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.9 }}
          >
            {rightRail}
          </motion.div>
        </>
      )}
    </>
  );
}
