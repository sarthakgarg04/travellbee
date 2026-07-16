"use client";

import { useEffect, useState } from "react";

export default function EnquiryForm({ packageId, packageTitle }) {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [prefill, setPrefill] = useState("");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("prefill_message");
      if (saved) {
        setPrefill(saved);
        sessionStorage.removeItem("prefill_message");
      }
    } catch {}
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    const form = e.target;
    const payload = {
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      travelers: Number(form.travelers.value) || 1,
      message: form.message.value,
      packageId: packageId || null,
    };

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="ticket-stub rounded-stub p-6 text-center">
        <p className="font-display text-xl text-navy dark:text-white mb-1">Got it — thank you.</p>
        <p className="text-sm text-charcoal/70 dark:text-white/60">
          Someone from our team will call you within 24 hours to plan the details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="ticket-stub rounded-stub p-6 space-y-4">
      {packageTitle && (
        <p className="airport-code text-xs text-teal mb-1">Enquiring about: {packageTitle}</p>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full border border-black/15 dark:border-white/15 rounded-stub px-3 py-2 bg-white dark:bg-white/5 text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-amber"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="phone">
            Phone (WhatsApp preferred)
          </label>
          <input
            id="phone"
            name="phone"
            required
            className="w-full border border-black/15 dark:border-white/15 rounded-stub px-3 py-2 bg-white dark:bg-white/5 text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-amber"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email (optional)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full border border-black/15 dark:border-white/15 rounded-stub px-3 py-2 bg-white dark:bg-white/5 text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-amber"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="travelers">
            Number of travelers
          </label>
          <input
            id="travelers"
            name="travelers"
            type="number"
            min="1"
            defaultValue="2"
            className="w-full border border-black/15 dark:border-white/15 rounded-stub px-3 py-2 bg-white dark:bg-white/5 text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-amber"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="message">
          Anything specific you want us to plan around?
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          defaultValue={prefill}
          key={prefill}
          className="w-full border border-black/15 dark:border-white/15 rounded-stub px-3 py-2 bg-white dark:bg-white/5 text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-amber"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full sm:w-auto bg-amber text-navy font-semibold px-6 py-3 rounded-stub hover:bg-navy hover:text-cream transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Request a callback"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600">
          Something went wrong sending that — please try again or WhatsApp us directly.
        </p>
      )}
    </form>
  );
}
