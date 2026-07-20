import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import EnquiryForm from "@/components/EnquiryForm";
import PackageCard from "@/components/PackageCard";
import PackageGallery, { GalleryProvider, PlacesGrid } from "@/components/PackageGallery";
import PackageMap from "@/components/PackageMap";
import { getPublishedPackageBySlug, getRelatedPackages } from "@/lib/services/packages";

export async function generateMetadata({ params }) {
  const pkg = await getPublishedPackageBySlug(params.slug);
  return { title: pkg ? `${pkg.title} | Travell Bee` : "Package" };
}

export default async function PackagePage({ params }) {
  const pkg = await getPublishedPackageBySlug(params.slug);
  if (!pkg) notFound();

  const itinerary = Array.isArray(pkg.itinerary) ? pkg.itinerary : [];
  const places = Array.isArray(pkg.places) ? pkg.places : [];
  const related = await getRelatedPackages(pkg.destinationId, pkg.id, 3);

  const live =
    pkg.offerPriceInInr &&
    pkg.offerPriceInInr < pkg.priceInInr &&
    (!pkg.offerEndsAt || new Date(pkg.offerEndsAt) > new Date());
  const price = live ? pkg.offerPriceInInr : pkg.priceInInr;
  const nights = Math.max(pkg.durationDays - 1, 0);

  // ── One album for the whole page: cover → gallery images → place photos,
  //    de-duplicated by URL. `placesStart` is where the place photos begin,
  //    so each place card can open the lightbox at its own image.
  const album = [];
  const seen = new Set();
  const push = (url, alt) => {
    if (url && !seen.has(url)) { seen.add(url); album.push({ url, alt: alt || pkg.title }); }
  };
  push(pkg.coverImage, pkg.title);
  (pkg.images || []).forEach((im) => push(im.url, im.alt));
  const placesStart = album.length;
  places.forEach((p) => push(p.image, p.name));

  return (
    <GalleryProvider images={album}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* ── HEADER ── */}
        <nav className="text-sm text-graytext dark:text-white/50 mb-4 flex flex-wrap items-center gap-1.5">
          <Link href="/destinations" className="hover:text-gold">Destinations</Link>
          <span>›</span>
          <Link href={`/destinations/${pkg.destination?.slug}`} className="hover:text-gold">
            {pkg.destination?.name}
          </Link>
          <span>›</span>
          <span className="text-ink dark:text-white/80">{pkg.title}</span>
        </nav>

        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-ink dark:text-white mb-5 leading-[1.05]">
          {pkg.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-5">
          <span className="chip">{pkg.durationDays} days / {nights} nights</span>
          {pkg.themes.slice(0, 4).map((t) => <span key={t} className="chip">{t}</span>)}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-graytext dark:text-white/50">From:</span>
            {live && (
              <span className="text-sm text-graytext dark:text-white/40 line-through">
                ₹{pkg.priceInInr.toLocaleString("en-IN")}
              </span>
            )}
            <span className="font-display text-3xl font-extrabold text-ink dark:text-white leading-none">
              ₹{price.toLocaleString("en-IN")}
            </span>
            <span className="text-sm text-graytext dark:text-white/50">/ person</span>
          </div>
          <span className="flex items-center gap-1.5 text-sm text-graytext dark:text-white/60">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z" />
              <circle cx="12" cy="11" r="2" />
            </svg>
            {pkg.destination?.name}
          </span>
        </div>

        {/* ── GALLERY ── */}
        <PackageGallery />

        {/* ── BODY ── */}
        <div className="grid lg:grid-cols-3 gap-10 items-start mt-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="font-display text-xl font-bold text-ink dark:text-white mb-3">Overview</h2>
              <p className="text-graytext dark:text-white/60 leading-relaxed">{pkg.summary}</p>
            </section>

            {places.length > 0 && (
              <section>
                <h2 className="font-display text-xl font-bold text-ink dark:text-white mb-4">Places you&apos;ll see</h2>
                <PlacesGrid places={places} startIndex={placesStart} />
              </section>
            )}

            {pkg.mapQuery && (
              <section>
                <PackageMap query={pkg.mapQuery} />
              </section>
            )}

            {itinerary.length > 0 && (
              <section>
                <h2 className="font-display text-xl font-bold text-ink dark:text-white mb-4">Day-by-day itinerary</h2>
                <ol className="route-line pl-10 space-y-6">
                  {itinerary.map((stop) => (
                    <li key={stop.day} className="relative">
                      <span className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-gold text-ink text-xs font-bold flex items-center justify-center">
                        {stop.day}
                      </span>
                      <p className="font-semibold text-ink dark:text-white">{stop.title}</p>
                      <p className="text-sm text-graytext dark:text-white/60">{stop.description}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <section className="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="font-display text-lg font-bold text-ink dark:text-white mb-3">Inclusions</h3>
                <ul className="space-y-1 text-sm text-graytext dark:text-white/60">
                  {pkg.inclusions.map((item) => <li key={item}>✓ {item}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-ink dark:text-white mb-3">Exclusions</h3>
                <ul className="space-y-1 text-sm text-graytext dark:text-white/60">
                  {pkg.exclusions.map((item) => <li key={item}>✕ {item}</li>)}
                </ul>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24">
          <div className="ticket-stub p-6">
            <p className="text-sm text-graytext dark:text-white/60 mb-1">Starting from</p>
            <div className="flex items-end gap-2">
              {live && (
                <span className="text-sm text-graytext dark:text-white/40 line-through">
                  ₹{pkg.priceInInr.toLocaleString("en-IN")}
                </span>
              )}
              <span className="font-display text-3xl text-ink dark:text-white font-extrabold leading-none">
                ₹{price.toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-graytext dark:text-white/50">/ person</span>
            </div>
            <div className="border-t border-black/10 dark:border-white/10 mt-5 pt-5">
              <EnquiryForm packageId={pkg.id} bare stack />
            </div>
          </div>
        </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16 pt-12 border-t border-black/5 dark:border-white/10">
            <h2 className="font-display text-2xl font-bold text-ink dark:text-white mb-6">Other travel packages</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => <PackageCard key={r.id} pkg={r} />)}
            </div>
          </section>
        )}
      </div>
    </GalleryProvider>
  );
}