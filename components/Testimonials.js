"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { TESTIMONIALS } from "@/lib/testimonials";

const STAR =
  "M12 .587l3.668 7.431 8.2 1.192-5.934 5.784 1.401 8.169L12 18.897l-7.335 3.856 1.401-8.169L.132 9.21l8.2-1.192z";

function Stars({ n }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`Rated ${n} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
          className={i < n ? "text-gold" : "text-white/20"}>
          <path d={STAR} />
        </svg>
      ))}
    </div>
  );
}

function initials(name) {
  return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function Testimonials({ images = [] }) {
  const items = TESTIMONIALS;
  const count = items.length;
  const pool = images.length
    ? images
    : ["https://images.unsplash.com/photo-1469474968028-56623f02e42e"];

  const [i, setI] = useState(0);        // which quote
  const [tick, setTick] = useState(0);  // drives the image rotation
  const [paused, setPaused] = useState(false);

  const go = useCallback((dir) => setI((p) => (p + dir + count) % count), [count]);

  useEffect(() => {
    if (typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (paused) return;
    const quotes = count > 1 ? setInterval(() => setI((p) => (p + 1) % count), 6500) : null;
    const imgs = setInterval(() => setTick((t) => t + 1), 2800);
    return () => { if (quotes) clearInterval(quotes); clearInterval(imgs); };
  }, [count, paused]);

  if (count === 0) return null;

  const t = items[i];
  const mainSrc = pool[tick % pool.length];
  const secondSrc = pool[(tick + 1) % pool.length];

  return (
    <section
      className="relative overflow-hidden bg-ink text-white py-20 sm:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ambient gold glows */}
      <div className="pointer-events-none absolute -top-32 -right-24 w-96 h-96 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT — words */}
        <div>
          <p className="text-gold font-semibold uppercase tracking-wide text-xs mb-4">Happy travellers</p>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold leading-[1.08] mb-8">
            Smiles from
            <br />
            the road.
          </h2>

          {/* re-keyed on `i` so it re-animates each time the quote changes */}
          <div key={i} className="quote-in">
            <span className="font-display text-6xl text-gold/30 leading-none block mb-1" aria-hidden="true">&ldquo;</span>
            <blockquote className="font-display text-2xl sm:text-[26px] leading-snug font-medium mb-7 -mt-3 max-w-lg">
              {t.quote}
            </blockquote>
            <Stars n={t.rating} />
            <div className="flex items-center gap-4 mt-6">
              <div className="w-12 h-12 rounded-full bg-gold text-ink font-bold flex items-center justify-center shrink-0">
                {initials(t.author)}
              </div>
              <div>
                <p className="font-semibold">{t.author}</p>
                <p className="text-sm text-white/60">{t.trip}</p>
              </div>
            </div>
          </div>

          {/* controls */}
          <div className="flex items-center gap-3 mt-10">
            <button onClick={() => go(-1)} aria-label="Previous testimonial"
              className="w-11 h-11 rounded-full border border-white/25 flex items-center justify-center hover:bg-white hover:text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={() => go(1)} aria-label="Next testimonial"
              className="w-11 h-11 rounded-full border border-white/25 flex items-center justify-center hover:bg-white hover:text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex gap-1.5 ml-2">
              {items.map((_, d) => (
                <button key={d} onClick={() => setI(d)} aria-label={`Go to testimonial ${d + 1}`}
                  aria-current={d === i}
                  className={`h-2 rounded-full transition-all ${d === i ? "w-6 bg-gold" : "w-2 bg-white/25 hover:bg-white/40"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — rotating image showcase. Click anywhere on it to advance. */}
        <div className="flex justify-center lg:justify-end">
          <div
            className="group relative w-full max-w-sm cursor-pointer select-none"
            onClick={() => count > 1 && go(1)}
          >
            {/* main portrait — flips to a new photo every few seconds */}
            <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden ring-1 ring-white/15 shadow-2xl">
              <Image
                key={`m-${tick}`}
                src={mainSrc}
                alt=""
                fill
                sizes="(max-width: 1024px) 90vw, 380px"
                className="flip-in object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
            </div>

            {/* smaller overlapping tile behind — depth + a second rotating photo */}
            <div className="absolute -bottom-6 -left-6 w-32 h-40 rounded-3xl overflow-hidden ring-1 ring-white/15 shadow-xl hidden sm:block transition-transform duration-500 group-hover:-translate-x-2 group-hover:translate-y-2">
              <Image
                key={`s-${tick}`}
                src={secondSrc}
                alt=""
                fill
                sizes="160px"
                className="flip-in object-cover"
                style={{ animationDelay: "150ms" }}
              />
            </div>

            {/* glass quote chip — replaces the old bright-gold block */}
            <div className="absolute -top-5 -right-4 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-gold/40 flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-1">
              <span className="font-display text-4xl text-gold leading-none -mt-2" aria-hidden="true">&ldquo;</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}