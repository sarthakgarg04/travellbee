const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const goa = await prisma.destination.upsert({
    where: { slug: "goa" },
    update: {},
    create: {
      slug: "goa",
      name: "Goa",
      code: "GOA",
      tagline: "Beaches, forts, and slow evenings",
      description:
        "Goa pairs quiet north-coast beaches with Portuguese-era old towns and easy day trips to spice plantations.",
      coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
    },
  });

  const jaipur = await prisma.destination.upsert({
    where: { slug: "jaipur" },
    update: {},
    create: {
      slug: "jaipur",
      name: "Jaipur",
      code: "JAI",
      tagline: "The Pink City's forts and bazaars",
      description:
        "Jaipur's forts, palaces, and markets make it one of the most photographed stops on any Rajasthan itinerary.",
      coverImage: "https://images.unsplash.com/photo-1477587458883-47145ed94245",
    },
  });

  await prisma.package.upsert({
    where: { slug: "goa-beach-escape-4d3n" },
    update: {},
    create: {
      slug: "goa-beach-escape-4d3n",
      title: "Goa Beach Escape",
      destinationId: goa.id,
      durationDays: 4,
      priceInInr: 14999,
      coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
      summary: "A relaxed 4-day loop across North Goa's beaches with one heritage day trip.",
      inclusions: ["3 nights hotel stay", "Airport transfers", "Daily breakfast", "1 sightseeing day trip"],
      exclusions: ["Flights", "Lunch & dinner", "Water sports"],
      featured: true,
      status: "PUBLISHED",
      themes: ["Beaches"],
      itinerary: [
        { day: 1, title: "Arrival & Calangute", description: "Check-in, evening at Calangute beach." },
        { day: 2, title: "Fort Aguada & Candolim", description: "Morning fort visit, afternoon by the beach." },
        { day: 3, title: "Old Goa churches & spice plantation", description: "Full day trip with lunch." },
        { day: 4, title: "Departure", description: "Leisure morning, airport drop." },
      ],
    },
  });

  await prisma.package.upsert({
    where: { slug: "jaipur-heritage-trail-3d2n" },
    update: {},
    create: {
      slug: "jaipur-heritage-trail-3d2n",
      title: "Jaipur Heritage Trail",
      destinationId: jaipur.id,
      durationDays: 3,
      priceInInr: 10999,
      coverImage: "https://images.unsplash.com/photo-1477587458883-47145ed94245",
      summary: "Amber Fort, City Palace, and the bazaars of the Pink City in a tight 3-day loop.",
      inclusions: ["2 nights hotel stay", "Private car & driver", "Daily breakfast", "Monument entry fees"],
      exclusions: ["Flights/train", "Lunch & dinner", "Camera fees at monuments"],
      featured: true,
      status: "PUBLISHED",
      themes: ["Heritage"],
      itinerary: [
        { day: 1, title: "Arrival & City Palace", description: "Check-in, evening at City Palace & Bapu Bazaar." },
        { day: 2, title: "Amber Fort & Nahargarh", description: "Morning fort visit, sunset at Nahargarh." },
        { day: 3, title: "Departure", description: "Hawa Mahal photo stop, drop to station/airport." },
      ],
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });