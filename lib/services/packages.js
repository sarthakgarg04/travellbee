import { prisma } from "@/lib/prisma";

const CARD_SELECT = {
  id: true, slug: true, title: true, durationDays: true,
  priceInInr: true, offerPriceInInr: true, offerEndsAt: true,
  coverImage: true, summary: true, themes: true,
  destination: { select: { name: true, slug: true, code: true } },
};

export async function getFeaturedPackages(limit = 4) {
  try {
    return await prisma.package.findMany({
      where: { featured: true, status: "PUBLISHED" },
      select: CARD_SELECT,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getPublishedPackageBySlug(slug) {
  try {
    return await prisma.package.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: {
        destination: true,
        images: { orderBy: { order: "asc" } },
      },
    });
  } catch {
    return null;
  }
}

/* ---------- admin-only below: callers MUST have called requireAdmin() ---------- */

export async function listPackagesForAdmin() {
  return prisma.package.findMany({
    include: {
      destination: { select: { name: true } },
      _count: { select: { enquiries: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPackageForAdmin(id) {
  return prisma.package.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });
}

/** Appends -2, -3… until the slug is free. Ignores `exceptId` when editing. */
export async function uniqueSlug(base, exceptId = null) {
  let slug = base;
  let n = 1;
  while (true) {
    const hit = await prisma.package.findUnique({ where: { slug }, select: { id: true } });
    if (!hit || hit.id === exceptId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}