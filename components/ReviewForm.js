"use client";

import { useState } from "react";

const field =
  "w-full border border-black/15 dark:border-white/15 rounded-stub px-3 py-2 bg-white dark:bg-white/5 text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-gold";
const label = "block text-sm font-medium mb-1 dark:text-white";

export default function ReviewForm({ packageId }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [f, setF] = useState({ name: "", email: "", title: "", body: "", website: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [error, setError] = useState("");

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const emailOk = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (rating < 1) return setError("Please select a star rating.");
    if (!f.name.trim() || !emailOk(f.email)) return setError("Name and a valid email are required.");
    if (f.body.trim().length < 10) return setError("Please write at least a sentence.");

    setStatus("sending");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, rating, packageId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not submit your review.");
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="ticket-stub p-6 text-center">
        <p className="font-semibold text-ink dark:text-white mb-1">Thanks for your review!</p>
        <p className="text-sm text-graytext dark:text-white/60">
          It will appear here once our team has approved it.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="ticket-stub p-6 space-y-4">
      <h3 className="font-display text-lg font-bold text-ink dark:text-white">Write a review</h3>

      <div>
        <label className={label}>Your rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className="text-2xl leading-none"
            >
              <span className={(hover || rating) >= n ? "text-gold" : "text-black/20 dark:text-white/20"}>
                &#9733;
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Name</label>
          <input value={f.name} onChange={(e) => set("name", e.target.value)} className={field} />
        </div>
        <div>
          <label className={label}>Email (not shown publicly)</label>
          <input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} className={field} />
        </div>
      </div>

      <div>
        <label className={label}>Title (optional)</label>
        <input value={f.title} onChange={(e) => set("title", e.target.value)} className={field} />
      </div>

      <div>
        <label className={label}>Your review</label>
        <textarea rows={4} value={f.body} onChange={(e) => set("body", e.target.value)} className={field} />
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={f.website}
        onChange={(e) => set("website", e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-gold text-ink font-semibold px-7 py-3 rounded-full hover:bg-ink hover:text-white transition-colors disabled:opacity-60"
        >
          {status === "sending" ? "Submitting..." : "Submit review"}
        </button>
        <p className="text-xs text-graytext dark:text-white/40">
          Reviews are checked by our team before they appear.
        </p>
      </div>
    </form>
  );
}