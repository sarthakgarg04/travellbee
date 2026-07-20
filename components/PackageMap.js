/**
 * Interactive map for a package location.
 * `query` is a plain place string like "Manali, Himachal Pradesh".
 * Uses Google's keyless embed (output=embed) so there's nothing to configure.
 */
export default function PackageMap({ query }) {
  if (!query) return null;

  const embed = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  const link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-ink dark:text-white">On the map</h2>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:underline"
        >
          Open in Google Maps
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
      <div className="relative h-72 rounded-stub overflow-hidden ring-1 ring-black/10 dark:ring-white/10">
        <iframe
          src={embed}
          title={`Map showing ${query}`}
          className="absolute inset-0 w-full h-full"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}