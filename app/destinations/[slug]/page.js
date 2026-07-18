import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PackageCard from "@/components/PackageCard";

async function getDestination(slug) {
  try {
    return await prisma.destination.findUnique({
      where: { slug },
      include: { packages: { where: { status: "PUBLISHED" } } },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const destination = await getDestination(params.slug);
  return { title: destination ? `${destination.name} | Travell Bee` : "Destination" };
}

export default async function DestinationPage({ params }) {
  const destination = await getDestination(params.slug);
  if (!destination) notFound();

  return (
    <>
      <div className="relative h-72">
        <Image src={destination.coverImage} alt={destination.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="font-display text-4xl font-extrabold">{destination.name}</h1>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <p className="text-graytext dark:text-white/60 max-w-2xl mb-10">{destination.description}</p>

        <h2 className="font-display text-2xl font-bold text-ink dark:text-white mb-6">
          Packages in {destination.name}
        </h2>
        {destination.packages.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {destination.packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={{ ...pkg, destination }} />
            ))}
          </div>
        ) : (
          <p className="text-graytext dark:text-white/60 text-sm">No packages published for this destination yet.</p>
        )}
      </section>
    </>
  );
}
