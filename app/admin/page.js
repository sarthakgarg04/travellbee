import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function getEnquiries() {
  try {
    return await prisma.enquiry.findMany({
      include: { package: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

async function updateStatus(formData) {
  "use server";
  requireAdmin();
  const id = formData.get("id");
  const status = formData.get("status");
  await prisma.enquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
}

const STATUSES = ["new", "contacted", "converted", "closed"];

export default async function AdminPage() {
  const enquiries = await getEnquiries();

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-navy dark:text-white mb-2">Enquiries</h1>
      <p className="text-charcoal/60 dark:text-white/50 text-sm mb-8">
        {enquiries.length} total. New leads need a callback within 24 hours.
      </p>

      {/* MOBILE (below md): one card per enquiry */}
      <div className="md:hidden space-y-3">
        {enquiries.map((e) => (
          <div key={e.id} className="ticket-stub p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <p className="font-semibold text-ink dark:text-white truncate">{e.name}</p>
                <a href={`tel:${e.phone}`} className="text-sm text-gold font-medium">{e.phone}</a>
              </div>
              <span className="text-xs text-graytext dark:text-white/50 shrink-0">
                {new Date(e.createdAt).toLocaleDateString("en-IN")}
              </span>
            </div>
            <p className="text-sm text-graytext dark:text-white/60 mb-3">
              {e.package?.title || "General enquiry"} · {e.travelers} traveler(s)
            </p>
            <form action={updateStatus} className="flex gap-2">
              <input type="hidden" name="id" value={e.id} />
              <select
                name="status"
                defaultValue={e.status}
                className="flex-1 border border-black/20 dark:border-white/20 rounded-stub px-2 py-1.5 bg-white dark:bg-white/10 dark:text-white text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                type="submit"
                className="text-xs bg-ink text-white px-4 py-1.5 rounded-stub hover:bg-gold hover:text-ink transition-colors shrink-0"
              >
                Update
              </button>
            </form>
          </div>
        ))}
        {enquiries.length === 0 && (
          <p className="text-sm text-graytext dark:text-white/50 py-8">No enquiries yet.</p>
        )}
      </div>

{/* DESKTOP (md and up): the existing table, unchanged */}
<div className="hidden md:block overflow-x-auto ticket-stub rounded-stub">
  <table className="w-full text-sm">
    <thead className="bg-cloud dark:bg-white/5 text-left">
      <tr>
        <th className="p-3">Name</th>
        <th className="p-3">Phone</th>
        <th className="p-3">Package</th>
        <th className="p-3">Travelers</th>
        <th className="p-3">Received</th>
        <th className="p-3">Status</th>
      </tr>
    </thead>
    <tbody>
      {enquiries.map((e) => (
        <tr key={e.id} className="border-t border-black/10 dark:border-white/10 align-top">
          <td className="p-3 font-medium">{e.name}</td>
          <td className="p-3">{e.phone}</td>
          <td className="p-3">{e.package?.title || "General enquiry"}</td>
          <td className="p-3">{e.travelers}</td>
          <td className="p-3 text-graytext dark:text-white/50">
            {new Date(e.createdAt).toLocaleDateString("en-IN")}
          </td>
          <td className="p-3">
            <form action={updateStatus} className="flex gap-2">
              <input type="hidden" name="id" value={e.id} />
              <select
                name="status"
                defaultValue={e.status}
                className="border border-black/20 dark:border-white/20 rounded-stub px-2 py-1 bg-white dark:bg-white/10 dark:text-white text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                type="submit"
                className="text-xs bg-ink text-white px-3 py-1 rounded-stub hover:bg-gold hover:text-ink transition-colors"
              >
                Update
              </button>
            </form>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  {enquiries.length === 0 && (
    <p className="p-6 text-sm text-graytext dark:text-white/50">No enquiries yet.</p>
  )}
</div>
    </section>
  );
}
