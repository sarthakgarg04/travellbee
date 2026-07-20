"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import Image from "next/image";

const STAR =
  "M12 .587l3.668 7.431 8.2 1.192-5.934 5.784 1.401 8.169L12 18.897l-7.335 3.856 1.401-8.169L.132 9.21l8.2-1.192z";

function Stars({ n }) {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
          className={i < n ? "text-gold" : "text-white/25"}>
          <path d={STAR} />
        </svg>
      ))}
    </div>
  );
}

/**
 * One shared lightbox for the whole page.
 *
 * Usage on the page:
 *   <GalleryProvider images={allImages}>
 *      ...anything, including <PackageGallery/> and the places grid...
 *   </GalleryProvider>
 *
 * `allImages` is the full album: [{ url, alt }] — cover + gallery + places,
 * already de-duplicated by the page. Any child can call openGallery(index)
 * to open the lightbox at a specific photo.
 */
const GalleryCtx = createContext(null);
export const useGallery = () => useContext(GalleryCtx);

export function GalleryProvider({ images = [], children }) {
  const [index, setIndex] = useState(-1); // -1 = closed
  const open = useCallback((i = 0) => setIndex(i), []);
  const close = useCallback(() => setIndex(-1), []);
  const isOpen = index >= 0;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, images.length, close]);

  return (
    <GalleryCtx.Provider value={{ images, openGallery: open }}>
      {children}

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 overflow-y-auto p-4 sm:p-8" onClick={close}>
          <button onClick={close} aria-label="Close gallery"
            className="fixed top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* large current image */}
          <div className="max-w-4xl mx-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden bg-white/5 mb-4">
              <Image key={index} src={images[index].url} alt={images[index].alt || ""} fill priority
                sizes="(max-width: 900px) 100vw, 900px" className="object-contain" />
            </div>

            {/* thumbnail strip */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((im, i) => (
                <button key={i} onClick={() => setIndex(i)}
                  className={`relative w-20 h-16 rounded-lg overflow-hidden shrink-0 ring-2 transition ${
                    i === index ? "ring-gold" : "ring-transparent opacity-60 hover:opacity-100"
                  }`}>
                  <Image src={im.url} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </GalleryCtx.Provider>
  );
}

/**
 * The hero (main image + right column). Reads the shared album from context,
 * so its thumbnails, "View All", and the places grid all open the same lightbox.
 */
export default function PackageGallery({ rating, reviewCount }) {
  const { images, openGallery } = useGallery();
  const cover = images[0];
  const extras = images.slice(1);
  const hasRating = Boolean(rating && reviewCount);
  const hasRight = hasRating || extras.length > 0;

  if (!cover) return null;

  return (
    <div className={`grid gap-3 ${hasRight ? "md:grid-cols-3" : ""}`}>
      {/* main image */}
      <button onClick={() => openGallery(0)}
        className={`relative rounded-stub overflow-hidden group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
          hasRight ? "md:col-span-2 h-72 sm:h-[440px]" : "h-72 sm:h-[460px]"
        }`}
        aria-label="Open photo gallery">
        <Image src={cover.url} alt={cover.alt || ""} fill priority sizes="(max-width: 768px) 100vw, 900px"
          className="object-cover group-hover:scale-105 transition-transform duration-700" />
      </button>

      {hasRight && (
        <div className="flex flex-col gap-3">
          {hasRating && (
            <div className="rounded-stub bg-ink text-white p-4 flex flex-col justify-center min-h-[96px]">
              <p className="font-display text-2xl font-extrabold leading-none">
                {rating.toFixed(1)}
                <span className="text-sm font-semibold text-white/50">/5</span>
              </p>
              <div className="my-1"><Stars n={Math.round(rating)} /></div>
              <p className="text-xs text-white/60">Based on {reviewCount} review{reviewCount > 1 ? "s" : ""}</p>
            </div>
          )}

          {extras.length > 0 && (
            <div className="relative grid grid-cols-2 gap-3 flex-1">
              {extras.slice(0, 2).map((im, idx) => (
                <button key={idx} onClick={() => openGallery(idx + 1)}
                  className={`relative rounded-stub overflow-hidden group min-h-[130px] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    extras.length === 1 ? "col-span-2" : ""
                  }`}>
                  <Image src={im.url} alt={im.alt || ""} fill sizes="240px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </button>
              ))}

              <button onClick={() => openGallery(0)} aria-label={`View all ${images.length} photos`}
                className="absolute bottom-3 right-3 inline-flex items-center gap-2 bg-white/95 backdrop-blur text-ink text-sm font-semibold pl-3.5 pr-4 py-2 rounded-full shadow-lg hover:bg-ink hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="8" y="8" width="12" height="12" rx="2" />
                  <path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                View All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Places grid. Each card opens the shared lightbox at its own photo,
 * because place photos are part of the same album (see the page).
 */
export function PlacesGrid({ places = [], startIndex = 0 }) {
  const { openGallery } = useGallery();
  if (places.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {places.map((p, i) => (
        <button key={i} onClick={() => openGallery(startIndex + i)} className="group text-left">
          <div className="relative h-32 rounded-stub overflow-hidden mb-2">
            <Image src={p.image} alt={p.name} fill sizes="220px"
              className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <p className="text-sm font-semibold text-ink dark:text-white">{p.name}</p>
        </button>
      ))}
    </div>
  );
}