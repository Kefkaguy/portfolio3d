"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const TransitionCtx = createContext(null);

export function usePageTransition() {
  return useContext(TransitionCtx);
}

const EASE_EXPO = [0.76, 0, 0.24, 1];

export function TransitionProvider({ children }) {
  const router = useRouter();
  const [covering, setCovering] = useState(false);
  const pendingHref = useRef(null);

  const navigate = useCallback(
    (href) => {
      if (covering) return;
      pendingHref.current = href;
      setCovering(true);
    },
    [covering],
  );

  const handleCoverComplete = useCallback(() => {
    if (pendingHref.current) {
      router.push(pendingHref.current);
      pendingHref.current = null;
    }
    // Keep covering=true until template.jsx unmounts us via the enter animation
    // We reset after a short delay so AnimatePresence can re-trigger if needed
    setTimeout(() => setCovering(false), 120);
  }, [router]);

  return (
    <TransitionCtx.Provider value={{ navigate }}>
      {children}

      <AnimatePresence>
        {covering && (
          <motion.div
            key="exit-curtain"
            className="fixed inset-x-0 bottom-0 z-[9999] bg-[var(--bg)] pointer-events-none"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            style={{ transformOrigin: "bottom", height: "100vh" }}
            transition={{ duration: 0.62, ease: EASE_EXPO }}
            onAnimationComplete={handleCoverComplete}
          >
            {/* Accent stripe at the top of the curtain */}
            <motion.div
              className="absolute inset-x-0 top-0 h-[2px] bg-[var(--accent)]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.62, ease: EASE_EXPO }}
              style={{ transformOrigin: "left" }}
            />
            {/* Studio slug in the center of the curtain */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                className="mono u text-[10px] tracking-[0.4em] text-[var(--ink-faint)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                KEFKA ·
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionCtx.Provider>
  );
}
