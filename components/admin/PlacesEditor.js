"use client";

import { useState } from "react";
import Image from "next/image";

// Same signed-upload flow the gallery/cover use, for one file.
async function uploadOne(file) {
  const res = await fetch("/api/admin/cloudinary-sign", { method: "POST" });
  if (!res.ok) throw new Error("Could not get an upload signature.");
  const sig = await res.json();

  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", sig.apiKey);
  fd.append("timestamp", sig.timestamp);
  fd.append("signature", sig.signature);
  fd.append("folder", sig.folder);

  const up = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: "POST", body: fd }
  );
  if (!up.ok) throw new Error("Upload failed.");
  const json = await up.json();
  return { url: json.secure_url, publicId: json.public_id };
}

export default function PlacesEditor({ places, onChange }) {
  const [busyIdx, setBusyIdx] = useState(-1);
  const [error, setError] = useState("");

  function setName(i, name) {
    const next = [...places];
    next[i] = { ...next[i], name };
    onChange(next);
  }

  async function upload(i, file) {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setError("Image is over 8MB — compress it first.");
      return;
    }
    setBusyIdx(i);
    setError("");
    try {
      const { url, publicId } = await uploadOne(file);
      const next = [...places];
      next[i] = { ...next[i], image: url, publicId };
      onChange(next);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyIdx(-1);
    }
  }

  function remove(i) {
    onChange(places.filter((_, k) => k !== i));
  }

  function add() {
    onChange([...places, { name: "", image: "", publicId: "" }]);
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1 dark:text-white">Places you&apos;ll see</label>
      <p className="text-xs text-graytext dark:text-white/40 mb-3">
        Key spots on this trip — each renders as a photo card on the package page.
      </p>

      <div className="space-y-3">
        {places.map((p, i) => (
          <div key={i} className="ticket-stub p-3 flex gap-3 items-start">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-cloud dark:bg-white/5">
              {p.image ? (
                <Image src={p.image} alt="" fill sizes="80px" className="object-cover" />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] text-graytext dark:text-white/40">
                  No photo
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <input
                value={p.name}
                placeholder="Place name — e.g. Hawa Mahal"
                onChange={(e) => setName(i, e.target.value)}
                className="w-full text-sm border border-black/15 dark:border-white/15 rounded-stub px-2 py-1.5 bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <div className="flex items-center gap-2">
                <label className="inline-block cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-full border border-black/15 dark:border-white/15 dark:text-white hover:border-gold">
                  {busyIdx === i ? "Uploading…" : p.image ? "Replace photo" : "+ Upload photo"}
                  <input
                    type="file" accept="image/*" hidden disabled={busyIdx === i}
                    onChange={(e) => { upload(i, e.target.files[0]); e.target.value = ""; }}
                  />
                </label>
                <button type="button" onClick={() => remove(i)} className="text-xs text-red-600 ml-auto">
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      <button type="button" onClick={add}
        className="mt-3 text-sm font-semibold px-4 py-2 rounded-full border border-black/15 dark:border-white/15 dark:text-white hover:border-gold">
        + Add place
      </button>
    </div>
  );
}