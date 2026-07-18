import { requireAdmin } from "@/lib/auth";
import DestinationForm from "@/components/admin/DestinationForm";

export default function NewDestinationPage() {
  requireAdmin();
  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-ink dark:text-white mb-8">New destination</h1>
      <DestinationForm />
    </section>
  );
}