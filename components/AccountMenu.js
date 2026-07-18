"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const WHATSAPP = "919685810350";
const WA_MSG = encodeURIComponent("Hi Travell Bee! I'd like to check on my enquiry.");

export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} aria-label="Account menu" aria-expanded={open} className="w-10 h-10 rounded-full border border-black/10 dark:border-white/15 flex items-center justify-center hover:border-gold transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink dark:text-white">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 ticket-stub p-2 z-50">
          <Link href="/#enquire" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-cloud dark:hover:bg-white/5 transition-colors">
            <p className="text-sm font-medium text-ink dark:text-white">Track your enquiry</p>
            <p className="text-xs text-graytext dark:text-white/50">Call or message us for an update</p>
          </Link>
          <Link href="/#enquire" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-cloud dark:hover:bg-white/5 transition-colors">
            <p className="text-sm font-medium text-ink dark:text-white">Plan a new trip</p>
            <p className="text-xs text-graytext dark:text-white/50">Tell us where and when</p>
          </Link>
          <a href={`https://wa.me/${WHATSAPP}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-cloud dark:hover:bg-white/5 transition-colors">
            <p className="text-sm font-medium text-ink dark:text-white">WhatsApp us</p>
            <p className="text-xs text-graytext dark:text-white/50">Fastest way to reach a planner</p>
          </a>
        </div>
      )}
    </div>
  );
}
