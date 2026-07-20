"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

export default function PackageGallery({ images = [], coverImage, title = "" }) {
  // Prefer the uploaded gallery; fall back to the single cover image.
  const gallery = images.length
    ? images
    : coverImage
    ? [{ url: coverImage, alt: title }]
    : [];

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const openAt = (i) => {
    setIndex(i);
    setOpen(true);
  };
  const close = useCallback(() => setOpen(false), []);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + gallery.length) % gallery.length),
    [gallery.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % gallery.length),
    [gallery.length]
  );

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close, prev, next]);

  if (!gallery.length) return null;

  const hero = gallery[0];
  const thumbs = gallery.slice(1, 3);
  const remaining = gallery.length - 3;

  return (
    <>
      <div className="grid grid-cols-3 gap-3 h-72 sm:h-96 mb-6">
        <button
          type="button"
          onClick={() => openAt(0)}
          aria-label="Open photo gallery"
          className={`relative rounded-stub overflow-hidden group ${
            thumbs.length ? "col-span-2" : "col-span-3"
          }`}
        >
          <Image
            src={hero.url}
            alt={hero.alt || title}
            fill
            sizes="(min-width:1024px) 640px, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
          />
        </button>

        {thumbs.length > 0 && (
          <div className="grid grid-rows-2 gap-3">
            {thumbs.map((im, i) => {
              const realIndex = i + 1;
              const isLast = i === thumbs.length - 1;
              return (
                <button
                  key={im.url}
                  type="button"
                  onClick={() => openAt(realIndex)}
                  aria-label={isLast && remaining > 0 ? "View all photos" : "Open photo"}
                  className="relative rounded-stub overflow-hidden group"
                >
                  <Image
                    src={im.url}
                    alt={im.alt || title}
                    fill
                    sizes="320px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {isLast && remaining > 0 && (
                    <span className="absolute inset-0 bg-black/55 flex items-center justify-center">
                      <span className="inline-flex items-center gap-2 bg-white text-ink text-sm font-semibold px-4 py-2 rounded-full">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M3 15l5-5 4 4 3-3 6 6" />
                        </svg>
                        View all {gallery.length}
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {mounted &&
        open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} photos`}
            className="fixed inset-0 z-[120] bg-black/90 flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 text-white">
              <span className="text-sm tabular-nums">
                {index + 1} / {gallery.length}
              </span>
              <button
                onClick={close}
                aria-label="Close gallery"
                className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center hover:border-white transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 relative flex items-center justify-center px-4 pb-4 select-none">
              {gallery.length > 1 && (
                <button
                  onClick={prev}
                  aria-label="Previous photo"
                  className="absolute left-3 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M15 6l-6 6 6 6" />
                  </svg>
                </button>
              )}

              <div className="relative w-full max-w-4xl h-full">
                <Image
                  src={gallery[index].url}
                  alt={gallery[index].alt || title}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>

              {gallery.length > 1 && (
                <button
                  onClick={next}
                  aria-label="Next photo"
                  className="absolute right-3 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}