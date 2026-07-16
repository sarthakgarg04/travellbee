"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up from 0 to `value` once it enters the viewport. Pass real
 * numbers only — this exists to make actual data (destination count,
 * package count) feel alive, not to dress up invented stats.
 */
export default function Counter({ value, suffix = "", label, duration = 1200 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();

          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <div ref={ref}>
      <p className="font-display text-4xl font-extrabold text-ink dark:text-white">
        {display}
        {suffix}
      </p>
      <p className="text-sm text-graytext dark:text-white/60">{label}</p>
    </div>
  );
}
