import Image from "next/image";

export default function Logo({ className = "", compact = false }) {
  const width = compact ? 130 : 170;
  const height = compact ? 33 : 43;

  return (
    <span className={`relative inline-block ${className}`} style={{ width, height }}>
      {/* Light mode: black wordmark. Hidden (not unmounted) in dark mode via CSS,
          so there's no flicker or layout shift when the theme toggles. */}
      <Image
        src="/travellbee-logo.png"
        alt="Travell Bee"
        fill
        className="object-contain dark:hidden"
        priority
      />
      {/* Dark mode: same artwork, black pixels swapped to white programmatically. */}
      <Image
        src="/travellbee-logo-dark.png"
        alt="Travell Bee"
        fill
        className="object-contain hidden dark:block"
        priority
      />
    </span>
  );
}
