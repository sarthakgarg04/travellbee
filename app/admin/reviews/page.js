import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { setReviewStatus, deleteReview } from "./actions";

const BADGE = {
  PENDING: "bg-gold/20 text-gold",
  APPROVED: "bg-green-600/15 text-green-700",
  REJECTED: "bg-red-500/15 text-red-600",
};

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminReviewsPage() {
  requireAdmin();

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { package: { select: { title: true } } },
  });
  const pending = reviews.filter((r) => r.status === "PENDING").length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="font-display text-2xl font-extrabold text-ink dark:text-white">Reviews</h1>
        <p className="text-sm text-graytext dark:text-white/50">{pending} pending</p>
      </div>

      {reviews.length === 0 && (
        <p className="text-sm text-graytext dark:text-white/50">No reviews yet.</p>
      )}

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="ticket-stub p-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span>
                <span className="text-gold">{"\u2605".repeat(r.rating)}</span>
                <span className="text-black/20 dark:text-white/20">{"\u2605".repeat(5 - r.rating)}</span>
              </span>
              <span className={`text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full ${BADGE[r.status]}`}>
                {r.status}
              </span>
              <span className="text-xs text-graytext dark:text-white/50 ml-auto">{fmtDate(r.createdAt)}</span>
            </div>

            {r.title && <p className="font-semibold text-ink dark:text-white">{r.title}</p>}
            <p className="text-sm text-graytext dark:text-white/70 mt-1">{r.body}</p>
            <p className="text-xs text-graytext dark:text-white/40 mt-2">
              {r.authorName} &middot; {r.authorEmail} &middot; {r.package?.title || "General"}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              {r.status !== "APPROVED" && (
                <form action={setReviewStatus}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value="APPROVED" />
                  <button className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-600 text-white hover:opacity-90">
                    Approve
                  </button>
                </form>
              )}
              {r.status !== "REJECTED" && (
                <form action={setReviewStatus}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value="REJECTED" />
                  <button className="text-xs font-semibold px-3 py-1.5 rounded-full border border-black/10 dark:border-white/15 dark:text-white hover:border-gold">
                    Reject
                  </button>
                </form>
              )}
              <form action={deleteReview} className="ml-auto">
                <input type="hidden" name="id" value={r.id} />
                <button className="text-xs font-semibold px-3 py-1.5 text-red-600">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}