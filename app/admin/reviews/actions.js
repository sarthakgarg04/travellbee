"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const STATUSES = ["PENDING", "APPROVED", "REJECTED"];

export async function setReviewStatus(formData) {
  requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!STATUSES.includes(status)) return;

  const r = await prisma.review.update({
    where: { id },
    data: { status },
    include: { package: { select: { slug: true } } },
  });
  revalidatePath("/admin/reviews");
  revalidatePath(`/packages/${r.package.slug}`);
}

export async function deleteReview(formData) {
  requireAdmin();
  const id = String(formData.get("id"));

  const r = await prisma.review
    .delete({ where: { id }, include: { package: { select: { slug: true } } } })
    .catch(() => null);

  revalidatePath("/admin/reviews");
  if (r) revalidatePath(`/packages/${r.package.slug}`);
}