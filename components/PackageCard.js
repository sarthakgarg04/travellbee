import Link from "next/link";
import Image from "next/image";

// Show the offer as a live deal only while it's actually running.
function offerIsLive(pkg) {
  if (!pkg.offerPriceInInr || pkg.offerPriceInInr >= pkg.priceInInr) return false;
  if (!pkg.offerEndsAt) return true;
  return new Date(pkg.offerEndsAt) > new Date();
}

export default function PackageCard({ pkg }) {
  const live = offerIsLive(pkg);
  const price = live ? pkg.offerPriceInInr : pkg.priceInInr;
  const discountPct = live
    ? Math.round(((pkg.priceInInr - pkg.offerPriceInInr) / pkg.priceInInr) * 100)
    : 0;
  const theme = pkg.themes?.[0];

  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="card-hover group flex flex-col rounded-[20px] overflow-hidden bg-white dark:bg-[#1C1C1C] shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      {/* IMAGE + OVERLAY BADGES */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={pkg.coverImage}
          alt={pkg.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* readability scrim so white badges never fight the photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

        {/* top-left: featured flag, else the trip's first theme */}
        {pkg.featured ? (
          <span className="absolute top-3 left-3 airport-code bg-ink text-white dark:bg-white dark:text-ink">
            ★ Featured
          </span>
        ) : theme ? (
          <span className="absolute top-3 left-3 airport-code">{theme}</span>
        ) : null}

        {/* top-right: real, computed discount — only when a deal is live */}
        {live && (
          <span className="absolute top-3 right-3 pill-badge bg-gold text-ink font-bold">
            {discountPct}% OFF
          </span>
        )}

        {/* bottom-left: destination + duration meta */}
        <span className="absolute bottom-3 left-3 pill-badge text-[12px]">
          {pkg.destination?.name || "Trip"} · {pkg.durationDays}D
        </span>
      </div>

      {/* BODY */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-display text-lg font-bold text-ink dark:text-white mb-1 line-clamp-1">
          {pkg.title}
        </h3>
        <p className="text-sm text-graytext dark:text-white/60 mb-4 line-clamp-2">
          {pkg.summary}
        </p>

        {/* price + CTA sit at the bottom on a tear-line, so cards of different
            summary lengths still align their footers */}
        <div className="mt-auto tear-line flex items-end justify-between">
          <div>
            {live && (
              <span className="block text-xs text-graytext dark:text-white/40 line-through">
                ₹{pkg.priceInInr.toLocaleString("en-IN")}
              </span>
            )}
            <span className="font-display text-xl font-extrabold text-ink dark:text-white">
              ₹{price.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-graytext dark:text-white/50"> / person</span>
          </div>

          <span className="shrink-0 inline-flex items-center gap-1 bg-gold text-ink text-sm font-semibold px-4 py-2 rounded-full group-hover:bg-ink group-hover:text-white transition-colors">
            View itinerary
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}