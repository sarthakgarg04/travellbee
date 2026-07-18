import Link from "next/link";
import Image from "next/image";

export default function PackageCard({ pkg }) {
  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="card-hover group block rounded-3xl overflow-hidden bg-white dark:bg-[#1C1C1C] shadow-card"
    >
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={pkg.coverImage}
          alt={pkg.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <span className="absolute top-3 left-3 pill-badge">
          {pkg.destination?.name || "Trip"} · {pkg.durationDays}D
        </span>
        <span className="absolute bottom-3 right-3 pill-badge bg-gold text-ink">
          {pkg.offerPriceInInr ? (
            <>
              <span className="line-through opacity-50 font-normal mr-1">
                ₹{pkg.priceInInr.toLocaleString("en-IN")}
              </span>
              ₹{pkg.offerPriceInInr.toLocaleString("en-IN")}
            </>
          ) : (
            <>₹{pkg.priceInInr.toLocaleString("en-IN")}</>
          )}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-ink dark:text-white mb-1">{pkg.title}</h3>
        <p className="text-sm text-graytext dark:text-white/60 mb-4 line-clamp-2">{pkg.summary}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-graytext dark:text-white/50">Starting price / person</span>
          <span className="text-sm font-semibold text-ink dark:text-white">View itinerary →</span>
        </div>
      </div>
    </Link>
  );
}
