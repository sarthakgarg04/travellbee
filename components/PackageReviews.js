function Stars({ value }) {
  const full = Math.round(value);
  return (
    <span aria-label={`${value.toFixed(1)} out of 5`}>
      <span className="text-gold">{"\u2605".repeat(full)}</span>
      <span className="text-black/20 dark:text-white/20">{"\u2605".repeat(5 - full)}</span>
    </span>
  );
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function PackageReviews({ reviews = [], count = 0, average = 0 }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-xl font-bold text-ink dark:text-white mb-4">Guest reviews</h2>

      {count === 0 ? (
        <p className="text-sm text-graytext dark:text-white/60 mb-6">
          No reviews yet. Be the first to review this trip.
        </p>
      ) : (
        <>
          <div className="ticket-stub p-6 mb-6 flex items-center gap-5">
            <div className="text-center shrink-0">
              <p className="font-display text-4xl font-extrabold text-ink dark:text-white leading-none">
                {average.toFixed(1)}
              </p>
              <p className="text-xs text-graytext dark:text-white/50 mt-1">out of 5</p>
            </div>
            <div>
              <Stars value={average} />
              <p className="text-sm text-graytext dark:text-white/60 mt-1">
                Based on {count} guest review{count > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <ul className="space-y-5 mb-8">
            {reviews.map((r) => (
              <li key={r.id} className="border-b border-black/5 dark:border-white/10 pb-5 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <Stars value={r.rating} />
                  {r.verified && (
                    <span className="text-[11px] font-semibold text-green-700 bg-green-600/10 px-2 py-0.5 rounded-full">
                      Verified traveller
                    </span>
                  )}
                </div>
                {r.title && <p className="font-semibold text-ink dark:text-white">{r.title}</p>}
                <p className="text-sm text-graytext dark:text-white/70 mt-1">{r.body}</p>
                <p className="text-xs text-graytext dark:text-white/40 mt-2">
                  {r.authorName} &middot; {fmtDate(r.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}