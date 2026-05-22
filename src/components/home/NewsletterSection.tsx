"use client";

import { useState, type FormEvent } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

const client = generateClient<Schema>();

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterSection() {
  const [email,  setEmail]  = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error,  setError]  = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setError("");

    try {
      // client.models is only available after Amplify is configured with a
      // deployed backend. In local UI-preview mode this will throw — we catch
      // it gracefully so the rest of the page still works.
      await client.models.NewsletterSubscriber.create({
        email:  email.trim().toLowerCase(),
        source: "homepage",
      });
      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error(err);
      setError("Backend not connected yet. Deploy the Amplify sandbox first.");
      setStatus("error");
    }
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="py-24 bg-sage-500 relative overflow-hidden"
    >
      {/* Decorative background circles */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full
                   bg-sage-400/30 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full
                   bg-earth-700/20 blur-3xl pointer-events-none"
      />

      <div className="section-container relative z-10">
        <div className="max-w-2xl mx-auto text-center">

          {/* Eyebrow */}
          <p className="text-sage-200 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Join Our Community
          </p>

          {/* Heading */}
          <h2
            id="newsletter-heading"
            className="font-serif text-4xl md:text-5xl text-white leading-tight mb-5"
          >
            Wellness Wisdom,{" "}
            <span className="italic text-sage-200">Delivered Monthly</span>
          </h2>

          {/* Body */}
          <p className="text-sage-100/80 text-lg leading-relaxed mb-10">
            Seasonal recipes, expert wellness guides, early access to new products,
            and stories from our alpine producers — no spam, ever.
          </p>

          {/* Form */}
          {status === "success" ? (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center justify-center gap-3
                         bg-white/15 backdrop-blur-sm rounded-2xl px-8 py-5
                         text-white"
            >
              <CheckCircle2 size={24} className="text-sage-200 shrink-0" aria-hidden="true" />
              <p className="font-medium">
                You're in! Check your inbox for a welcome gift. 🌿
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              noValidate
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
                disabled={status === "loading"}
                className="flex-1 px-5 py-3.5 rounded-full
                           bg-white/15 backdrop-blur-sm
                           border border-white/30
                           text-white placeholder:text-white/50
                           focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60
                           disabled:opacity-60
                           transition-all duration-200"
              />
              <button
                type="submit"
                disabled={status === "loading" || !email}
                className="inline-flex items-center justify-center gap-2
                           bg-white text-sage-700 font-medium
                           px-7 py-3.5 rounded-full
                           hover:bg-natural-100 hover:shadow-lg hover:-translate-y-0.5
                           disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0
                           transition-all duration-300
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                {status === "loading" ? (
                  <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight size={16} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Error message */}
          {status === "error" && (
            <p role="alert" className="mt-3 text-red-200 text-sm">
              {error}
            </p>
          )}

          {/* Privacy note */}
          <p className="mt-5 text-sage-200/60 text-xs">
            By subscribing you agree to our{" "}
            <a href="/privacy" className="underline hover:text-sage-100 transition-colors">
              Privacy Policy
            </a>
            . Unsubscribe anytime.
          </p>

        </div>
      </div>
    </section>
  );
}
