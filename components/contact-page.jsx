"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { OrbitChrome } from "./orbit-chrome";
import { contactFaq } from "./orbit-data";
import { OrbitScene } from "./orbit-scene";
import { TransitionLink } from "./transition-link";

const EASE_OUT = [0.16, 1, 0.3, 1];

function formatBudget(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

/* ─── FAQ item with animated expand ────────────────────────────────── */
function FaqItem({ item, isOpen, onToggle }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      className="w-full border-b border-[var(--rule)] py-5 text-left"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: EASE_OUT }}
    >
      <div className="grid grid-cols-[40px_1fr_auto] items-baseline gap-4">
        <span className="mono text-[11px] text-[var(--ink-faint)]">{item.n}</span>
        <span className="text-[22px] font-medium tracking-[-0.01em]">{item.q}</span>
        <motion.span
          className={`mono text-[18px] ${isOpen ? "text-[var(--accent)]" : "text-[var(--ink-dim)]"}`}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.28, ease: EASE_OUT }}
        >
          +
        </motion.span>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <p className="max-w-[62ch] pl-14 pt-3 pb-1 text-[14px] leading-[1.6] text-[var(--ink-dim)]">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ─── Sidebar card with scroll-triggered entrance ───────────────────── */
function SideCard({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  return (
    <motion.div
      ref={ref}
      className="rounded-[14px] border border-[var(--rule)] bg-[rgba(10,10,11,0.5)] p-6 backdrop-blur"
      initial={{ opacity: 0, x: 28 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

export default function ContactPage() {
  const [budget, setBudget] = useState(45000);
  const [engagement, setEngagement] = useState("Identity");
  const [charCount, setCharCount] = useState(0);
  const [openFaq, setOpenFaq] = useState("01");
  const [submitted, setSubmitted] = useState(false);
  const [times, setTimes] = useState({ ams: "—", mex: "—" });

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimes({
        ams: now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/Amsterdam" }),
        mex: now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Mexico_City" }),
      });
    };
    update();
    const timer = window.setInterval(update, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const budgetLabel = useMemo(() => formatBudget(budget), [budget]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--ink)]">
      <OrbitScene variant="contact" />
      <OrbitChrome
        activePath="/contact"
        ctaHref="/contact"
        ctaLabel="hello@kefka.studio"
        leftRail="KEFKA · INTAKE · Q3 2026"
        rightRail="RESPONSE WITHIN 48 HOURS"
        progressStorageKey="orbit_contact_scroll"
        liveClock={{ label: "AMS", timeZone: "Europe/Amsterdam" }}
      />

      {/* ── Page header ── */}
      <header className="section-shell relative z-10 px-0 pt-[140px] pb-10 max-[820px]:pt-[110px]" ref={headerRef}>

        <motion.div
          className="eyebrow mono u"
          initial={{ opacity: 0, x: -14 }}
          animate={headerInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE_OUT }}
        >
          <span className="eyebrow-bar" />04 · Contact
        </motion.div>

        {/* Heading lines */}
        <h1 className="mt-5 text-[clamp(56px,9vw,140px)] leading-[0.9] font-medium tracking-[-0.035em]">
          {[
            <>Tell us what <span className="serif font-normal italic text-[var(--accent)]">needs to move.</span></>,
            <><span className="font-light text-[var(--ink-dim)]">We&apos;ll write back</span></>,
            <>within two working days.</>,
          ].map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "110%", opacity: 0 }}
                animate={headerInView ? { y: "0%", opacity: 1 } : {}}
                transition={{ duration: 0.85, delay: 0.4 + i * 0.13, ease: EASE_OUT }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          className="mt-8 grid gap-8 border-t border-[var(--rule)] pt-5 md:grid-cols-[1fr_auto] md:items-center"
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.85, ease: EASE_OUT }}
        >
          <p className="max-w-[52ch] text-[14px] leading-[1.55] text-[var(--ink-dim)]">
            Send a brief, a link, a sketch, or a voicenote. We take on a handful of engagements each quarter and answer every inbound — even the ones we can&apos;t take.
          </p>
          <div className="mono u inline-flex items-center gap-2 rounded-full border border-[var(--rule)] px-4 py-2 text-[11px] text-[var(--ink-dim)]">
            <motion.span
              className="size-2 rounded-full bg-[var(--accent)]"
              style={{ boxShadow: "0 0 10px var(--accent)" }}
              animate={{ opacity: [1, 0.3, 1], scale: [1, 0.75, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            Booking Q3 · 2 slots remaining
          </div>
        </motion.div>
      </header>

      {/* ── Form + Sidebar ── */}
      <section className="section-shell relative z-10 grid gap-8 px-0 pb-20 pt-10 lg:grid-cols-[1.4fr_1fr]">

        {/* Form card */}
        <motion.form
          className="rounded-[18px] border border-[var(--rule)] bg-[rgba(10,10,11,0.55)] p-8 backdrop-blur"
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px 0px" }}
          transition={{ duration: 0.75, ease: EASE_OUT }}
        >
          <h2 className="text-[clamp(28px,3.2vw,42px)] leading-none font-medium tracking-[-0.02em]">
            Start a <span className="serif font-normal italic text-[var(--accent)]">brief.</span>
          </h2>
          <p className="mt-2 text-[13px] text-[var(--ink-dim)]">
            Everything is optional except the first three. We read every submission personally.
          </p>

          {/* Name / Email */}
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {["Name", "Email"].map((label, i) => (
              <motion.label
                key={label}
                className="grid gap-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: EASE_OUT }}
              >
                <span className="mono u text-[10px] text-[var(--ink-dim)]">
                  {label} <span className="text-[var(--accent)]">*</span>
                </span>
                <input
                  className="border-b border-[var(--rule)] bg-transparent py-2.5 text-[17px] outline-none transition-colors duration-200 focus:border-[var(--accent)] placeholder:text-[var(--ink-faint)]"
                  placeholder={label === "Name" ? "How should we address you?" : "you@somewhere.example"}
                  type={label === "Email" ? "email" : "text"}
                  required
                />
              </motion.label>
            ))}
          </div>

          <motion.label
            className="mt-5 grid gap-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.22, ease: EASE_OUT }}
          >
            <span className="mono u text-[10px] text-[var(--ink-dim)]">Company</span>
            <input
              className="border-b border-[var(--rule)] bg-transparent py-2.5 text-[17px] outline-none transition-colors duration-200 focus:border-[var(--accent)] placeholder:text-[var(--ink-faint)]"
              placeholder="Studio, brand, institution — or leave blank."
            />
          </motion.label>

          {/* Engagement chips */}
          <motion.div
            className="mt-5 grid gap-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease: EASE_OUT }}
          >
            <span className="mono u text-[10px] text-[var(--ink-dim)]">
              Engagement type <span className="text-[var(--accent)]">*</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {["Identity", "Interface", "Tooling", "Residency", "Consult"].map((item) => (
                <motion.button
                  key={item}
                  type="button"
                  onClick={() => setEngagement(item)}
                  className={`mono u rounded-full border px-3 py-2 text-[11px] transition-colors duration-200 ${
                    engagement === item
                      ? "border-[var(--accent)] bg-[var(--accent)] text-[#0a0a0b]"
                      : "border-[var(--rule)] text-[var(--ink-dim)] hover:border-[var(--ink-dim)] hover:text-[var(--ink)]"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {item === "Identity" ? "Kinetic identity" : item}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Budget slider */}
          <motion.div
            className="mt-5 grid gap-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.37, ease: EASE_OUT }}
          >
            <span className="mono u text-[10px] text-[var(--ink-dim)]">Indicative budget</span>
            <div className="flex items-baseline gap-2 text-[32px] font-medium tracking-[-0.02em]">
              <span className="text-[16px] text-[var(--ink-dim)]">€</span>
              <motion.span
                key={budgetLabel}
                className="text-[var(--accent)]"
                initial={{ opacity: 0.6, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
              >
                {budgetLabel}
              </motion.span>
              <span className="mono u ml-auto text-[10px] text-[var(--ink-faint)]">€5k — €250k</span>
            </div>
            <input
              className="h-1 w-full accent-[var(--accent)]"
              type="range" min="5000" max="250000" step="5000" value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
            <div className="mono u flex justify-between text-[9px] text-[var(--ink-faint)]">
              <span>5k</span><span>25k</span><span>75k</span><span>150k</span><span>250k+</span>
            </div>
          </motion.div>

          {/* Kickoff + referral */}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {["Kickoff", "How did you find us?"].map((label, i) => (
              <motion.label
                key={label}
                className="grid gap-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.42 + i * 0.06, ease: EASE_OUT }}
              >
                <span className="mono u text-[10px] text-[var(--ink-dim)]">{label}</span>
                <select className="border-b border-[var(--rule)] bg-transparent py-2.5 outline-none transition-colors duration-200 focus:border-[var(--accent)]">
                  {label === "Kickoff" ? (
                    <>
                      <option>As soon as possible</option>
                      <option>Within a month</option>
                      <option>Next quarter</option>
                      <option>No rush — exploring</option>
                    </>
                  ) : (
                    <>
                      <option>A friend / referral</option>
                      <option>A previous engagement</option>
                      <option>Our journal</option>
                      <option>Somewhere on the web</option>
                      <option>Other</option>
                    </>
                  )}
                </select>
              </motion.label>
            ))}
          </div>

          {/* Brief textarea */}
          <motion.label
            className="mt-5 grid gap-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.52, ease: EASE_OUT }}
          >
            <span className="mono u flex justify-between text-[10px] text-[var(--ink-dim)]">
              <span>The brief <span className="text-[var(--accent)]">*</span></span>
              <span>{charCount} / 1200</span>
            </span>
            <textarea
              required
              maxLength={1200}
              onChange={(e) => setCharCount(e.target.value.length)}
              className="min-h-[140px] resize-y border-b border-[var(--rule)] bg-transparent py-2.5 text-[15px] leading-[1.5] outline-none transition-colors duration-200 focus:border-[var(--accent)] placeholder:text-[var(--ink-faint)]"
              placeholder="What needs to move? Who for? What's the shape of 'done'?"
            />
          </motion.label>

          <motion.div
            className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] pt-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <span className="mono u text-[10px] text-[var(--ink-faint)]">Encrypted in transit · GDPR · No trackers</span>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="pill">or email directly</button>
              <motion.button
                type="submit"
                className="pill pill-primary"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Send brief →
              </motion.button>
            </div>
          </motion.div>
        </motion.form>

        {/* Sidebar */}
        <aside className="grid gap-6 content-start">

          {/* Studios card */}
          <SideCard delay={0.1}>
            <h3 className="mono u text-[10px] text-[var(--ink-dim)]">Studios</h3>
            <div className="mt-4 grid gap-4">
              {[
                ["Amsterdam", "52.3676° N · 4.9041° E", times.ams, "HQ"],
                ["Mexico City", "19.4326° N · 99.1332° W", times.mex, "SATELLITE"],
                ["Remote", "Worldwide · async-friendly", "≤ 48h", "ALWAYS"],
              ].map(([city, coords, time, tag]) => (
                <div key={city} className="grid grid-cols-[1fr_auto] gap-4 border-b border-[var(--rule)] pb-4 last:border-b-0 last:pb-0">
                  <div>
                    <div className="text-[18px] font-medium tracking-[-0.01em]">
                      {city}
                      <span className="mono u ml-2 text-[10px] text-[var(--ink-faint)]">{tag}</span>
                    </div>
                    <div className="mono mt-1 text-[11px] text-[var(--ink-dim)]">{coords}</div>
                  </div>
                  <div className="mono text-right text-[11px] text-[var(--ink-dim)]">
                    <span>{city === "Remote" ? "Response" : "Local"}</span>
                    <span className="mt-1 block text-[16px] text-[var(--accent)]">{time}</span>
                  </div>
                </div>
              ))}
            </div>
          </SideCard>

          {/* At a glance */}
          <SideCard delay={0.2}>
            <h3 className="mono u text-[10px] text-[var(--ink-dim)]">At a glance</h3>
            <div className="mt-4 grid gap-3">
              {[
                ["Founded", "2021"],
                ["Team", "4 designers"],
                ["Quarter", "Q3 · 2026"],
                ["Availability", "Accepting briefs"],
              ].map(([k, v], i) => (
                <motion.div
                  key={k}
                  className="flex items-center justify-between border-b border-[var(--rule)] pb-3 last:border-b-0"
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.25 + i * 0.06, ease: EASE_OUT }}
                >
                  <span className="mono u text-[11px] text-[var(--ink-dim)]">{k}</span>
                  <span className={`font-medium ${k === "Availability" ? "text-[var(--accent)]" : ""}`}>{v}</span>
                </motion.div>
              ))}
            </div>
          </SideCard>
        </aside>
      </section>

      {/* ── FAQ ── */}
      <section className="section-shell relative z-10 border-t border-[var(--rule)] px-0 py-16">
        <motion.h3
          className="mono u mb-5 text-[12px] text-[var(--ink-dim)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Before you write — a few things we&apos;re often asked
        </motion.h3>
        <div>
          {contactFaq.map((item) => (
            <FaqItem
              key={item.n}
              item={item}
              isOpen={openFaq === item.n}
              onToggle={() => setOpenFaq(openFaq === item.n ? "" : item.n)}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-center border-t border-[var(--rule)] px-8 py-5 text-[11px] text-[var(--ink-dim)] max-[820px]:grid-cols-1 max-[820px]:gap-3 max-[820px]:px-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="mono u">© KEFKA Studio 2021–26</div>
        <div className="mono u justify-self-center max-[820px]:justify-self-start">Contact · Q3 intake</div>
        <div className="mono u justify-self-end flex gap-4 max-[820px]:justify-self-start">
          <TransitionLink href="/">Index↑</TransitionLink>
          <span>Colophon</span>
          <span>RSS</span>
        </div>
      </motion.footer>

      {/* ── Success overlay ── */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(10,10,11,0.85)] p-8 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div
              className="max-w-[520px] w-full rounded-[18px] border border-[var(--rule)] bg-[rgba(15,15,17,0.95)] p-10 text-center"
              initial={{ scale: 0.88, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 12, opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
            >
              <motion.div
                className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-[var(--accent)] text-[26px] font-bold text-[#0a0a0b]"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.15 }}
              >
                ✓
              </motion.div>
              <h3 className="text-[28px] font-medium tracking-[-0.02em]">
                Brief <span className="serif font-normal italic text-[var(--accent)]">received.</span>
              </h3>
              <p className="mx-auto mt-3 max-w-[40ch] text-[14px] leading-[1.55] text-[var(--ink-dim)]">
                Thank you. One of us will reply within two working days. If you don&apos;t hear back in 48 hours, email directly.
              </p>
              <motion.button
                type="button"
                onClick={() => setSubmitted(false)}
                className="pill mt-6"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
