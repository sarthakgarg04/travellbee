import Image from "next/image";

export default function Logo({ className = "", compact = false }) {
  const width = compact ? 130 : 170;
  const height = compact ? 33 : 43;
  const sizes = `${width}px`;

  return (
    <span className={`relative inline-block ${className}`} style={{ width, height }}>
      {/* Light mode: black wordmark. Hidden (not unmounted) in dark mode via CSS. */}
      <Image
        src="/travellbee-logo.png"
        alt="Travell Bee"
        fill
        sizes={sizes}
        className="object-contain dark:hidden"
        priority
      />
      {/* Dark mode: same artwork, white version. */}
      <Image
        src="/travellbee-logo-dark.png"
        alt="Travell Bee"
        fill
        sizes={sizes}
        className="object-contain hidden dark:block"
        priority
      />
    </span>
  );
}
