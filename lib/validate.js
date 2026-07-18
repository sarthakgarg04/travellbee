export function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const str = (v) => (typeof v === "string" ? v.trim() : "");
const int = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : NaN;
};

/**
 * Single source of truth for what a Package may contain.
 * Returns { data, errors }. Never throws — the form renders errors.
 */
export function validatePackage(input, { themes: allowedThemes, statuses }) {
  const errors = {};

  const title = str(input.title);
  if (title.length < 3) errors.title = "Title must be at least 3 characters.";

  const slug = slugify(input.slug || title);
  if (!slug) errors.slug = "Could not derive a slug from that title.";

  const destinationId = str(input.destinationId);
  if (!destinationId) errors.destinationId = "Pick a destination.";

  const durationDays = int(input.durationDays);
  if (!(durationDays >= 1 && durationDays <= 60))
    errors.durationDays = "Duration must be 1–60 days.";

  const priceInInr = int(input.priceInInr);
  if (!(priceInInr >= 0)) errors.priceInInr = "Price must be a positive number.";

  let offerPriceInInr = input.offerPriceInInr === "" || input.offerPriceInInr == null
    ? null
    : int(input.offerPriceInInr);
  if (offerPriceInInr !== null) {
    if (!(offerPriceInInr >= 0)) errors.offerPriceInInr = "Offer price must be a number.";
    else if (offerPriceInInr >= priceInInr)
      errors.offerPriceInInr = "Offer price must be lower than the base price.";
  }

  const offerEndsAt = str(input.offerEndsAt) ? new Date(input.offerEndsAt) : null;
  if (offerEndsAt && Number.isNaN(offerEndsAt.getTime()))
    errors.offerEndsAt = "Invalid date.";

  const summary = str(input.summary);
  if (summary.length < 20) errors.summary = "Write at least a sentence (20+ chars).";
  if (summary.length > 400) errors.summary = "Keep the summary under 400 characters.";

  const coverImage = str(input.coverImage);
  if (!/^https:\/\//.test(coverImage))
    errors.coverImage = "Upload at least one image and mark it as the cover.";

  // Itinerary: the whole reason this stays Json instead of a table.
  const rawItinerary = Array.isArray(input.itinerary) ? input.itinerary : [];
  const itinerary = rawItinerary
    .map((s, i) => ({
      day: i + 1,                       // day is positional — never trust the client's number
      title: str(s?.title).slice(0, 120),
      description: str(s?.description).slice(0, 1000),
    }))
    .filter((s) => s.title);
  if (itinerary.length === 0) errors.itinerary = "Add at least one day.";
  if (itinerary.length !== durationDays && !errors.durationDays)
    errors.itinerary = `You have ${itinerary.length} day(s) but duration says ${durationDays}.`;

  const lines = (v) =>
    String(v || "").split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 30);

  const themes = (Array.isArray(input.themes) ? input.themes : [])
    .filter((t) => allowedThemes.includes(t));

  const status = statuses.includes(input.status) ? input.status : "DRAFT";

  const images = (Array.isArray(input.images) ? input.images : [])
    .filter((im) => /^https:\/\//.test(str(im?.url)))
    .map((im, i) => ({
      url: str(im.url),
      publicId: str(im.publicId) || null,
      alt: str(im.alt).slice(0, 160),
      order: i,
    }));

  return {
    errors: Object.keys(errors).length ? errors : null,
    data: {
      title, slug, destinationId, durationDays, priceInInr,
      offerPriceInInr, offerEndsAt, summary, coverImage,
      inclusions: lines(input.inclusions),
      exclusions: lines(input.exclusions),
      itinerary, themes, status,
      featured: Boolean(input.featured),
      images,
    },
  };
}