import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";

// Small inline icons so we don't pull in an icon dependency. Each is a plain
// stroke glyph that reads at 24px inside the circle.
const ICONS = {
  route: (
    <path d="M6 19a3 3 0 100-6 3 3 0 000 6zM18 11a3 3 0 100-6 3 3 0 000 6zM8.5 16.5c4-.5 3-6 7-6.5M6 13V9M18 15v-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  chat: (
    <path d="M4 5h16v10H9l-4 4v-4H4V5z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  tag: (
    <path d="M12.5 3H20v7.5L10.5 20 3 12.5 12.5 3zM16.5 7.5h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  shield: (
    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3zM9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
};

const FEATURES = [
  { icon: "route", title: "Routes we've walked", body: "Every itinerary is planned by someone who's actually done the trip." },
  { icon: "chat", title: "Real humans on call", body: "Reach a person who knows your plan — before and during your travels." },
  { icon: "tag", title: "Upfront pricing", body: "You see exactly what's included. No surprise add-ons after you pay." },
  { icon: "shield", title: "Handpicked & safe", body: "Stays, drivers and guides we use on repeat, not just top listings." },
];

export default function AboutStory({ images = [], showFeatures = true }) {
  const tiles = images.slice(0, 3);

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT — headline */}
        <Reveal>
          <p className="airport-code mb-4">Our story</p>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-ink dark:text-white leading-[1.08] mb-6">
            Global journeys,
            <br />
            planned to feel personal.
          </h2>
          <p className="text-graytext dark:text-white/60 text-lg mb-8 max-w-md">
            Travell Bee started in Indore with a simple idea: plan a small number
            of trips really well, instead of a large number of trips generically.
            Every route is shaped around your dates, pace and budget.
          </p>
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 bg-gold text-ink font-semibold px-6 py-3 rounded-full hover:bg-ink hover:text-white transition-colors"
          >
            Explore destinations
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </Reveal>

        {/* RIGHT — expanding accordion. Every tile is flex-1 at rest, so all
            three share the row equally. Hovering one grows its flex-grow to
            2.6, and because the row width is fixed the other two shrink into
            strips automatically. The middle tile is the default focal so the
            cluster doesn't look flat before the user hovers. */}
        <Reveal delay={150}>
          <div className="flex gap-3 sm:gap-4 h-80 sm:h-96">
            {tiles.map((src, i) => (
              <div
                key={i}
                className={`group/img relative basis-0 min-w-0 rounded-[20px] overflow-hidden shadow-card
                  transition-[flex-grow] duration-500 ease-out hover:grow-[2.6]
                  ${i === 1 ? "grow-[1.8]" : "grow"}`}
              >
                {src && (
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 33vw, 300px"
                    className="object-cover transition-transform duration-700 group-hover/img:scale-105"
                  />
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* FEATURE ROW */}
      {showFeatures && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pt-12 border-t border-black/5 dark:border-white/10">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 100}>
              <div className="w-12 h-12 rounded-full bg-gold/15 text-goldDark dark:text-gold flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24">{ICONS[f.icon]}</svg>
              </div>
              <h3 className="font-display font-bold text-ink dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-graytext dark:text-white/60">{f.body}</p>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}