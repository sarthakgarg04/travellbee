import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import PackageCard from "@/components/PackageCard";
import EnquiryForm from "@/components/EnquiryForm";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import QuickPlanWidget from "@/components/QuickPlanWidget";
import DestinationGallery from "@/components/DestinationGallery";
import AboutStory from "@/components/AboutStory";
import Testimonials from "@/components/Testimonials";
import TripBuilder from "@/components/TripBuilder";
import CustomTripCTA from "@/components/CustomTripCTA";

import { getFeaturedPackages } from "@/lib/services/packages";
import { THEMES } from "@/lib/constants";

async function getDestinations() {
  try {
    return await prisma.destination.findMany({
      take: 12,
      include: {
        packages: { where: { status: "PUBLISHED" }, select: { id: true } },
      },
    });
  } catch {
    return [];
  }
}

async function getCounts() {
  try {
    const [destinationCount, packageCount] = await Promise.all([
      prisma.destination.count(),
      prisma.package.count(),
    ]);
    return { destinationCount, packageCount };
  } catch {
    return { destinationCount: 0, packageCount: 0 };
  }
}

const HOW_IT_WORKS = [
  { step: "1", title: "Tell us where and when", body: "Fill the enquiry form or WhatsApp us your destination, dates, and group size." },
  { step: "2", title: "We call within 24 hours", body: "A real person calls you back with route ideas and a price range — no bots, no auto-replies." },
  { step: "3", title: "We design your itinerary", body: "Day-by-day plan, priced and finalized around your preferences, sent to you for review." },
  { step: "4", title: "You travel, we stay on call", body: "Once you're on the trip, we're reachable for anything that comes up along the way." },
];

// Factual, Phase-1-accurate answers — safe to publish, and good for SEO.
const FAQS = [
  {
    q: "Do I pay anything to enquire?",
    a: "No. Enquiring is completely free — we call you back with a route and a price first, and there's no obligation to book.",
  },
  {
    q: "How soon will you get back to me?",
    a: "Within 24 hours, from a real person who has read your enquiry. You won't get an auto-reply or a call-centre script.",
  },
  {
    q: "Can you customise an itinerary for my group?",
    a: "Yes — that's most of what we do. Share your dates, budget and who's travelling, and we'll build a day-by-day route around them.",
  },
  {
    q: "Which destinations do you cover?",
    a: "A handpicked set of routes across India. We keep the list small on purpose — every destination we sell, someone on our team has actually travelled.",
  },
  {
    q: "How do I pay once I've decided?",
    a: "When your itinerary is finalised we share payment details directly and confirm your booking. Online payment on the site is coming soon.",
  },
];

export default async function Home() {
  const [packages, destinations, counts] = await Promise.all([
    getFeaturedPackages(),
    getDestinations(),
    getCounts(),
  ]);
  const heroFallback = destinations[0]?.coverImage || "https://images.unsplash.com/photo-1469474968028-56623f02e42e";

  return (
    <>
      {/* HERO — full-bleed video background */}
      <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={heroFallback}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex flex-col justify-center">
          <p className="airport-code bg-white/90 w-fit mb-5">Travell Bee Holidays · Indore</p>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-white leading-tight mb-6 max-w-2xl">
            You dream the destination.
            <br />
            We design the trip.
          </h1>
          <p className="text-white/85 text-lg mb-8 max-w-md">
            Handpicked tour packages across India, priced upfront and planned
            by people who&apos;ve done the trip themselves.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="#enquire" className="inline-block bg-gold text-ink font-semibold px-7 py-3.5 rounded-full hover:bg-white transition-colors">
              Plan my trip
            </Link>
            <Link href="/destinations" className="inline-block font-semibold px-7 py-3.5 rounded-full border-2 border-white/40 text-white hover:border-white transition-colors">
              Browse destinations
            </Link>
          </div>
          <p className="mt-6 text-white/70 text-sm">
            No payment to enquire · 24-hour callback · Handpicked routes across India
          </p>
        </div>
      </section>

      {/* FLOATING QUICK-PLAN WIDGET — overlaps the hero/next-section seam */}
      <QuickPlanWidget destinations={destinations} />

      {/* BROWSE BY THEME */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <p className="airport-code mb-4">Browse by vibe</p>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {THEMES.map((theme) => (
            <Link key={theme} href="/destinations" className="chip shrink-0">
              {theme}
            </Link>
          ))}
        </div>
      </section>

      {/* DESTINATIONS — two-row auto-scrolling gallery */}
      <DestinationGallery destinations={destinations} />

      {/* FEATURED PACKAGES — moved high; this is the primary conversion unit */}
      <section id="packages" className="max-w-6xl mx-auto px-6 py-16">
        <Reveal>
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="airport-code mb-3">Fresh picks</p>
              <h2 className="font-display text-3xl font-bold text-ink dark:text-white">Featured packages</h2>
            </div>
            <Link href="/destinations" className="text-gold font-semibold text-sm">
              See all destinations →
            </Link>
          </div>
        </Reveal>

        {packages.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {packages.map((pkg, i) => (
              <Reveal key={pkg.id} delay={i * 100}>
                <PackageCard pkg={pkg} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-graytext dark:text-white/60 text-sm">
            No packages yet — run <code>npm run prisma:seed</code> to load sample data.
          </p>
        )}
      </section>

      {/* OUR STORY — headline + expanding image cluster + value props */}
      <AboutStory images={destinations.slice(0, 3).map((d) => d.coverImage)} />

      {/* BY THE NUMBERS — real counts, not invented stats */}
      <section className="honeycomb-bg py-14">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <Reveal><Counter value={counts.destinationCount} suffix="+" label="Destinations covered" /></Reveal>
          <Reveal delay={100}><Counter value={counts.packageCount} suffix="+" label="Ready-made itineraries" /></Reveal>
          <Reveal delay={200}><Counter value={24} suffix="hr" label="Callback promise" /></Reveal>
          <Reveal delay={300}><Counter value={1} label="City we call home: Indore" /></Reveal>
        </div>
      </section>

      {/* CUSTOM TRIP CTA */}
      <CustomTripCTA image={destinations[0]?.coverImage} />

      {/* HOW IT WORKS */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-ink dark:text-white mb-10">How it works</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <Reveal key={item.step} delay={i * 100}>
                <div className="w-10 h-10 rounded-full bg-ink dark:bg-gold text-white dark:text-ink font-bold flex items-center justify-center mb-4">
                  {item.step}
                </div>
                <h3 className="font-display font-bold text-ink dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-graytext dark:text-white/60">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials images={destinations.slice(0, 6).map((d) => d.coverImage)} />



      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <Reveal>
          <p className="airport-code mb-3">Good to know</p>
          <h2 className="font-display text-3xl font-bold text-ink dark:text-white mb-8">
            Questions travellers usually ask
          </h2>
        </Reveal>
        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <Reveal key={item.q} delay={i * 60}>
              <details className="group ticket-stub p-5">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-display font-semibold text-ink dark:text-white">
                  {item.q}
                  <svg
                    className="shrink-0 transition-transform duration-300 group-open:rotate-180 text-graytext dark:text-white/50"
                    width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <p className="text-sm text-graytext dark:text-white/60 mt-3 leading-relaxed">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ENQUIRY */}
      <section id="enquire" className="max-w-2xl mx-auto px-6 py-20">
        <Reveal>
          <h2 className="font-display text-3xl font-bold text-ink dark:text-white mb-2 text-center">
            Tell us where, we&apos;ll handle the rest
          </h2>
          <p className="text-graytext dark:text-white/60 text-center mb-8">
            No payment needed to enquire — we call back with a plan and price first.
          </p>
          <EnquiryForm />
        </Reveal>
      </section>
    </>
  );
}