import Link from "next/link";
import Image from "next/image";

/**
 * Premium call-to-action card for custom trip planning.
 *
 * Change the two CTA targets below to suit your routes:
 *  - primary  → send to a dedicated custom-itinerary page when you build one
 *               (for now it points to the on-page enquiry form: #enquire)
 *  - secondary → your contact page / team
 */
export default function CustomTripCTA({ image }) {
  const cover =
    image || "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2";

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="group relative overflow-hidden rounded-[32px] ring-1 ring-white/10 shadow-2xl min-h-[440px] flex">
        {/* background image (slow zoom on hover) */}
        <Image
          src={cover}
          alt=""
          fill
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />

        {/* legibility gradient + faint honeycomb texture */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/75 to-ink/20" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="pointer-events-none absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-gold/15 blur-3xl" />

        {/* content */}
        <div className="relative z-10 flex flex-col justify-center p-10 sm:p-14 max-w-xl text-white">
          <p className="text-gold font-semibold uppercase tracking-wide text-xs mb-4">Bespoke journeys</p>
          <h2 className="font-display text-3xl sm:text-[42px] font-extrabold leading-[1.08] mb-4">
            Can&apos;t find your trip?
            <br />
            We&apos;ll build it around you.
          </h2>
          <p className="text-white/75 text-lg mb-7 max-w-md">
            Tell us the where, when and who — our planners design a day-by-day
            route made just for you, priced upfront with no obligation to book.
          </p>

          {/* trust chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {["Handpicked routes", "24-hour callback", "No booking obligation"].map((t) => (
              <span
                key={t}
                className="text-xs font-medium text-white/85 border border-white/20 rounded-full px-3 py-1.5 backdrop-blur-sm"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* PRIMARY — repoint to your custom-itinerary page when it exists */}
            <Link
              href="#enquire"
              className="inline-flex items-center gap-2 bg-gold text-ink font-semibold px-7 py-3.5 rounded-full hover:bg-white transition-colors"
            >
              Plan my custom trip
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            {/* SECONDARY — contact the team */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-full border-2 border-white/30 text-white hover:border-white transition-colors"
            >
              Talk to a planner
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}