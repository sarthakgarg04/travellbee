"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const PLACES = [
  "Thailand", "Bali", "Dubai", "Vietnam", "Goa", "Kashmir",
  "Kerala", "Jaipur", "Singapore", "Ladakh", "Andaman", "Maldives",
];

const TYPE_MS = 130;
const DELETE_MS = 70;
const HOLD_MS = 1800;

export default function AnimatedSearch({ className = "", onNavigate }) {
  const router = useRouter();
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const [typed, setTyped] = useState("");
  const inputRef = useRef(null);
  const timer = useRef(null);

  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (focused || reduceMotion) return;

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const word = PLACES[wordIndex];
      if (!deleting) {
        charIndex += 1;
        setTyped(word.slice(0, charIndex));
        if (charIndex === word.length) {
          deleting = true;
          timer.current = setTimeout(tick, HOLD_MS);
          return;
        }
        timer.current = setTimeout(tick, TYPE_MS);
      } else {
        charIndex -= 1;
        setTyped(word.slice(0, charIndex));
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % PLACES.length;
        }
        timer.current = setTimeout(tick, DELETE_MS);
      }
    }

    timer.current = setTimeout(tick, TYPE_MS);
    return () => clearTimeout(timer.current);
  }, [focused, reduceMotion]);

  function onSubmit(e) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/destinations?q=${encodeURIComponent(q)}`);
    onNavigate?.();
    // Reset the field and release focus so the placeholder animation resumes.
    setValue("");
    setFocused(false);
    inputRef.current?.blur();
  }

  const ghost = reduceMotion ? "Thailand, Bali, Goa" : typed;
  const showPlaceholder = !focused && value === "";

  return (
    <form onSubmit={onSubmit} className={`group relative flex items-center h-11 rounded-full bg-cloud dark:bg-white/5 border border-black/5 dark:border-white/10 px-4 focus-within:border-gold/60 transition-colors ${className}`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-graytext dark:text-white/40 shrink-0">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>

      <div className="relative flex-1 ml-2.5">
        {showPlaceholder && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center text-sm text-graytext dark:text-white/40 whitespace-nowrap overflow-hidden">
            <span>Search for</span>
            <span className="text-gold font-semibold ml-2">{ghost}</span>
            {!reduceMotion && (
              <span className="inline-block w-px h-4 bg-gold ml-0.5 animate-pulse" />
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? "Type a destination" : ""}
          aria-label="Search destinations"
          className="w-full bg-transparent text-sm text-ink dark:text-white focus:outline-none placeholder:text-graytext/50"
        />
      </div>
    </form>
  );
}