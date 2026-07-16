import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

async function getDestinations() {
  try {
    return await prisma.destination.findMany({ orderBy: { name: "asc" } });
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Destinations | Travell Bee",
};

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <p className="airport-code mb-3">All routes</p>
      <h1 className="font-display text-4xl font-extrabold text-ink dark:text-white mb-10">Destinations</h1>

      {destinations.length === 0 && (
        <p className="text-graytext dark:text-white/60 text-sm">
          No destinations yet — run <code>npm run prisma:seed</code>.
        </p>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {destinations.map((d) => (
          <Link
            key={d.id}
            href={`/destinations/${d.slug}`}
            className="card-hover block rounded-3xl overflow-hidden bg-white dark:bg-[#1C1C1C] shadow-card"
          >
            <div className="relative h-44">
              <Image src={d.coverImage} alt={d.name} fill sizes="320px" className="object-cover" />
            </div>
            <div className="p-4">
              <h2 className="font-display text-lg font-bold text-ink dark:text-white">{d.name}</h2>
              <p className="text-sm text-graytext dark:text-white/60">{d.tagline}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
