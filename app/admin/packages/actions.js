"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { validatePackage, slugify } from "@/lib/validate";
import { uniqueSlug } from "@/lib/services/packages";
import { destroyAsset } from "@/lib/cloudinary";
import { THEMES, PACKAGE_STATUSES } from "@/lib/constants";

const OPTS = { themes: THEMES, statuses: PACKAGE_STATUSES };

/** Every public surface a package appears on. */
function revalidatePackage(slug, destinationSlug) {
  revalidatePath("/");
  revalidatePath("/destinations");
  revalidatePath("/admin/packages");
  if (slug) revalidatePath(`/packages/${slug}`);
  if (destinationSlug) revalidatePath(`/destinations/${destinationSlug}`);
}

export async function savePackage(id, input) {
  requireAdmin();

  const { errors, data } = validatePackage(input, OPTS);
  if (errors) return { ok: false, errors };

  const { images, ...fields } = data;
  fields.slug = await uniqueSlug(slugify(fields.slug), id);

  const destination = await prisma.destination.findUnique({
    where: { id: fields.destinationId },
    select: { slug: true },
  });
  if (!destination) return { ok: false, errors: { destinationId: "Destination not found." } };

  let saved;
  if (id) {
    // Images are a value list, not entities users track — replace wholesale.
    // Simpler than diffing, and the row count is tiny.
    saved = await prisma.$transaction(async (tx) => {
      await tx.packageImage.deleteMany({ where: { packageId: id } });
      return tx.package.update({
        where: { id },
        data: { ...fields, images: { create: images } },
      });
    });
  } else {
    saved = await prisma.package.create({
      data: { ...fields, images: { create: images } },
    });
  }

  revalidatePackage(saved.slug, destination.slug);
  redirect("/admin/packages");
}

export async function setStatus(formData) {
  requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!PACKAGE_STATUSES.includes(status)) return;

  const p = await prisma.package.update({
    where: { id },
    data: { status },
    include: { destination: { select: { slug: true } } },
  });
  revalidatePackage(p.slug, p.destination.slug);
}

export async function toggleFeatured(formData) {
  requireAdmin();
  const id = String(formData.get("id"));
  const current = await prisma.package.findUnique({
    where: { id },
    select: { featured: true },
  });
  if (!current) return;

  const p = await prisma.package.update({
    where: { id },
    data: { featured: !current.featured },
    include: { destination: { select: { slug: true } } },
  });
  revalidatePackage(p.slug, p.destination.slug);
}

export async function deletePackage(formData) {
  requireAdmin();
  const id = String(formData.get("id"));

  const pkg = await prisma.package.findUnique({
    where: { id },
    include: {
      images: { select: { publicId: true } },
      destination: { select: { slug: true } },
    },
  });
  if (!pkg) return;

  await prisma.package.delete({ where: { id } });      // images cascade, enquiries SetNull

  // Cloudinary cleanup is best-effort and happens after the DB is consistent.
  await Promise.allSettled(pkg.images.map((im) => destroyAsset(im.publicId)));

  revalidatePackage(pkg.slug, pkg.destination.slug);
  redirect("/admin/packages");
}