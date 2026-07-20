import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EnquiryForm from "@/components/EnquiryForm";
import PackageGallery from "@/components/PackageGallery";
import PackageReviews from "@/components/PackageReviews";
import ReviewForm from "@/components/ReviewForm";

import { getPublishedPackageBySlug } from "@/lib/services/packages";
import { getPackageReviews } from "@/lib/services/reviews";

export async function generateMetadata({ params }) {
  const pkg = await getPublishedPackageBySlug(params.slug);
  return { title: pkg ? `${pkg.title} | Travell Bee` : "Package" };
}

export default async function PackagePage({ params }) {
  const pkg = await getPublishedPackageBySlug(params.slug);
  if (!pkg) notFound();

  const itinerary = Array.isArray(pkg.itinerary) ? pkg.itinerary : [];
  const { reviews, count, average } = await getPackageReviews(pkg.id);

  return (
    <section className="max-w-5xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2">
        {/* Photo gallery (was a single cover image). To revert, replace this line with:
            <div className="relative h-64 rounded-stub overflow-hidden mb-6">
              <Image src={pkg.coverImage} alt={pkg.title} fill className="object-cover" priority />
            </div> */}
        <PackageGallery images={pkg.images} coverImage={pkg.coverImage} title={pkg.title} />

        <p className="airport-code mb-2">
          {pkg.destination?.name} · {pkg.durationDays} days
        </p>
        <h1 className="font-display text-3xl font-extrabold text-ink dark:text-white mb-3">{pkg.title}</h1>
        <p className="text-graytext dark:text-white/60 mb-8">{pkg.summary}</p>

        <h2 className="font-display text-xl font-bold text-ink dark:text-white mb-4">Day-by-day itinerary</h2>
        <ol className="route-line pl-10 space-y-6 mb-10">
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

        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="font-display text-lg font-bold text-ink dark:text-white mb-3">Inclusions</h3>
            <ul className="space-y-1 text-sm text-graytext dark:text-white/60">
              {pkg.inclusions.map((item) => (
                <li key={item}>✓ {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-ink dark:text-white mb-3">Exclusions</h3>
            <ul className="space-y-1 text-sm text-graytext dark:text-white/60">
              {pkg.exclusions.map((item) => (
                <li key={item}>✕ {item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Guest reviews + write-a-review form */}
        <PackageReviews reviews={reviews} count={count} average={average} />
        <div className="mt-8">
          <ReviewForm packageId={pkg.id} />
        </div>
      </div>

      <div>
        <div className="ticket-stub p-6 mb-6 sticky top-24">
          <p className="text-sm text-graytext dark:text-white/60 mb-1">Starting from</p>
          <p className="font-display text-3xl text-ink dark:text-white font-extrabold mb-4">
            ₹{(pkg.offerPriceInInr ?? pkg.priceInInr).toLocaleString("en-IN")}
            {pkg.offerPriceInInr && (
              <span className="text-base font-medium text-graytext dark:text-white/50 line-through ml-2">
                ₹{pkg.priceInInr.toLocaleString("en-IN")}
              </span>
            )}
            <span className="text-sm font-medium text-graytext dark:text-white/60"> / person</span>
          </p>
          <a
            href="#enquire"
            className="block text-center bg-gold text-ink font-semibold px-6 py-3 rounded-full hover:bg-ink hover:text-white transition-colors"
          >
            Enquire about this trip
          </a>
        </div>
      </div>

      <div id="enquire" className="lg:col-span-3">
        <EnquiryForm packageId={pkg.id} packageTitle={pkg.title} />
      </div>
    </section>
  );
}