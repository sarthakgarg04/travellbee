import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getPackageForAdmin } from "@/lib/services/packages";
import PackageForm from "@/components/admin/PackageForm";

export default async function EditPackagePage({ params }) {
  requireAdmin();
  const [pkg, destinations] = await Promise.all([
    getPackageForAdmin(params.id),
    prisma.destination.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!pkg) notFound();

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-ink dark:text-white mb-8">Edit package</h1>
      <PackageForm pkg={pkg} destinations={destinations} />
    </section>
  );
}