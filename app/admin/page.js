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

      <div className="overflow-x-auto ticket-stub rounded-stub">
        <table className="w-full text-sm">
          <thead className="bg-sand dark:bg-white/5 text-left">
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
              <tr key={e.id} className="border-t border-charcoal/10 dark:border-white/10 align-top">
                <td className="p-3 font-medium">{e.name}</td>
                <td className="p-3">{e.phone}</td>
                <td className="p-3">{e.package?.title || "General enquiry"}</td>
                <td className="p-3">{e.travelers}</td>
                <td className="p-3 text-charcoal/60 dark:text-white/50">
                  {new Date(e.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="p-3">
                  <form action={updateStatus} className="flex gap-2">
                    <input type="hidden" name="id" value={e.id} />
                    <select
                      name="status"
                      defaultValue={e.status}
                      className="border border-charcoal/20 dark:border-white/20 rounded-stub px-2 py-1 bg-cream dark:bg-white/10 dark:text-white text-sm"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="text-xs bg-ink text-white px-3 py-1 rounded-stub hover:bg-gold hover:text-ink dark:text-white transition-colors"
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
          <p className="p-6 text-sm text-charcoal/60 dark:text-white/50">No enquiries yet.</p>
        )}
      </div>
    </section>
  );
}
