"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/validate";
import { uniqueDestinationSlug } from "@/lib/services/destinations";

const str = (v) => (typeof v === "string" ? v.trim() : "");

function validateDestination(input) {
  const errors = {};

  const name = str(input.name);
  if (name.length < 2) errors.name = "Name must be at least 2 characters.";

  const slug = slugify(input.slug || name);
  if (!slug) errors.slug = "Could not derive a slug from that name.";

  const code = str(input.code).toUpperCase();
  if (!/^[A-Z]{2,5}$/.test(code)) errors.code = "Code must be 2–5 letters, e.g. GOA.";

  const tagline = str(input.tagline);
  if (tagline.length < 3) errors.tagline = "Add a short tagline.";
  else if (tagline.length > 120) errors.tagline = "Keep the tagline under 120 characters.";

  const description = str(input.description);
  if (description.length < 20) errors.description = "Write at least a sentence (20+ chars).";
  else if (description.length > 600) errors.description = "Keep the description under 600 characters.";

  const coverImage = str(input.coverImage);
  if (!/^https:\/\//.test(coverImage)) errors.coverImage = "Upload a cover image.";

  return {
    errors: Object.keys(errors).length ? errors : null,
    data: { name, slug, code, tagline, description, coverImage },
  };
}

function revalidateDestination(slug) {
  revalidatePath("/");
  revalidatePath("/destinations");
  revalidatePath("/admin/destinations");
  if (slug) revalidatePath(`/destinations/${slug}`);
}

export async function saveDestination(id, input) {
  requireAdmin();

  const { errors, data } = validateDestination(input);
  if (errors) return { ok: false, errors };

  data.slug = await uniqueDestinationSlug(slugify(data.slug), id);

  const saved = id
    ? await prisma.destination.update({ where: { id }, data })
    : await prisma.destination.create({ data });

  revalidateDestination(saved.slug);
  redirect("/admin/destinations");
}

export async function deleteDestination(id) {
  requireAdmin();

  // A package cannot exist without a destination (destinationId is non-nullable).
  // Refuse the delete rather than cascade-destroying the client's packages.
  const count = await prisma.package.count({ where: { destinationId: id } });
  if (count > 0) {
    return {
      ok: false,
      error: `${count} package(s) use this destination. Move or delete them first.`,
    };
  }

  const dest = await prisma.destination.findUnique({ where: { id }, select: { slug: true } });
  await prisma.destination.delete({ where: { id } });
  revalidateDestination(dest?.slug);
  redirect("/admin/destinations");
}