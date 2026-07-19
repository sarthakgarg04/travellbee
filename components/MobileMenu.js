"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AnimatedSearch from "./AnimatedSearch";

const PHONE = "+919685810350";
const WHATSAPP = "919685810350";
const WA_MSG = encodeURIComponent("Hi Travell Bee! I'd like to plan a trip.");

const NAV = [
  { href: "/destinations", label: "Destinations" },
  { href: "/#packages", label: "Packages" },
  { href: "/#enquire", label: "Contact" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Close whenever the route changes (a nav link was tapped).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While open: lock background scroll, close on Esc, move focus into the drawer.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    function onEsc(e) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="lg:hidden flex items-center gap-1">
      {/* Persistent phone icon — shows only below sm, where the "Call us" pill is hidden */}
      <a
        href={`tel:${PHONE}`}
        aria-label="Call Travell Bee"
        className="sm:hidden w-10 h-10 rounded-full border border-black/10 dark:border-white/15 flex items-center justify-center hover:border-gold transition-colors text-ink dark:text-white"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1l-2.2 2.2z" />
        </svg>
      </a>

      {/* Hamburger trigger */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-drawer"
        className="w-10 h-10 rounded-full border border-black/10 dark:border-white/15 flex items-center justify-center hover:border-gold transition-colors text-ink dark:text-white"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {/* Backdrop */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed top-0 right-0 z-50 h-full w-[82%] max-w-sm bg-white dark:bg-darkbg shadow-2xl flex flex-col transition-transform duration-300 ease-out motion-reduce:transition-none ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5 dark:border-white/10">
          <span className="airport-code">Menu</span>
          <button
            ref={closeBtnRef}
            onClick={close}
            aria-label="Close menu"
            className="w-9 h-9 rounded-full border border-black/10 dark:border-white/15 flex items-center justify-center hover:border-gold transition-colors text-ink dark:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Search — closes the drawer on submit via onNavigate */}
        <div className="px-5 py-4">
          <AnimatedSearch onNavigate={close} />
        </div>

        {/* Nav links */}
        <nav className="px-3 flex flex-col">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="px-3 py-3 rounded-xl font-medium text-ink dark:text-white hover:bg-cloud dark:hover:bg-white/5 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Call + WhatsApp pinned to the bottom */}
        <div className="mt-auto px-5 py-5 border-t border-black/5 dark:border-white/10 space-y-3">
          <a
            href={`tel:${PHONE}`}
            className="flex items-center justify-center gap-2 bg-gold text-ink font-semibold px-4 py-3 rounded-full hover:bg-ink hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1l-2.2 2.2z" />
            </svg>
            Call us
          </a>
          <a
            href={`https://wa.me/${WHATSAPP}?text=${WA_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-black/10 dark:border-white/15 text-ink dark:text-white font-semibold px-4 py-3 rounded-full hover:border-gold transition-colors"
          >
            WhatsApp us
          </a>
        </div>
      </div>
    </div>
  );
}