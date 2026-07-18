import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import PackageForm from "@/components/admin/PackageForm";

export default async function NewPackagePage() {
  requireAdmin();
  const destinations = await prisma.destination.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  if (destinations.length === 0) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-sm text-graytext dark:text-white/50">
          Add a destination first — a package can&apos;t exist without one.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-ink dark:text-white mb-8">New package</h1>
      <PackageForm destinations={destinations} />
    </section>
  );
}