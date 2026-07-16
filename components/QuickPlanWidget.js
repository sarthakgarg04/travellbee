"use client";

import { useState } from "react";

export default function QuickPlanWidget({ destinations = [] }) {
  const [destination, setDestination] = useState("");
  const [travelers, setTravelers] = useState(2);

  function handleSubmit(e) {
    e.preventDefault();
    // Hand the choice to the enquiry form below without a real search
    // backend — this site captures leads, it doesn't run live availability.
    try {
      sessionStorage.setItem(
        "prefill_message",
        destination ? `Interested in: ${destination} · ${travelers} traveler(s)` : ""
      );
    } catch {}
    document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="ticket-stub relative z-20 -mt-12 mx-auto max-w-3xl w-[calc(100%-3rem)] p-4 sm:p-5 flex flex-col sm:flex-row gap-3 items-stretch"
    >
      <div className="flex-1">
        <label className="block text-[11px] font-semibold uppercase tracking-wide text-graytext dark:text-white/50 mb-1">
          Destination
        </label>
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full bg-transparent font-semibold text-ink dark:text-white focus:outline-none"
        >
          <option value="">Where do you want to go?</option>
          {destinations.map((d) => (
            <option key={d.slug} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden sm:block w-px bg-black/10 dark:bg-white/15" />

      <div className="sm:w-32">
        <label className="block text-[11px] font-semibold uppercase tracking-wide text-graytext dark:text-white/50 mb-1">
          Travelers
        </label>
        <input
          type="number"
          min="1"
          value={travelers}
          onChange={(e) => setTravelers(e.target.value)}
          className="w-full bg-transparent font-semibold text-ink dark:text-white focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="bg-gold text-ink font-semibold px-6 py-3 rounded-full hover:bg-ink hover:text-white transition-colors shrink-0"
      >
        Plan my trip
      </button>
    </form>
  );
}
