import Image from "next/image";

export default function Logo({ className = "", compact = false }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/travellbee-logo.png"
        alt="Travell Bee"
        width={compact ? 130 : 170}
        height={compact ? 33 : 43}
        className="object-contain"
        priority
      />
    </span>
  );
}
