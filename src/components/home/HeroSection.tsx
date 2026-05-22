"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Play, Pause } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

interface HeroSlide {
  videoSrc:    string;   // path to /public/videos/
  posterSrc:   string;   // fallback image
  eyebrow:     string;
  headline:    string;
  subheadline: string;
  ctaPrimary:  { label: string; href: string };
  ctaSecondary:{ label: string; href: string };
}

// ── Slide data ─────────────────────────────────────────────────────────────
// Replace videoSrc / posterSrc with your actual assets.

const SLIDES: HeroSlide[] = [
  {
    videoSrc:    "/videos/hero-alps.mp4",
    posterSrc:   "/images/hero-alps-poster.jpg",
    eyebrow:     "From the French Alps, with care",
    headline:    "Nature's Wisdom,\nBottled for You.",
    subheadline:
      "Premium wellness supplements crafted from wild-harvested alpine botanicals — traceable, organic, and cold-extracted to preserve every vital compound.",
    ctaPrimary:  { label: "Discover Our Products", href: "/products" },
    ctaSecondary:{ label: "Our Story",             href: "/history" },
  },
  {
    videoSrc:    "/videos/hero-harvest.mp4",
    posterSrc:   "/images/hero-harvest-poster.jpg",
    eyebrow:     "100% Organic & Certified",
    headline:    "Rooted in Tradition,\nBacked by Science.",
    subheadline:
      "Every batch is third-party tested, Ecocert certified, and traceable from seed to shelf. Wellness you can trust completely.",
    ctaPrimary:  { label: "Take the Wellness Quiz", href: "/products#quiz" },
    ctaSecondary:{ label: "Our Commitments",        href: "/history#commitments" },
  },
];

// ── Component ──────────────────────────────────────────────────────────────

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying,   setIsPlaying]   = useState(true);
  const [isLoaded,    setIsLoaded]    = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slide = SLIDES[activeSlide];

  // Auto-advance slides every 8 s
  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 8000);
  };

  useEffect(() => {
    startInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync video playback with isPlaying state
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === activeSlide) {
        isPlaying ? v.play().catch(() => {}) : v.pause();
      } else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, [activeSlide, isPlaying]);

  const togglePlay = () => {
    setIsPlaying((p) => !p);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isPlaying) startInterval();
  };

  const goToSlide = (index: number) => {
    setActiveSlide(index);
    if (intervalRef.current) clearInterval(intervalRef.current);
    startInterval();
  };

  const scrollToContent = () => {
    document.getElementById("stats-banner")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      aria-label="Hero"
      className="relative h-screen min-h-[600px] max-h-[1080px] overflow-hidden bg-earth-900"
    >
      {/* ── Background Videos ─────────────────────────────────────────── */}
      {SLIDES.map((s, i) => (
        <video
          key={i}
          ref={(el) => { videoRefs.current[i] = el; }}
          src={s.videoSrc}
          poster={s.posterSrc}
          muted
          loop
          playsInline
          autoPlay={i === 0}
          onCanPlay={() => { if (i === 0) setIsLoaded(true); }}
          className={[
            "absolute inset-0 w-full h-full object-cover",
            "transition-opacity duration-1000",
            i === activeSlide ? "opacity-100" : "opacity-0",
          ].join(" ")}
          aria-hidden="true"
        />
      ))}

      {/* ── Gradient Overlay ──────────────────────────────────────────── */}
      {/* Multi-layer overlay: bottom-heavy for text legibility + subtle vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-earth-900/85 via-earth-900/30 to-earth-900/20"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-earth-900/40 via-transparent to-transparent"
      />

      {/* ── Sage accent line (top) ────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sage-400/60 to-transparent"
      />

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-24 md:pb-28">
        <div className="section-container">
          <div className="max-w-3xl">

            {/* Eyebrow */}
            <p
              key={`eyebrow-${activeSlide}`}
              className="section-eyebrow text-sage-300 mb-4
                         animate-fade-up animate-fill-both opacity-0"
            >
              {slide.eyebrow}
            </p>

            {/* Headline */}
            <h1
              key={`headline-${activeSlide}`}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white
                         leading-[1.1] tracking-tight whitespace-pre-line mb-6
                         animate-fade-up animate-fill-both opacity-0 animation-delay-200"
            >
              {slide.headline}
            </h1>

            {/* Subheadline */}
            <p
              key={`sub-${activeSlide}`}
              className="text-natural-200/80 text-lg md:text-xl leading-relaxed
                         max-w-xl mb-10
                         animate-fade-up animate-fill-both opacity-0 animation-delay-400"
            >
              {slide.subheadline}
            </p>

            {/* CTAs */}
            <div
              key={`cta-${activeSlide}`}
              className="flex flex-wrap gap-4
                         animate-fade-up animate-fill-both opacity-0 animation-delay-600"
            >
              <Link href={slide.ctaPrimary.href} className="btn-primary group">
                {slide.ctaPrimary.label}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <Link href={slide.ctaSecondary.href} className="btn-secondary">
                {slide.ctaSecondary.label}
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ── Trust Badges ──────────────────────────────────────────────── */}
      <div
        className="absolute bottom-8 right-6 md:right-10 z-10
                   flex flex-col gap-2
                   animate-fade-in animate-fill-both opacity-0 animation-delay-1000"
      >
        {[
          { icon: "🌿", label: "100% Organic" },
          { icon: "🏔️", label: "French Alps" },
          { icon: "🔬", label: "Lab Certified" },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md
                       border border-white/20 rounded-full px-3 py-1.5
                       text-white text-xs font-medium"
          >
            <span aria-hidden="true">{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Slide Controls ────────────────────────────────────────────── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10
                   flex items-center gap-4"
        role="group"
        aria-label="Slide controls"
      >
        {/* Dot indicators */}
        <div className="flex items-center gap-2" role="tablist">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeSlide}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goToSlide(i)}
              className={[
                "rounded-full transition-all duration-500",
                i === activeSlide
                  ? "w-8 h-2 bg-sage-400"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70",
              ].join(" ")}
            />
          ))}
        </div>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          className="w-8 h-8 flex items-center justify-center
                     rounded-full border border-white/30 text-white/70
                     hover:text-white hover:border-white/60
                     transition-all duration-200"
        >
          {isPlaying
            ? <Pause size={14} aria-hidden="true" />
            : <Play  size={14} aria-hidden="true" />
          }
        </button>
      </div>

      {/* ── Scroll Cue ────────────────────────────────────────────────── */}
      <button
        onClick={scrollToContent}
        aria-label="Scroll to content"
        className="absolute bottom-8 left-6 md:left-10 z-10
                   flex flex-col items-center gap-1.5
                   text-white/50 hover:text-white/80
                   transition-colors duration-200
                   animate-fade-in animate-fill-both opacity-0 animation-delay-1000"
      >
        <span className="text-[10px] font-medium tracking-[0.15em] uppercase rotate-90 origin-center mb-2">
          Scroll
        </span>
        <ChevronDown
          size={18}
          className="animate-bounce"
          aria-hidden="true"
        />
      </button>

      {/* ── Loading shimmer (shown before video loads) ────────────────── */}
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-earth-900 animate-pulse z-0"
        />
      )}
    </section>
  );
}
