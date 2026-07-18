import { prisma } from "@/lib/prisma";

export async function listDestinationsForAdmin() {
  return prisma.destination.findMany({
    include: { _count: { select: { packages: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getDestinationForAdmin(id) {
  return prisma.destination.findUnique({ where: { id } });
}

/** Appends -2, -3… until the slug is free. Ignores `exceptId` when editing. */
export async function uniqueDestinationSlug(base, exceptId = null) {
  let slug = base;
  let n = 1;
  while (true) {
    const hit = await prisma.destination.findUnique({ where: { slug }, select: { id: true } });
    if (!hit || hit.id === exceptId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}