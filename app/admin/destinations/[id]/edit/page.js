import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getDestinationForAdmin } from "@/lib/services/destinations";
import DestinationForm from "@/components/admin/DestinationForm";

export default async function EditDestinationPage({ params }) {
  requireAdmin();
  const destination = await getDestinationForAdmin(params.id);
  if (!destination) notFound();

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-ink dark:text-white mb-8">Edit destination</h1>
      <DestinationForm destination={destination} />
    </section>
  );
}