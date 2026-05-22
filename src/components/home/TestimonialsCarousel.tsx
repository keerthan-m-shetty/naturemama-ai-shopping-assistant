"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

// ── Data ───────────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    id: 1,
    name:    "Sophie M.",
    location:"Lyon, France",
    rating:  5,
    product: "Serenity Blend",
    quote:
      "After three weeks with the Serenity Blend, my sleep quality transformed completely. I love knowing exactly where every ingredient comes from — the traceability page is genuinely reassuring.",
    avatar: "/images/avatars/sophie.jpg",
  },
  {
    id: 2,
    name:    "Thomas R.",
    location:"Paris, France",
    rating:  5,
    product: "Vitality Complex",
    quote:
      "As someone who reads every label, NatureMama is the only brand I've found that matches its premium positioning with real transparency. The cold-extraction difference is noticeable.",
    avatar: "/images/avatars/thomas.jpg",
  },
  {
    id: 3,
    name:    "Camille D.",
    location:"Grenoble, France",
    rating:  5,
    product: "Children's Immunity",
    quote:
      "My kids actually ask for their daily drops now. No artificial flavours, no compromise — and the packaging is genuinely beautiful. We've been customers since launch.",
    avatar: "/images/avatars/camille.jpg",
  },
  {
    id: 4,
    name:    "Marc L.",
    location:"Bordeaux, France",
    rating:  5,
    product: "Immunity Shield",
    quote:
      "I recommended NatureMama to my entire running club. The Immunity Shield got us through a tough winter season. The 1% biodiversity pledge sealed the deal for me.",
    avatar: "/images/avatars/marc.jpg",
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "fill-sage-400 text-sage-400" : "text-natural-300"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────

export default function TestimonialsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop:      true,
    align:     "start",
    slidesToScroll: 1,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Auto-play
  useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => clearInterval(id);
  }, [emblaApi]);

  return (
    <section
      aria-label="Customer testimonials"
      className="py-24 bg-natural-100"
    >
      <div className="section-container">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-eyebrow mb-3">What Our Community Says</p>
          <h2 className="section-title">
            Real People,{" "}
            <span className="text-sage-500 italic">Real Results</span>
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-6">
              {TESTIMONIALS.map((t) => (
                <article
                  key={t.id}
                  className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]
                             card p-8 flex flex-col gap-5"
                >
                  {/* Rating + product */}
                  <div className="flex items-center justify-between">
                    <StarRating rating={t.rating} />
                    <span className="text-xs text-sage-500 font-medium bg-sage-50 px-2.5 py-1 rounded-full">
                      {t.product}
                    </span>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-earth-700 leading-relaxed text-[15px] flex-1">
                    <span className="text-sage-300 text-4xl font-serif leading-none mr-1 select-none" aria-hidden="true">"</span>
                    {t.quote}
                    <span className="text-sage-300 text-4xl font-serif leading-none ml-1 select-none" aria-hidden="true">"</span>
                  </blockquote>

                  {/* Author */}
                  <footer className="flex items-center gap-3 pt-4 border-t border-natural-200">
                    {/* Avatar placeholder (replace with next/image when assets exist) */}
                    <div
                      className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center
                                 text-sage-600 font-serif font-bold text-sm shrink-0"
                      aria-hidden="true"
                    >
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-earth-900 text-sm">{t.name}</p>
                      <p className="text-earth-400 text-xs">{t.location}</p>
                    </div>
                    {/* Verified badge */}
                    <span
                      className="ml-auto text-[10px] text-sage-600 font-medium
                                 border border-sage-200 rounded-full px-2 py-0.5"
                    >
                      ✓ Verified
                    </span>
                  </footer>
                </article>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Previous testimonial"
            className="absolute -left-5 top-1/2 -translate-y-1/2
                       w-10 h-10 rounded-full bg-white shadow-md border border-natural-200
                       flex items-center justify-center
                       text-earth-700 hover:text-sage-600 hover:border-sage-300
                       disabled:opacity-30 disabled:cursor-not-allowed
                       transition-all duration-200 z-10"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            aria-label="Next testimonial"
            className="absolute -right-5 top-1/2 -translate-y-1/2
                       w-10 h-10 rounded-full bg-white shadow-md border border-natural-200
                       flex items-center justify-center
                       text-earth-700 hover:text-sage-600 hover:border-sage-300
                       disabled:opacity-30 disabled:cursor-not-allowed
                       transition-all duration-200 z-10"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Dot indicators */}
        <div
          className="flex justify-center gap-2 mt-8"
          role="tablist"
          aria-label="Testimonial slides"
        >
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === selectedIndex}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={[
                "rounded-full transition-all duration-300",
                i === selectedIndex
                  ? "w-6 h-2 bg-sage-500"
                  : "w-2 h-2 bg-natural-300 hover:bg-sage-300",
              ].join(" ")}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
