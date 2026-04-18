"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { OrbitChrome } from "./orbit-chrome";
import { projects } from "./orbit-data";
import { OrbitScene } from "./orbit-scene";
import { TransitionLink } from "./transition-link";

const EASE_OUT = [0.16, 1, 0.3, 1];

/* ─────────────────────────────────────────────────────────────────────
   Filter config
──────────────────────────────────────────────────────────────────────── */
const ALL_FILTERS = ["all", "Identity", "Interface", "Tooling", "Residency"];

function getCount(type) {
  if (type === "all") return projects.length;
  return projects.filter((p) => p.type === type).length;
}

/* ─────────────────────────────────────────────────────────────────────
   Single project row
──────────────────────────────────────────────────────────────────────── */
function ProjectRow({ project, index }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px 0px" });

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.06, ease: EASE_OUT }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Sliding top accent line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[1.5px]"
        style={{ backgroundColor: project.tone, transformOrigin: "left" }}
        initial={false}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
      />

      {/* Row background tint */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: project.tone }}
        initial={false}
        animate={{ opacity: hovered ? 0.04 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative border-b border-[var(--rule)] py-8 px-2">

        {/* Desktop */}
        <div className="hidden md:grid md:grid-cols-[80px_1fr_200px_160px_52px] md:items-center md:gap-6">

          {/* Index number — decorative, large */}
          <div
            className="font-light text-[52px] leading-none tracking-[-0.04em] tabular-nums select-none transition-colors duration-300"
            style={{ color: hovered ? project.tone : "var(--ink-faint)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Name + subtitle */}
          <div className="min-w-0 pr-4">
            <div className="text-[clamp(20px,2vw,28px)] font-medium tracking-[-0.02em] leading-tight">
              {project.name}
            </div>
            <div className="mt-2 text-[12px] leading-snug text-[var(--ink-dim)] max-w-[46ch]">
              {project.sub}
            </div>
          </div>

          {/* Type */}
          <div className="flex items-center gap-2.5">
            <motion.span
              className="size-2.5 rounded-full shrink-0"
              style={{ backgroundColor: project.tone }}
              animate={{ boxShadow: hovered ? `0 0 10px ${project.tone}` : "0 0 0px transparent" }}
              transition={{ duration: 0.3 }}
            />
            <div>
              <div className="text-[13px] font-medium">{project.type}</div>
              <div className="mono text-[10px] text-[var(--ink-dim)] mt-0.5 tracking-[0.06em]">{project.year}</div>
            </div>
          </div>

          {/* Client */}
          <div className="text-[13px] text-[var(--ink-dim)] truncate">
            {project.client}
          </div>

          {/* Arrow */}
          <motion.div
            className="size-9 grid place-items-center rounded-full border text-[14px] shrink-0"
            animate={{
              rotate: hovered ? -45 : 0,
              borderColor: hovered ? project.tone : "var(--rule)",
              color: hovered ? project.tone : "var(--ink-faint)",
            }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
          >
            →
          </motion.div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-start gap-4">
          <div
            className="font-light text-[32px] leading-none tracking-[-0.04em] tabular-nums shrink-0 mt-0.5 transition-colors duration-300"
            style={{ color: hovered ? project.tone : "var(--ink-faint)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[20px] font-medium tracking-[-0.02em] leading-tight">{project.name}</div>
            <div className="mt-1.5 text-[12px] text-[var(--ink-dim)] leading-snug">{project.sub}</div>
            <div className="mono mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[var(--ink-dim)]">
              <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: project.tone }} />
              {project.type} · {project.year}
            </div>
          </div>
          <motion.div
            className="size-8 grid place-items-center rounded-full border text-[13px] shrink-0 mt-0.5"
            animate={{ rotate: hovered ? -45 : 0, borderColor: hovered ? project.tone : "var(--rule)" }}
            style={{ color: hovered ? project.tone : "var(--ink-faint)" }}
            transition={{ duration: 0.2 }}
          >
            →
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Page
──────────────────────────────────────────────────────────────────────── */
export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const visibleProjects = useMemo(
    () =>
      activeFilter === "all"
        ? projects
        : projects.filter((p) => p.type === activeFilter),
    [activeFilter],
  );

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--ink)]">
      <OrbitScene variant="projects" />
      <OrbitChrome
        activePath="/projects"
        ctaHref="/contact"
        ctaLabel="Start a brief →"
        navMeta={`${String(projects.length).padStart(2, "0")} items`}
        leftRail="KEFKA · THE ARCHIVE · 2021—2026"
        rightRail="SELECTED WORK · 18 OF 47 SHOWN"
        progressStorageKey="orbit_projects_scroll"
      />

      {/* ── Header ── */}
      <header
        ref={headerRef}
        className="section-shell relative z-10 px-0 pt-[140px] pb-12 max-[820px]:pt-[110px]"
      >
        <motion.div
          className="eyebrow mono u"
          initial={{ opacity: 0, x: -14 }}
          animate={headerInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE_OUT }}
        >
          <span className="eyebrow-bar" />02 · The Archive
        </motion.div>

        <h1 className="mt-5 text-[clamp(52px,9vw,136px)] leading-[0.9] font-medium tracking-[-0.035em]">
          {[
            <>Selected <span className="font-normal text-[var(--accent)]">objects</span>,</>,
            <><span className="font-light text-[var(--ink-dim)]">turned at a speed</span></>,
            <>you can actually read.</>,
          ].map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "110%", opacity: 0 }}
                animate={headerInView ? { y: "0%", opacity: 1 } : {}}
                transition={{ duration: 0.85, delay: 0.35 + i * 0.13, ease: EASE_OUT }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Stats */}
        <motion.div
          className="mt-10 grid gap-6 border-t border-[var(--rule)] pt-5 md:grid-cols-4"
          initial="hidden"
          animate={headerInView ? "show" : "hidden"}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.75 } },
          }}
        >
          {[
            ["Filed", "2021 — 2026"],
            ["Disciplines", "5"],
            ["Clients", "31"],
            ["Shipped", "47 artifacts"],
          ].map(([k, v]) => (
            <motion.div
              key={k}
              className="flex flex-col gap-1"
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
              }}
            >
              <span className="mono u text-[10px] text-[var(--ink-dim)]">{k}</span>
              <span className="text-[15px] font-medium">{v}</span>
            </motion.div>
          ))}
        </motion.div>
      </header>

      {/* ── Index ── */}
      <section className="section-shell relative z-10 px-0 pb-10">

        {/* Filter + count row */}
        <motion.div
          className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[var(--rule)] py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          {/* Filter label */}
          <span className="mono u text-[10px] text-[var(--ink-faint)] shrink-0">Filter</span>

          {/* Pills */}
          <div className="flex flex-wrap gap-2">
            {ALL_FILTERS.map((f) => {
              const active = activeFilter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  className={[
                    "mono u rounded-full border px-3.5 py-1.5 text-[10px] tracking-[0.14em] transition-all duration-200 cursor-pointer",
                    active
                      ? "border-[var(--accent)] bg-[var(--accent)] text-[#0a0a0b]"
                      : "border-[var(--rule)] text-[var(--ink-dim)] hover:border-[var(--ink-dim)] hover:text-[var(--ink)]",
                  ].join(" ")}
                >
                  {f === "all" ? "All" : f}
                  <span className="ml-1.5 opacity-50">{getCount(f)}</span>
                </button>
              );
            })}
          </div>

          {/* Live count */}
          <div className="ml-auto mono text-[10px] text-[var(--ink-faint)] shrink-0">
            <AnimatePresence mode="wait">
              <motion.span
                key={`${activeFilter}-count`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {String(visibleProjects.length).padStart(2, "0")} shown
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Column headers */}
        <div className="hidden md:grid md:grid-cols-[80px_1fr_200px_160px_52px] md:gap-6 border-b border-[var(--rule)] py-2 px-2">
          {["#", "Project", "Type", "Client", ""].map((h, i) => (
            <span key={i} className="mono u text-[9px] tracking-[0.18em] text-[var(--ink-faint)]">{h}</span>
          ))}
        </div>

        {/* Rows — key on activeFilter so the list re-mounts and rows re-animate on filter change */}
        <div key={activeFilter}>
          {visibleProjects.map((project, index) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={index}
            />
          ))}

          {/* Empty state */}
          {visibleProjects.length === 0 && (
            <motion.div
              className="py-24 text-center mono u text-[10px] text-[var(--ink-faint)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              No projects in this category
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="section-shell relative z-10 mt-16 border-t border-[var(--rule)] px-0 pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px 0px" }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <div className="eyebrow mono u justify-center">
            <span className="eyebrow-bar" />Next
          </div>
          <h2 className="mt-4 text-[clamp(40px,6vw,84px)] leading-[0.95] font-medium tracking-[-0.025em]">
            Something{" "}
            <span className="font-normal text-[var(--accent)]">worth filing?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-[var(--ink-dim)] text-[14px] leading-[1.55]">
            We&apos;re booking residencies and kinetic identity engagements for Q3. Two slots remaining.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <TransitionLink href="/contact" className="pill pill-primary">Start a brief →</TransitionLink>
            <TransitionLink href="/" className="pill">← Back to index</TransitionLink>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
