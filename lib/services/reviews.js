import { prisma } from "@/lib/prisma";

/** Public-facing: only APPROVED reviews, newest first, with an average. */
export async function getPackageReviews(packageId) {
  const reviews = await prisma.review.findMany({
    where: { packageId, status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });
  const count = reviews.length;
  const average = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  return { reviews, count, average };
}