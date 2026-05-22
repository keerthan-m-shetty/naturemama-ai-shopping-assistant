"use client";

import { useEffect, useRef } from "react";

// ── Data ───────────────────────────────────────────────────────────────────

const STATS = [
  { value: "1%",    label: "Revenue to Biodiversity" },
  { value: "100%",  label: "Recyclable Packaging" },
  { value: "0",     label: "Synthetic Additives" },
  { value: "3rd",   label: "Party Lab Tested" },
  { value: "2023",  label: "Founded in the Alps" },
  { value: "4.9★",  label: "Average Customer Rating" },
  { value: "12+",   label: "Pharmacy Partners" },
  { value: "Cold",  label: "Extraction Process" },
];

// Duplicate for seamless infinite scroll
const TICKER_ITEMS = [...STATS, ...STATS];

// ── Component ──────────────────────────────────────────────────────────────

export default function StatsBanner() {
  const trackRef = useRef<HTMLDivElement>(null);

  // Pause on hover / focus for accessibility
  const pause  = () => { if (trackRef.current) trackRef.current.style.animationPlayState = "paused"; };
  const resume = () => { if (trackRef.current) trackRef.current.style.animationPlayState = "running"; };

  return (
    <section
      id="stats-banner"
      aria-label="Impact statistics"
      className="bg-sage-500 py-5 overflow-hidden"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
    >
      <div
        ref={trackRef}
        className="flex gap-0 animate-ticker whitespace-nowrap"
        aria-hidden="true"   // decorative; key stats are in the page body
      >
        {TICKER_ITEMS.map((item, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-3 px-10 shrink-0"
          >
            {/* Decorative separator */}
            <span className="text-sage-300/60 text-lg select-none">✦</span>

            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl text-white font-bold leading-none">
                {item.value}
              </span>
              <span className="text-sage-100/80 text-sm font-medium tracking-wide">
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Screen-reader accessible version */}
      <ul className="sr-only">
        {STATS.map((s) => (
          <li key={s.label}>
            {s.value} — {s.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
