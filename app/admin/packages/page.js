import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import { listPackagesForAdmin } from "@/lib/services/packages";
import { setStatus, toggleFeatured } from "./actions";

const BADGE = {
  PUBLISHED: "bg-clover/15 text-clover",
  DRAFT: "bg-gold/15 text-goldDark",
  ARCHIVED: "bg-black/10 text-graytext dark:bg-white/10 dark:text-white/50",
};

export default async function AdminPackagesPage() {
  requireAdmin();
  const packages = await listPackagesForAdmin();

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink dark:text-white">Packages</h1>
          <p className="text-sm text-graytext dark:text-white/50">{packages.length} total</p>
        </div>
        <Link
          href="/admin/packages/new"
          className="bg-gold text-ink font-semibold px-5 py-2.5 rounded-full hover:bg-ink hover:text-white transition-colors"
        >
          + New package
        </Link>
      </div>

      <div className="space-y-3">
        {packages.map((p) => (
          <div key={p.id} className="ticket-stub p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {/* image + text — stays side-by-side at every width */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-cloud dark:bg-white/5">
            {p.coverImage && (
                <Image src={p.coverImage} alt="" fill sizes="80px" className="object-cover" />
            )}
            </div>
            <div className="min-w-0 flex-1">
            <p className="font-semibold text-ink dark:text-white truncate">{p.title}</p>
            <p className="text-xs text-graytext dark:text-white/50">
                {p.destination.name} · {p.durationDays}D · ₹{p.priceInInr.toLocaleString("en-IN")}
                {p._count.enquiries > 0 && ` · ${p._count.enquiries} enquiries`}
            </p>
            </div>
        </div>

        {/* actions — wrap onto their own line on mobile, inline on desktop */}
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
            <span className={`text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full ${BADGE[p.status]}`}>
            {p.status}
            </span>

            <form action={toggleFeatured}>
            <input type="hidden" name="id" value={p.id} />
            <button
                title="Toggle featured"
                className={`w-8 h-8 rounded-full border text-sm ${
                p.featured
                    ? "bg-gold border-gold text-ink"
                    : "border-black/10 dark:border-white/15 text-graytext"
                }`}
            >
                ★
            </button>
            </form>

            <form action={setStatus}>
            <input type="hidden" name="id" value={p.id} />
            <input type="hidden" name="status" value={p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"} />
            <button className="text-xs font-semibold px-3 py-1.5 rounded-full border border-black/10 dark:border-white/15 hover:border-gold dark:text-white">
                {p.status === "PUBLISHED" ? "Unpublish" : "Publish"}
            </button>
            </form>

            <Link
            href={`/admin/packages/${p.id}/edit`}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-ink text-white dark:bg-white dark:text-ink"
            >
            Edit
            </Link>
        </div>
        </div>
        ))}

        {packages.length === 0 && (
          <p className="text-sm text-graytext dark:text-white/50 py-8">
            No packages yet. Create your first one.
          </p>
        )}
      </div>
    </section>
  );
}