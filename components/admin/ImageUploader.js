"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageUploader({ images, onChange, coverImage, onCoverChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(files) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/cloudinary-sign", { method: "POST" });
      if (!res.ok) throw new Error("Could not get an upload signature.");
      const sig = await res.json();

      const uploaded = [];
      for (const file of files) {
        if (file.size > 8 * 1024 * 1024) {
          setError(`${file.name} is over 8MB — compress it first.`);
          continue;
        }
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
        if (!up.ok) throw new Error(`Upload failed for ${file.name}.`);
        const json = await up.json();
        uploaded.push({ url: json.secure_url, publicId: json.public_id, alt: "" });
      }

      const next = [...images, ...uploaded];
      onChange(next);
      if (!coverImage && next[0]) onCoverChange(next[0].url);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  function move(i, dir) {
    const next = [...images];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  function remove(i) {
    const removed = images[i];
    const next = images.filter((_, k) => k !== i);
    onChange(next);
    // Cloudinary asset is cleaned up on package delete; an orphan here is
    // cheaper than deleting an asset the user might undo by cancelling.
    if (coverImage === removed.url) onCoverChange(next[0]?.url || "");
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2 dark:text-white">Images</label>

      <label className="inline-block cursor-pointer text-sm font-semibold px-4 py-2 rounded-full border border-black/15 dark:border-white/15 dark:text-white hover:border-gold">
        {busy ? "Uploading…" : "+ Add images"}
        <input
          type="file" accept="image/*" multiple hidden disabled={busy}
          onChange={(e) => { upload([...e.target.files]); e.target.value = ""; }}
        />
      </label>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        {images.map((im, i) => (
          <div key={im.url} className="ticket-stub p-3 flex gap-3">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
              <Image src={im.url} alt="" fill sizes="80px" className="object-cover" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <input
                value={im.alt}
                placeholder="Alt text (helps SEO)"
                onChange={(e) => {
                  const next = [...images];
                  next[i] = { ...im, alt: e.target.value };
                  onChange(next);
                }}
                className="w-full text-xs border border-black/15 dark:border-white/15 rounded-stub px-2 py-1.5 bg-white dark:bg-white/5 dark:text-white"
              />
              <div className="flex items-center gap-1.5 text-[11px]">
                <button type="button" onClick={() => onCoverChange(im.url)}
                  className={`px-2 py-1 rounded-full font-semibold ${
                    coverImage === im.url ? "bg-gold text-ink" : "border border-black/10 dark:border-white/15 dark:text-white"
                  }`}>
                  {coverImage === im.url ? "Cover" : "Set cover"}
                </button>
                <button type="button" onClick={() => move(i, -1)} className="px-2 py-1 dark:text-white">↑</button>
                <button type="button" onClick={() => move(i, 1)} className="px-2 py-1 dark:text-white">↓</button>
                <button type="button" onClick={() => remove(i)} className="px-2 py-1 text-red-600 ml-auto">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}