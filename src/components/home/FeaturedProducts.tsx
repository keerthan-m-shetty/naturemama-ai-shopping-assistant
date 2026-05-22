"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Thermometer, MapPin } from "lucide-react";

// ── Static placeholder data (replace with Amplify query) ──────────────────

const FEATURED = [
  {
    slug:        "vitality-complex",
    name:        "Vitality Complex",
    line:        "VITALITY",
    tagline:     "Daily energy & resilience",
    price:       42,
    currency:    "€",
    imageColor:  "from-sage-200 to-sage-100",
    emoji:       "🌱",
    badges:      ["Organic", "Cold-Extracted"],
  },
  {
    slug:        "serenity-blend",
    name:        "Serenity Blend",
    line:        "SERENITY",
    tagline:     "Deep calm & restful sleep",
    price:       38,
    currency:    "€",
    imageColor:  "from-earth-200 to-natural-200",
    emoji:       "🌙",
    badges:      ["Organic", "Traceable"],
  },
  {
    slug:        "immunity-shield",
    name:        "Immunity Shield",
    line:        "IMMUNITY",
    tagline:     "Year-round natural defence",
    price:       45,
    currency:    "€",
    imageColor:  "from-natural-300 to-sage-100",
    emoji:       "🛡️",
    badges:      ["Certified", "Cold-Extracted"],
  },
  {
    slug:        "childrens-daily",
    name:        "Children's Daily",
    line:        "CHILDRENS",
    tagline:     "Gentle support for little ones",
    price:       34,
    currency:    "€",
    imageColor:  "from-sage-100 to-earth-100",
    emoji:       "🌼",
    badges:      ["Organic", "No Additives"],
  },
];

const DIFFERENTIATORS = [
  { icon: Leaf,        label: "100% Organic",      desc: "Ecocert & AB certified" },
  { icon: Thermometer, label: "Cold Extracted",     desc: "Preserves bioactive compounds" },
  { icon: MapPin,      label: "Full Traceability",  desc: "From seed to shelf" },
];

// ── Component ──────────────────────────────────────────────────────────────

export default function FeaturedProducts() {
  return (
    <section aria-labelledby="products-heading" className="py-24 bg-white">
      <div className="section-container">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="section-eyebrow mb-3">Our Collections</p>
            <h2 id="products-heading" className="section-title">
              Crafted for{" "}
              <span className="text-sage-500 italic">Every Journey</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="btn-outline self-start md:self-auto shrink-0"
          >
            View All Products
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {FEATURED.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="card group flex flex-col overflow-hidden"
              aria-label={`${p.name} – ${p.tagline}`}
            >
              {/* Image placeholder */}
              <div
                className={`h-52 bg-gradient-to-br ${p.imageColor}
                             flex items-center justify-center text-5xl
                             transition-transform duration-500 group-hover:scale-105`}
                aria-hidden="true"
              >
                {p.emoji}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-3 flex-1">
                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {p.badges.map((b) => (
                    <span
                      key={b}
                      className="text-[10px] font-semibold text-sage-600
                                 bg-sage-50 border border-sage-100
                                 px-2 py-0.5 rounded-full"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                <div className="flex-1">
                  <h3 className="font-serif text-lg text-earth-900 leading-snug">
                    {p.name}
                  </h3>
                  <p className="text-earth-500 text-sm mt-1">{p.tagline}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-natural-200">
                  <span className="font-serif text-xl text-earth-900">
                    {p.currency}{p.price}
                  </span>
                  <span
                    className="text-sage-500 text-sm font-medium
                               group-hover:translate-x-1 transition-transform duration-200
                               flex items-center gap-1"
                    aria-hidden="true"
                  >
                    Shop <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Differentiators strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-natural-200">
          {DIFFERENTIATORS.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl bg-sage-50 border border-sage-100
                           flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <Icon size={20} className="text-sage-500" />
              </div>
              <div>
                <p className="font-medium text-earth-900">{label}</p>
                <p className="text-earth-500 text-sm mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
