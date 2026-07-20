"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const DURATIONS = [
  { label: "2–3 days", stops: 3 },
  { label: "4–6 days", stops: 5 },
  { label: "7+ days", stops: 7 },
];
const TRAVELLERS = ["Solo", "Couple", "Family", "Group"];

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold
        ${active
          ? "bg-gold text-ink border-gold"
          : "border-white/20 text-white/80 hover:border-white/50 hover:text-white"}`}
    >
      {children}
    </button>
  );
}

export default function TripBuilder({ destinations = [], themes = [] }) {
  const dests = destinations.filter((d) => d.coverImage);

  const [destSlug, setDestSlug] = useState(dests[0]?.slug || "");
  const [vibe, setVibe] = useState(themes[0] || "");
  const [dur, setDur] = useState(DURATIONS[1]);
  const [who, setWho] = useState(TRAVELLERS[1]);

  const dest = useMemo(
    () => dests.find((d) => d.slug === destSlug) || dests[0],
    [destSlug, dests]
  );

  if (!dest) return null; // nothing to build without destinations

  const params = new URLSearchParams({
    to: dest.slug,
    vibe,
    days: dur.label,
    who,
  }).toString();

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="relative overflow-hidden rounded-[32px] bg-ink text-white p-8 sm:p-12 shadow-2xl">
        {/* honeycomb dot texture + gold glow */}
        <div className="pointer-events-none absolute -top-24 -right-16 w-80 h-80 rounded-full bg-gold/20 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative grid lg:grid-cols-2 gap-10 items-center">
          {/* LEFT — the builder */}
          <div>
            <p className="text-gold font-semibold uppercase tracking-wide text-xs mb-4">Design your trip</p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
              Build a custom itinerary
              <br className="hidden sm:block" /> in a few taps.
            </h2>
            <p className="text-white/60 mb-8 max-w-md">
              Pick a starting point and we&apos;ll shape a day-by-day route around
              it — priced upfront, with no obligation to book.
            </p>

            <div className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Where to</p>
                <div className="flex flex-wrap gap-2">
                  {dests.slice(0, 6).map((d) => (
                    <Chip key={d.slug} active={d.slug === destSlug} onClick={() => setDestSlug(d.slug)}>
                      {d.name}
                    </Chip>
                  ))}
                </div>
              </div>

              {themes.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Vibe</p>
                  <div className="flex flex-wrap gap-2">
                    {themes.slice(0, 5).map((th) => (
                      <Chip key={th} active={th === vibe} onClick={() => setVibe(th)}>
                        {th}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-x-10 gap-y-5">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/40 mb-2">How long</p>
                  <div className="flex flex-wrap gap-2">
                    {DURATIONS.map((d) => (
                      <Chip key={d.label} active={d.label === dur.label} onClick={() => setDur(d)}>
                        {d.label}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Who&apos;s going</p>
                  <div className="flex flex-wrap gap-2">
                    {TRAVELLERS.map((w) => (
                      <Chip key={w} active={w === who} onClick={() => setWho(w)}>
                        {w}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link
              href={`/?${params}#enquire`}
              className="inline-flex items-center gap-2 bg-gold text-ink font-semibold px-7 py-3.5 rounded-full hover:bg-white transition-colors mt-8"
            >
              Start my custom itinerary
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* RIGHT — live preview that updates as they choose */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden ring-1 ring-white/15 shadow-2xl bg-white/5 backdrop-blur">
              <div className="relative h-48">
                <Image
                  key={dest.slug}
                  src={dest.coverImage}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 1024px) 90vw, 480px"
                  className="flip-in object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="font-display text-2xl font-bold">{dest.name}</p>
                  <p className="text-xs text-white/75">
                    {vibe ? `${vibe} · ` : ""}{who} · {dur.label}
                  </p>
                </div>
              </div>

              {/* bee route — waypoints redraw when duration changes */}
              <div className="p-6">
                <p className="text-xs uppercase tracking-wide text-white/40 mb-4">Your route preview</p>
                <div className="flex items-center flex-wrap gap-y-3">
                  {Array.from({ length: dur.stops }).map((_, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-7 h-7 rounded-full bg-gold text-ink text-[11px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      {idx < dur.stops - 1 && (
                        <span className="w-5 sm:w-7 border-t-2 border-dashed border-gold/40" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-6 text-sm">
                  <span className="text-white/60">Priced upfront · callback in 24h</span>
                  <span className="text-gold font-semibold">{dur.label} planned</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}