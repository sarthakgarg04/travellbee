import Link from "next/link";
import Image from "next/image";

function GalleryCard({ d, duplicate = false }) {
  // Real, published-only count computed on the server (see getDestinations in
  // app/page.js). Falls back to the admin _count shape if that's what's passed.
  const tours = d.packages?.length ?? d._count?.packages ?? 0;

  return (
    <Link
      href={`/destinations/${d.slug}`}
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? -1 : undefined}
      className="group/card relative block w-64 sm:w-72 h-72 sm:h-80 shrink-0 mx-3 rounded-[20px] overflow-hidden shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <Image
        src={d.coverImage}
        alt={d.name}
        fill
        sizes="288px"
        className="object-cover transition-transform duration-700 group-hover/card:scale-110"
      />

      {/* darkening scrim, only on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

      {/* reveal card — slides up + fades in on hover */}
      <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300">
        <div className="flex items-center justify-between gap-3 bg-white dark:bg-[#1C1C1C] rounded-2xl px-4 py-3 shadow-card">
          <div className="min-w-0">
            <p className="font-display font-bold text-ink dark:text-white truncate">{d.name}</p>
            <p className="text-xs text-graytext dark:text-white/50">
              {tours} {tours === 1 ? "Tour" : "Tours"}
            </p>
          </div>
          <span className="shrink-0 w-10 h-10 rounded-full bg-gold text-ink flex items-center justify-center transition-transform group-hover/card:translate-x-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

// One visual row. The list is duplicated once so the CSS translateX(-50%)
// loop is seamless; the second copy is hidden from screen readers/keyboard.
function Row({ items, reverse = false }) {
  return (
    <div className={reverse ? "marquee-rev" : "marquee-track"}>
      {items.map((d, i) => (
        <GalleryCard key={`a-${d.id ?? i}`} d={d} />
      ))}
      {items.map((d, i) => (
        <GalleryCard key={`b-${d.id ?? i}`} d={d} duplicate />
      ))}
    </div>
  );
}

export default function DestinationGallery({ destinations = [] }) {
  if (destinations.length === 0) return null;

  // Split into two rows; if there's only a handful, both rows reuse the set
  // so the effect still reads as two moving bands.
  const mid = Math.ceil(destinations.length / 2);
  const top = destinations.slice(0, mid);
  const bottomSlice = destinations.slice(mid);
  const bottom = bottomSlice.length ? bottomSlice : top;

  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <p className="airport-code mb-3">Where we go</p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink dark:text-white">
          Explore our destinations
        </h2>
      </div>

      <div className="space-y-6">
        <Row items={top} />
        <Row items={bottom} reverse />
      </div>
    </section>
  );
}