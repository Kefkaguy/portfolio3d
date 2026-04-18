"use client";

import { motion } from "framer-motion";

const EASE_EXPO = [0.76, 0, 0.24, 1];

/**
 * template.jsx re-mounts on every navigation (unlike layout.jsx which persists).
 * We use it to:
 *   1. Show an entering curtain that sweeps upward — revealing the new page.
 *   2. Wrap the page content in a subtle fade-up so it feels alive on first render.
 */
export default function Template({ children }) {
  return (
    <>
      {/* ---- Entering curtain: starts covering, sweeps upward ---- */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[9998] bg-[var(--bg)] pointer-events-none"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        style={{ transformOrigin: "top", height: "100vh" }}
        transition={{ duration: 0.65, delay: 0.05, ease: EASE_EXPO }}
      >
        {/* Accent stripe visible at the bottom of the retreating curtain */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--accent)]"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          style={{ transformOrigin: "right" }}
          transition={{ duration: 0.65, delay: 0.05, ease: EASE_EXPO }}
        />
      </motion.div>

      {/* ---- Page content fade-up ---- */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
