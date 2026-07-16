import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import PackageCard from "@/components/PackageCard";
import EnquiryForm from "@/components/EnquiryForm";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import QuickPlanWidget from "@/components/QuickPlanWidget";

async function getFeaturedPackages() {
  try {
    return await prisma.package.findMany({
      where: { featured: true },
      include: { destination: true },
      take: 4,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

async function getDestinations() {
  try {
    return await prisma.destination.findMany({ take: 6 });
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

const WHY_US = [
  {
    title: "Itinerary built around you",
    body: "No copy-paste templates — every route is planned around your dates, budget, and pace by someone who's actually done the trip.",
  },
  {
    title: "Real humans, not bots",
    body: "Call or WhatsApp us any time before or during your trip. You'll talk to a person who knows your itinerary, not a script.",
  },
  {
    title: "Upfront pricing",
    body: "Your quote shows exactly what's included and what's not — no surprise add-ons once you've paid your advance.",
  },
  {
    title: "Handpicked stays & guides",
    body: "We work with the same local hotels and drivers on repeat trips, so we know what's actually good, not just what's listed highest.",
  },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Tell us where and when", body: "Fill the enquiry form or WhatsApp us your destination, dates, and group size." },
  { step: "2", title: "We call within 24 hours", body: "A real person calls you back with route ideas and a price range — no bots, no auto-replies." },
  { step: "3", title: "We design your itinerary", body: "Day-by-day plan, priced and finalized around your preferences, sent to you for review." },
  { step: "4", title: "You travel, we stay on call", body: "Once you're on the trip, we're reachable for anything that comes up along the way." },
];

const THEMES = ["Beaches", "Heritage", "Hill stations", "Honeymoon", "Family", "Adventure"];

export default async function Home() {
  const [packages, destinations, counts] = await Promise.all([
    getFeaturedPackages(),
    getDestinations(),
    getCounts(),
  ]);
  const heroFallback = destinations[0]?.coverImage || "https://images.unsplash.com/photo-1469474968028-56623f02e42e";
  const tickerNames = destinations.length > 0 ? destinations.map((d) => d.name) : ["Goa", "Jaipur", "Kerala", "Manali"];
  const tickerLoop = [...tickerNames, ...tickerNames]; // duplicated once for a seamless CSS loop

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
            <Link href="/destinations" className="inline-block font-semibold px-7 py-3.5 rounded-full border-2 border-white/40 text-white hover:border-white transition-colors">
              Browse destinations
            </Link>
          </div>
        </div>
      </section>

      {/* FLOATING QUICK-PLAN WIDGET — overlaps the hero/next-section seam */}
      <QuickPlanWidget destinations={destinations} />

      {/* SCROLLING DESTINATION TICKER */}
      <div className="overflow-hidden py-8 border-b border-black/5 dark:border-white/10">
        <div className="marquee-track">
          {[...tickerLoop, ...tickerLoop].map((name, i) => (
            <span key={i} className="font-display text-2xl font-bold text-ink/15 dark:text-white/15 px-8 whitespace-nowrap">
              {name} ✦
            </span>
          ))}
        </div>
      </div>

      {/* THEME CHIPS */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {THEMES.map((theme) => (
            <Link key={theme} href="/destinations" className="chip shrink-0">
              {theme}
            </Link>
          ))}
        </div>
      </section>

      {/* WHY TRAVELL BEE */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <Reveal>
          <h2 className="font-display text-3xl font-bold text-ink dark:text-white mb-2">Why Travell Bee</h2>
          <p className="text-graytext dark:text-white/60 mb-10 max-w-xl">
            We plan a small number of trips well, instead of a large number of trips generically.
          </p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_US.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className="ticket-stub p-6 h-full">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                </div>
                <h3 className="font-display font-bold text-ink dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-graytext dark:text-white/60">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BY THE NUMBERS — real counts, not invented stats */}
      <section className="honeycomb-bg py-14 mt-8">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <Reveal><Counter value={counts.destinationCount} suffix="+" label="Destinations covered" /></Reveal>
          <Reveal delay={100}><Counter value={counts.packageCount} suffix="+" label="Ready-made itineraries" /></Reveal>
          <Reveal delay={200}><Counter value={24} suffix="hr" label="Callback promise" /></Reveal>
          <Reveal delay={300}><Counter value={1} label="City we call home: Indore" /></Reveal>
        </div>
      </section>

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

      {/* FEATURED PACKAGES */}
      <section id="packages" className="max-w-6xl mx-auto px-6 py-16">
        <Reveal>
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-3xl font-bold text-ink dark:text-white">Featured packages</h2>
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

      {/* CUSTOM ITINERARY */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <Reveal>
          <div className="ticket-stub p-10 sm:p-14 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="airport-code mb-4">Not seeing your trip above?</p>
              <h2 className="font-display text-3xl font-bold text-ink dark:text-white mb-4">
                We'll build a custom itinerary just for you
              </h2>
              <p className="text-graytext dark:text-white/60 mb-6">
                Tell us your destination, dates, budget, and who's travelling —
                we'll plan a day-by-day route around it, priced upfront, no
                obligation to book.
              </p>
              <Link href="#enquire" className="inline-block bg-gold text-ink font-semibold px-7 py-3.5 rounded-full hover:bg-ink hover:text-white transition-colors">
                Start my custom itinerary →
              </Link>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden">
              <Image src={heroFallback} alt="Custom itinerary planning" fill sizes="480px" className="object-cover" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* WHO WE ARE */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-ink dark:text-white mb-4">Who we are</h2>
            <p className="text-graytext dark:text-white/60 mb-4">
              Travell Bee is a travel agency based in Indore, planning tour
              packages and custom itineraries across India. We keep our route
              list small on purpose — every destination we sell, someone on our
              team has actually traveled.
            </p>
            <p className="text-graytext dark:text-white/60">
              Add your team's story here — how Travell Bee started, what you
              specialize in, or what makes your planning different.
            </p>
          </div>
        </Reveal>
      </section>

      {/* DESTINATIONS STRIP */}
      {destinations.length > 0 && (
        <section className="honeycomb-bg py-16">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal>
              <h2 className="font-display text-3xl font-bold text-ink dark:text-white mb-8">Where we go</h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {destinations.map((d, i) => (
                <Reveal key={d.id} delay={i * 80}>
                  <Link
                    href={`/destinations/${d.slug}`}
                    className="card-hover group relative rounded-3xl overflow-hidden h-52 block shadow-card"
                  >
                    <Image
                      src={d.coverImage}
                      alt={d.name}
                      fill
                      sizes="320px"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="font-display text-xl font-bold">{d.name}</p>
                      <p className="text-xs text-white/80">{d.tagline}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

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
