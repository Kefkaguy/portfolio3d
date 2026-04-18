"use client";

import { useMemo, useState } from "react";
import { OrbitChrome } from "./orbit-chrome";
import { journalEntries } from "./orbit-data";
import { OrbitScene } from "./orbit-scene";

const tabs = ["all", "Essay", "Process", "Dispatch"];

export default function JournalPage() {
  const [activeTab, setActiveTab] = useState("all");
  const visibleEntries = useMemo(
    () => journalEntries.filter((entry) => activeTab === "all" || entry.type === activeTab),
    [activeTab],
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--ink)]">
      <OrbitScene variant="journal" />
      <OrbitChrome
        activePath="/journal"
        ctaHref="/contact"
        ctaLabel="Subscribe →"
        navMeta="Issue 14 · Apr 2026"
        leftRail="KEFKA · FIELD NOTES · 47 ENTRIES"
        rightRail="READING TIME · ~ 6 MIN / ENTRY"
        progressStorageKey="orbit_journal_scroll"
      />

      <header className="section-shell relative z-10 px-0 pt-[140px] pb-10 max-[820px]:pt-[110px]">
        <div className="eyebrow mono u"><span className="eyebrow-bar" />03 · Journal</div>
        <h1 className="mt-5 text-[clamp(56px,9vw,140px)] leading-[0.9] font-medium tracking-[-0.035em]">
          Field notes <span className="serif font-normal italic text-[var(--accent)]">from</span>
          <br />
          <span className="font-light text-[var(--ink-dim)]">a studio that keeps</span>
          <br />
          rewriting its tools.
        </h1>
        <div className="mt-9 grid gap-6 border-t border-[var(--rule)] pt-5 md:grid-cols-[1fr_auto] md:items-center">
          <p className="max-w-[52ch] text-[14px] leading-[1.55] text-[var(--ink-dim)]">
            Short essays, studio post-mortems, and the occasional rant about kerning. Published irregularly, whenever the pieces stop moving long enough to be written down.
          </p>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`mono u rounded-full border px-3 py-1.5 text-[11px] transition ${activeTab === tab ? "border-[var(--accent)] bg-[var(--accent)] text-[#0a0a0b]" : "border-[var(--rule)] text-[var(--ink-dim)] hover:border-[var(--ink-dim)] hover:text-[var(--ink)]"}`}
              >
                {tab === "all" ? "All" : `${tab}s`}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="relative z-10 h-screen px-5">
        <div className="section-shell sticky top-0 grid h-screen content-center py-20">
          <div className="mono u flex items-center gap-3 text-[11px] text-[var(--ink-dim)]">
            <span className="size-1.5 rounded-full bg-[var(--accent)]" />
            Featured · Issue 14 · 11 min
          </div>
          <h2 className="mt-4 max-w-[16ch] text-[clamp(48px,7vw,108px)] leading-[0.95] font-medium tracking-[-0.03em]">
            On the difference between a <span className="serif font-normal italic text-[var(--accent)]">form</span> and a formula.
          </h2>
          <p className="mt-5 max-w-[60ch] text-[15px] leading-[1.6] text-[var(--ink-dim)]">
            Generative design is often mistaken for decoration-by-algorithm. We&apos;ve spent five years arguing otherwise: a good generative system is closer to grammar than to a pattern generator.
          </p>
          <div className="mono u mt-7 flex flex-wrap gap-8 text-[13px] text-[var(--ink-dim)]">
            <span className="flex flex-col gap-1"><span>Author</span><span className="normal-case text-[14px] text-[var(--ink)]">Noa Helbig</span></span>
            <span className="flex flex-col gap-1"><span>Published</span><span className="normal-case text-[14px] text-[var(--ink)]">14 Apr 2026</span></span>
            <span className="flex flex-col gap-1"><span>Filed under</span><span className="normal-case text-[14px] text-[var(--ink)]">Essay · Studio</span></span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="pill pill-primary">Read the essay →</button>
            <button type="button" className="pill">Listen (12:04)</button>
          </div>
        </div>
      </section>

      <section className="section-shell relative z-10 bg-[var(--bg)] px-0 py-20">
        <div className="mb-5 flex items-baseline justify-between border-b border-[var(--rule)] pb-4">
          <h3 className="mono u text-[12px] text-[var(--ink-dim)]">Recent entries</h3>
          <span className="mono text-[11px] text-[var(--ink-faint)]">— {String(visibleEntries.length).padStart(2, "0")} of 47 shown</span>
        </div>
        {visibleEntries.map((entry) => (
          <div key={entry.idx} className="group grid cursor-pointer gap-6 border-b border-[var(--rule)] py-8 transition hover:px-4 md:grid-cols-[80px_120px_1fr_140px_40px] md:items-baseline">
            <div className="mono text-[11px] text-[var(--ink-faint)]">{String(entry.idx).padStart(3, "0")}</div>
            <div className="mono u text-[11px] text-[var(--ink-dim)] max-md:hidden">{entry.date}</div>
            <div className="text-[clamp(22px,2.3vw,32px)] leading-[1.1] font-medium tracking-[-0.015em]">
              {entry.title}
              <span className="mt-2 block max-w-[58ch] text-[13px] leading-[1.5] font-normal text-[var(--ink-dim)]">{entry.sub}</span>
            </div>
            <div className="mono u flex flex-col gap-1 text-[10px] text-[var(--ink-dim)] max-md:hidden">
              <span>{entry.type}</span>
              <span>{entry.author}</span>
              <span className="text-[var(--accent)]">{entry.read}</span>
            </div>
            <div className="hidden size-7 place-items-center rounded-full border border-[var(--rule)] text-[var(--ink-dim)] transition group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] md:grid">→</div>
          </div>
        ))}
      </section>

      <section className="section-shell relative z-10 grid gap-12 border-t border-[var(--rule)] px-0 py-20 md:grid-cols-2 md:items-center">
        <h3 className="max-w-[16ch] text-[clamp(28px,3.4vw,46px)] leading-[1.05] font-medium tracking-[-0.02em]">
          A quiet newsletter. Sent <span className="serif font-normal italic text-[var(--accent)]">when we finish thinking.</span>
        </h3>
        <div className="grid gap-3">
          <p className="max-w-[44ch] text-[13px] leading-[1.55] text-[var(--ink-dim)]">
            One email a month, give or take. No tracking, no content calendar, just the next essay, a studio dispatch, and occasionally a plot from something we&apos;re building.
          </p>
          <form className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-full border border-[var(--rule)] px-4 py-1.5">
            <input className="bg-transparent py-2 outline-none placeholder:text-[var(--ink-faint)]" type="email" placeholder="you@somewhere.example" />
            <button type="submit" className="pill pill-primary">Subscribe</button>
          </form>
          <div className="mono u flex gap-4 text-[10px] text-[var(--ink-faint)]">
            <span>2,140 readers</span>
            <span>No spam · unsubscribe any time</span>
          </div>
        </div>
      </section>
    </div>
  );
}
