"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { OrbitChrome } from "./orbit-chrome";
import { OrbitScene } from "./orbit-scene";
import { TransitionLink } from "./transition-link";

/* ─── Shared easing / transition presets ────────────────────────────── */
const EASE_OUT   = [0.16, 1, 0.3, 1];
const EASE_EXPO  = [0.76, 0, 0.24, 1];

/* ─── Scroll-triggered container: fades up when entering viewport ────── */
function RevealSection({ children, className, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Text line reveal: slides up from inside overflow:hidden clip ────── */
function LineReveal({ children, delay = 0, className = "" }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "106%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 0.85, delay, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ─── Feature list item ───────────────────────────────────────────────── */
function FeatureItem({ idx, name, meta, desc, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <motion.li
      ref={ref}
      className="grid grid-cols-[60px_1fr_auto] gap-5 border-b border-[var(--rule)] py-5"
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: EASE_OUT }}
    >
      <span className="mono text-[11px] text-[var(--ink-faint)]">{idx}</span>
      <span className="text-[22px] font-medium tracking-[-0.01em]">{name}</span>
      <span className="mono u text-[10px] text-[var(--ink-dim)]">{meta}</span>
      <span className="col-[2/4] max-w-[52ch] text-[13px] leading-5 text-[var(--ink-dim)]">{desc}</span>
    </motion.li>
  );
}

/* ─── Animated accent number (scrolls 0 → n) ─────────────────────────── */
function CountUp({ to, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ delay, duration: 0.4 }}
    >
      {to}
    </motion.span>
  );
}

/* ─── Main component ─────────────────────────────────────────────────── */
export default function LandingPage() {
  const featureRef = useRef(null);
  const featureInView = useInView(featureRef, { once: true, margin: "-100px 0px" });

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--ink)]">
      <OrbitScene variant="landing" />
      <OrbitChrome
        activePath="/"
        ctaHref="#cta"
        ctaLabel="Start a brief →"
        navMeta="v4.2 · 2026"
        leftRail="KEFKA · GENERATIVE SYSTEMS · STUDIO —"
        rightRail="LAT 52.3676 · LON 4.9041 · AMS"
        progressStorageKey="orbit_landing_scroll"
      />

      <main className="relative z-10">
        {/* ── HERO ── */}
        <section className="min-h-screen px-5 pt-[16vh] pb-16">
          <div className="section-shell">

            {/* Eyebrow */}
            <motion.div
              className="eyebrow mono u"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: EASE_OUT }}
            >
              <span className="eyebrow-bar" />
              A generative design studio · est. 2021
            </motion.div>

            {/* Big heading — each line reveals upward */}
            <h1 className="mt-8 max-w-[12ch] text-[clamp(56px,10vw,156px)] leading-[0.92] font-medium tracking-[-0.035em]">
              <LineReveal delay={0.75}>
                Form,{" "}
                <span className="text-[var(--accent)] font-normal">in orbit.</span>
              </LineReveal>
              <LineReveal delay={0.88}>
                <span className="font-light text-[var(--ink-dim)]">We build moving</span>
              </LineReveal>
              <LineReveal delay={1.01}>identities for things</LineReveal>
              <LineReveal delay={1.14}>
                <span className="font-light text-[var(--ink-dim)]">that refuse to stand still.</span>
              </LineReveal>
            </h1>

            {/* Sub copy */}
            <motion.div
              className="mt-6 grid max-w-[780px] gap-8 text-[14px] leading-6 text-[var(--ink-dim)] md:grid-cols-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.3, ease: EASE_OUT }}
            >
              <p>KEFKA is a four-person studio making kinetic brand systems, motion-led interfaces, and the tooling that quietly runs underneath them.</p>
              <p className="mono u text-[10px]">
                Scroll · drag · drift<br />
                Every frame rendered live<br />
                No stock. No static.
              </p>
            </motion.div>

            {/* CTA row */}
            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5, ease: EASE_OUT }}
            >
              <a href="#feature" className="pill pill-primary">Begin tour ↓</a>
              <TransitionLink href="/projects" className="pill">Recent work</TransitionLink>
            </motion.div>

            {/* Floating callout dots */}
            <motion.div
              className="absolute top-[46%] left-[6%] flex items-center gap-2.5 text-[11px] text-[var(--ink-dim)] pointer-events-none max-[820px]:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 1 }}
            >
              <span className="mono inline-grid size-[22px] place-items-center rounded-full border border-[var(--ink-faint)] text-[10px] text-[var(--ink)]">01</span>
              <span className="h-px w-10 bg-[var(--ink-faint)]" />
              <span className="mono u">PRIMITIVE / TORUS</span>
            </motion.div>
            <motion.div
              className="absolute top-[30%] right-[10%] flex flex-row-reverse items-center gap-2.5 text-[11px] text-[var(--ink-dim)] pointer-events-none max-[820px]:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0, duration: 1 }}
            >
              <span className="mono inline-grid size-[22px] place-items-center rounded-full border border-[var(--ink-faint)] text-[10px] text-[var(--ink)]">02</span>
              <span className="h-px w-10 bg-[var(--ink-faint)]" />
              <span className="mono u">MATERIAL / METAL</span>
            </motion.div>
          </div>
        </section>

        {/* ── FEATURE ── */}
        <section id="feature" className="px-5 py-[20vh]" ref={featureRef}>
          <div className="section-shell grid gap-16 lg:grid-cols-2 lg:items-start">

            {/* Left copy */}
            <motion.div
              className="pt-10"
              initial={{ opacity: 0, x: -28 }}
              animate={featureInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: EASE_OUT }}
            >
              <motion.div
                className="eyebrow mono u"
                initial={{ opacity: 0 }}
                animate={featureInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="eyebrow-bar" />02 · Practice
              </motion.div>
              <motion.h2
                className="mt-5 max-w-[14ch] text-[clamp(40px,5vw,72px)] leading-none font-medium tracking-[-0.025em]"
                initial={{ opacity: 0, y: 24 }}
                animate={featureInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.15, ease: EASE_OUT }}
              >
                A single object, turned slowly enough to understand.
              </motion.h2>
              <motion.p
                className="mt-6 max-w-[42ch] text-[15px] leading-[1.55] text-[var(--ink-dim)]"
                initial={{ opacity: 0, y: 16 }}
                animate={featureInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3, ease: EASE_OUT }}
              >
                We treat every engagement like the shape to your right — something worth circling, rephrasing, rendering again. Our work sits at the seam between industrial precision and the soft weirdness of code that changes its mind.
              </motion.p>
            </motion.div>

            {/* Right: feature list */}
            <ul className="border-t border-[var(--rule)]">
              {[
                ["01", "Kinetic identity",     "3–8 WK",    "Mark, motion, and a small library of live primitives that stay on-brand wherever they're rendered."],
                ["02", "Interface engineering", "6–14 WK",   "Web, product, and spatial surfaces built by the people who designed them. Shaders included."],
                ["03", "Studio tooling",       "ONGOING",   "Small internal tools we license out — type testers, palette engines, generative plotters."],
                ["04", "Residencies",          "QUARTERLY", "One week, one team, one rendered artifact. For groups figuring out what their brand actually is."],
              ].map(([idx, name, meta, desc], i) => (
                <FeatureItem
                  key={idx}
                  idx={idx} name={name} meta={meta} desc={desc}
                  delay={i * 0.1}
                />
              ))}
            </ul>
          </div>
        </section>

        {/* ── CTA ── */}
        <section id="cta" className="grid min-h-screen place-items-center px-5 text-center">
          <RevealSection className="section-shell flex max-w-[900px] flex-col items-center">

            <div className="eyebrow mono u justify-center">
              <span className="eyebrow-bar" />03 · Contact
            </div>

            {/* Big CTA heading with clip reveal */}
            <h2 className="mt-4 text-[clamp(48px,8vw,120px)] leading-[0.95] font-medium tracking-[-0.03em]">
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: EASE_OUT }}
                >
                  Let&apos;s{" "}
                  <span className="font-normal text-[var(--accent)]">make it</span>
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  className="block font-normal text-[var(--accent)]"
                  initial={{ y: "110%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.1, ease: EASE_OUT }}
                >
                  turn.
                </motion.span>
              </span>
            </h2>

            <motion.p
              className="mt-6 max-w-[52ch] text-[15px] leading-[1.55] text-[var(--ink-dim)]"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25, ease: EASE_OUT }}
            >
              We take on a handful of projects each quarter. If you have something that should be felt before it&apos;s read — a launch, a rebrand, or an interface that deserves more than a static PDF — write us.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE_OUT }}
            >
              <TransitionLink href="/contact" className="pill pill-primary">hello@kefka.studio</TransitionLink>
              <TransitionLink href="/contact" className="pill">Book an intro call</TransitionLink>
            </motion.div>

            <motion.div
              className="mono u mt-16 flex flex-wrap justify-center gap-7 text-[10px] text-[var(--ink-dim)]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.55 }}
            >
              <span>Response in 48h</span>
              <span>NDA on request</span>
              <span>Remote + AMS</span>
            </motion.div>
          </RevealSection>
        </section>
      </main>

      {/* Footer */}
      <motion.footer
        className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-center border-t border-[var(--rule)] px-8 py-5 text-[11px] text-[var(--ink-dim)] max-[820px]:grid-cols-1 max-[820px]:gap-3 max-[820px]:px-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="mono u">© KEFKA Studio 2021–26</div>
        <div className="mono u justify-self-center max-[820px]:justify-self-start">A kinetic practice</div>
        <div className="mono u justify-self-end flex gap-4 max-[820px]:justify-self-start">
          <TransitionLink href="/">Index↑</TransitionLink>
          <span>Colophon</span>
          <span>RSS</span>
        </div>
      </motion.footer>
    </div>
  );
}
