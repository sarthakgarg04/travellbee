import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import { listDestinationsForAdmin } from "@/lib/services/destinations";

export default async function AdminDestinationsPage() {
  requireAdmin();
  const destinations = await listDestinationsForAdmin();

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink dark:text-white">Destinations</h1>
          <p className="text-sm text-graytext dark:text-white/50">{destinations.length} total</p>
        </div>
        <Link href="/admin/destinations/new"
          className="bg-gold text-ink font-semibold px-5 py-2.5 rounded-full hover:bg-ink hover:text-white transition-colors">
          + New destination
        </Link>
      </div>

      <div className="space-y-3">
        {destinations.map((d) => (
          <div key={d.id} className="ticket-stub p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
  <div className="flex items-center gap-4 min-w-0 flex-1">
    <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-cloud dark:bg-white/5">
      {d.coverImage && <Image src={d.coverImage} alt="" fill sizes="80px" className="object-cover" />}
    </div>
    <div className="min-w-0 flex-1">
      <p className="font-semibold text-ink dark:text-white truncate">
        {d.name}
        <span className="text-xs text-graytext dark:text-white/40"> · {d.code}</span>
      </p>
      <p className="text-xs text-graytext dark:text-white/50 truncate">
        {d.tagline}
        {d._count.packages > 0 && ` · ${d._count.packages} package(s)`}
      </p>
    </div>
  </div>

  <Link
    href={`/admin/destinations/${d.id}/edit`}
    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-ink text-white dark:bg-white dark:text-ink self-start sm:self-auto shrink-0"
  >
    Edit
  </Link>
</div>
        ))}

        {destinations.length === 0 && (
          <p className="text-sm text-graytext dark:text-white/50 py-8">
            No destinations yet. Create your first one.
          </p>
        )}
      </div>
    </section>
  );
}