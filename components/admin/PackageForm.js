"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { savePackage, deletePackage } from "@/app/admin/packages/actions";
import ImageUploader from "./ImageUploader";
import { slugify } from "@/lib/validate";
import { THEMES, PACKAGE_STATUSES } from "@/lib/constants";
import PlacesEditor from "./PlacesEditor";

const field =
  "w-full border border-black/15 dark:border-white/15 rounded-stub px-3 py-2 bg-white dark:bg-white/5 text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-gold";
const label = "block text-sm font-medium mb-1 dark:text-white";

export default function PackageForm({ pkg, destinations }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [errors, setErrors] = useState({});

  const [f, setF] = useState({
    title: pkg?.title || "",
    slug: pkg?.slug || "",
    slugTouched: Boolean(pkg?.slug),
    destinationId: pkg?.destinationId || destinations[0]?.id || "",
    durationDays: pkg?.durationDays ?? 3,
    priceInInr: pkg?.priceInInr ?? "",
    offerPriceInInr: pkg?.offerPriceInInr ?? "",
    offerEndsAt: pkg?.offerEndsAt
      ? new Date(pkg.offerEndsAt).toISOString().slice(0, 10)
      : "",
    summary: pkg?.summary || "",
    coverImage: pkg?.coverImage || "",
    inclusions: (pkg?.inclusions || []).join("\n"),
    exclusions: (pkg?.exclusions || []).join("\n"),
    themes: pkg?.themes || [],
    featured: pkg?.featured ?? false,
    status: pkg?.status || "DRAFT",
  });

  const [itinerary, setItinerary] = useState(
    Array.isArray(pkg?.itinerary) && pkg.itinerary.length
      ? pkg.itinerary
      : [{ title: "", description: "" }]
  );
  const [images, setImages] = useState(
    (pkg?.images || []).map((im) => ({ url: im.url, publicId: im.publicId, alt: im.alt }))
  );

  const [places, setPlaces] = useState(Array.isArray(pkg?.places) ? pkg.places : []);
  const [mapQuery, setMapQuery] = useState(pkg?.mapQuery || "");

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  function onTitle(v) {
    setF((p) => ({ ...p, title: v, slug: p.slugTouched ? p.slug : slugify(v) }));
  }

  function submit(e) {
    e.preventDefault();
    setErrors({});
    start(async () => {
      const res = await savePackage(pkg?.id || null, { ...f, itinerary, images,places, mapQuery });
      // On success the action redirects, so we only get here on failure.
      if (res && !res.ok) {
        setErrors(res.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  const Err = ({ k }) =>
    errors[k] ? <p className="text-xs text-red-600 mt-1">{errors[k]}</p> : null;

  return (
    <form onSubmit={submit} className="space-y-8">
      {/* BASICS */}
      <div className="ticket-stub p-6 space-y-4">
        <div>
          <label className={label}>Package title</label>
          <input value={f.title} onChange={(e) => onTitle(e.target.value)} className={field} />
          <Err k="title" />
        </div>

        <div>
          <label className={label}>URL slug</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-graytext dark:text-white/40">/packages/</span>
            <input
              value={f.slug}
              onChange={(e) => setF((p) => ({ ...p, slug: e.target.value, slugTouched: true }))}
              className={field}
            />
          </div>
          <p className="text-xs text-graytext dark:text-white/40 mt-1">
            Changing this on a live package breaks existing links. Leave it alone unless the title was wrong.
          </p>
          <Err k="slug" />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={label}>Destination</label>
            <select value={f.destinationId} onChange={(e) => set("destinationId", e.target.value)} className={field}>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <Err k="destinationId" />
          </div>
          <div>
            <label className={label}>Duration (days)</label>
            <input type="number" min="1" value={f.durationDays}
              onChange={(e) => set("durationDays", e.target.value)} className={field} />
            <Err k="durationDays" />
          </div>
          <div>
            <label className={label}>Status</label>
            <select value={f.status} onChange={(e) => set("status", e.target.value)} className={field}>
              {PACKAGE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={label}>Summary</label>
          <textarea rows={3} value={f.summary} onChange={(e) => set("summary", e.target.value)} className={field} />
          <p className="text-xs text-graytext dark:text-white/40 mt-1">{f.summary.length}/400 — shown on cards and in search results.</p>
          <Err k="summary" />
        </div>
      </div>

      {/* PRICING */}
      <div className="ticket-stub p-6 grid sm:grid-cols-3 gap-4">
        <div>
          <label className={label}>Base price (₹ / person)</label>
          <input type="number" min="0" value={f.priceInInr}
            onChange={(e) => set("priceInInr", e.target.value)} className={field} />
          <Err k="priceInInr" />
        </div>
        <div>
          <label className={label}>Offer price (optional)</label>
          <input type="number" min="0" value={f.offerPriceInInr}
            onChange={(e) => set("offerPriceInInr", e.target.value)} className={field} />
          <Err k="offerPriceInInr" />
        </div>
        <div>
          <label className={label}>Offer ends</label>
          <input type="date" value={f.offerEndsAt}
            onChange={(e) => set("offerEndsAt", e.target.value)} className={field} />
          <Err k="offerEndsAt" />
        </div>
      </div>

      {/* IMAGES */}
      <div className="ticket-stub p-6">
        <ImageUploader
          images={images}
          onChange={setImages}
          coverImage={f.coverImage}
          onCoverChange={(url) => set("coverImage", url)}
        />
        <Err k="coverImage" />
      </div>

      {/* ITINERARY */}
      <div className="ticket-stub p-6">
        <div className="flex items-center justify-between mb-4">
          <label className={label + " mb-0"}>Day-by-day itinerary</label>
          <span className="text-xs text-graytext dark:text-white/40">
            {itinerary.length} of {f.durationDays} days
          </span>
        </div>

        <div className="route-line pl-10 space-y-4">
          {itinerary.map((s, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-10 top-1 w-8 h-8 rounded-full bg-gold text-ink text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    placeholder={`Day ${i + 1} title — e.g. "Arrival & Calangute"`}
                    value={s.title}
                    onChange={(e) => {
                      const next = [...itinerary];
                      next[i] = { ...s, title: e.target.value };
                      setItinerary(next);
                    }}
                    className={field}
                  />
                  <button type="button"
                    onClick={() => setItinerary(itinerary.filter((_, k) => k !== i))}
                    className="text-red-600 text-xs px-3 shrink-0">Remove</button>
                </div>
                <textarea
                  rows={2} placeholder="What happens on this day"
                  value={s.description}
                  onChange={(e) => {
                    const next = [...itinerary];
                    next[i] = { ...s, description: e.target.value };
                    setItinerary(next);
                  }}
                  className={field}
                />
              </div>
            </div>
          ))}
        </div>

        <button type="button"
          onClick={() => setItinerary([...itinerary, { title: "", description: "" }])}
          className="mt-4 text-sm font-semibold px-4 py-2 rounded-full border border-black/15 dark:border-white/15 dark:text-white hover:border-gold">
          + Add day
        </button>
        <Err k="itinerary" />
      </div>

      {/* PLACES + MAP */}
      <div className="ticket-stub p-6 space-y-6">
        <PlacesEditor places={places} onChange={setPlaces} />

        <div>
          <label className={label}>Map location</label>
          <input className={field} placeholder='e.g. "Jaipur, Rajasthan"'
            value={mapQuery} onChange={(e) => setMapQuery(e.target.value)} />
          <p className="text-xs text-graytext dark:text-white/40 mt-1">
            Just type the place name — no coordinates or API key needed. Leave blank to hide the map.
          </p>
        </div>
      </div>

      {/* INCLUSIONS */}
      <div className="ticket-stub p-6 grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Inclusions — one per line</label>
          <textarea rows={5} value={f.inclusions}
            onChange={(e) => set("inclusions", e.target.value)} className={field}
            placeholder={"3 nights hotel stay\nAirport transfers\nDaily breakfast"} />
        </div>
        <div>
          <label className={label}>Exclusions — one per line</label>
          <textarea rows={5} value={f.exclusions}
            onChange={(e) => set("exclusions", e.target.value)} className={field}
            placeholder={"Flights\nLunch & dinner"} />
        </div>
      </div>

      {/* THEMES + FEATURED */}
      <div className="ticket-stub p-6 space-y-4">
        <div>
          <label className={label}>Themes</label>
          <div className="flex flex-wrap gap-2">
            {THEMES.map((t) => {
              const on = f.themes.includes(t);
              return (
                <button key={t} type="button"
                  onClick={() => set("themes", on ? f.themes.filter((x) => x !== t) : [...f.themes, t])}
                  className={`chip ${on ? "active" : ""}`}>
                  {t}
                </button>
              );
            })}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm dark:text-white">
          <input type="checkbox" checked={f.featured}
            onChange={(e) => set("featured", e.target.checked)} className="accent-gold w-4 h-4" />
          Show on the homepage as a featured package
        </label>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending}
          className="bg-gold text-ink font-semibold px-7 py-3 rounded-full hover:bg-ink hover:text-white transition-colors disabled:opacity-60">
          {pending ? "Saving…" : pkg ? "Save changes" : "Create package"}
        </button>
        <button type="button" onClick={() => router.push("/admin/packages")}
          className="text-sm text-graytext dark:text-white/50 px-4">Cancel</button>

        {pkg && (
          <form action={deletePackage} className="ml-auto"
            onSubmit={(e) => {
              if (!confirm(`Delete "${pkg.title}"? Enquiries are kept but lose their package link.`))
                e.preventDefault();
            }}>
            <input type="hidden" name="id" value={pkg.id} />
            <button className="text-sm text-red-600 font-semibold px-4">Delete</button>
          </form>
        )}
      </div>
    </form>
  );
}