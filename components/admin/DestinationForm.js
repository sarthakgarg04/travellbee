"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { saveDestination, deleteDestination } from "@/app/admin/destinations/actions";
import { slugify } from "@/lib/validate";

const field =
  "w-full border border-black/15 dark:border-white/15 rounded-stub px-3 py-2 bg-white dark:bg-white/5 text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-gold";
const label = "block text-sm font-medium mb-1 dark:text-white";

export default function DestinationForm({ destination }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [errors, setErrors] = useState({});
  const [deleteError, setDeleteError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  const [f, setF] = useState({
    name: destination?.name || "",
    slug: destination?.slug || "",
    slugTouched: Boolean(destination?.slug),
    code: destination?.code || "",
    tagline: destination?.tagline || "",
    description: destination?.description || "",
    coverImage: destination?.coverImage || "",
  });

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  function onName(v) {
    setF((p) => ({ ...p, name: v, slug: p.slugTouched ? p.slug : slugify(v) }));
  }

  async function uploadCover(file) {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setUploadErr("Image is over 8MB — compress it first.");
      return;
    }
    setUploading(true);
    setUploadErr("");
    try {
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
      set("coverImage", json.secure_url);
    } catch (e) {
      setUploadErr(e.message);
    } finally {
      setUploading(false);
    }
  }

  function submit(e) {
    e.preventDefault();
    setErrors({});
    start(async () => {
      const res = await saveDestination(destination?.id || null, f);
      // On success the action redirects; we only land here on failure.
      if (res && !res.ok) {
        setErrors(res.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  function onDelete() {
    if (!confirm(`Delete "${destination.name}"?`)) return;
    setDeleteError("");
    startDelete(async () => {
      const res = await deleteDestination(destination.id);
      if (res && !res.ok) setDeleteError(res.error);
    });
  }

  const Err = ({ k }) =>
    errors[k] ? <p className="text-xs text-red-600 mt-1">{errors[k]}</p> : null;

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="ticket-stub p-6 space-y-4">
        <div>
          <label className={label}>Destination name</label>
          <input value={f.name} onChange={(e) => onName(e.target.value)} className={field} />
          <Err k="name" />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className={label}>URL slug</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-graytext dark:text-white/40">/destinations/</span>
              <input
                value={f.slug}
                onChange={(e) => setF((p) => ({ ...p, slug: e.target.value, slugTouched: true }))}
                className={field}
              />
            </div>
            <p className="text-xs text-graytext dark:text-white/40 mt-1">
              Changing this on a live destination breaks existing links.
            </p>
            <Err k="slug" />
          </div>
          <div>
            <label className={label}>Code</label>
            <input
              value={f.code}
              onChange={(e) => set("code", e.target.value.toUpperCase())}
              placeholder="GOA"
              maxLength={5}
              className={field}
            />
            <Err k="code" />
          </div>
        </div>

        <div>
          <label className={label}>Tagline</label>
          <input value={f.tagline} onChange={(e) => set("tagline", e.target.value)} className={field} />
          <p className="text-xs text-graytext dark:text-white/40 mt-1">{f.tagline.length}/120</p>
          <Err k="tagline" />
        </div>

        <div>
          <label className={label}>Description</label>
          <textarea rows={4} value={f.description} onChange={(e) => set("description", e.target.value)} className={field} />
          <p className="text-xs text-graytext dark:text-white/40 mt-1">{f.description.length}/600</p>
          <Err k="description" />
        </div>
      </div>

      <div className="ticket-stub p-6">
        <label className={label}>Cover image</label>
        {f.coverImage && (
          <div className="relative w-full h-40 rounded-lg overflow-hidden mb-3 bg-cloud dark:bg-white/5">
            <Image src={f.coverImage} alt="" fill sizes="640px" className="object-cover" />
          </div>
        )}
        <label className="inline-block cursor-pointer text-sm font-semibold px-4 py-2 rounded-full border border-black/15 dark:border-white/15 dark:text-white hover:border-gold">
          {uploading ? "Uploading…" : f.coverImage ? "Replace image" : "+ Upload image"}
          <input
            type="file" accept="image/*" hidden disabled={uploading}
            onChange={(e) => { uploadCover(e.target.files[0]); e.target.value = ""; }}
          />
        </label>
        {uploadErr && <p className="text-sm text-red-600 mt-2">{uploadErr}</p>}
        <Err k="coverImage" />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending}
          className="bg-gold text-ink font-semibold px-7 py-3 rounded-full hover:bg-ink hover:text-white transition-colors disabled:opacity-60">
          {pending ? "Saving…" : destination ? "Save changes" : "Create destination"}
        </button>
        <button type="button" onClick={() => router.push("/admin/destinations")}
          className="text-sm text-graytext dark:text-white/50 px-4">Cancel</button>

        {destination && (
          <button type="button" onClick={onDelete} disabled={deleting}
            className="ml-auto text-sm text-red-600 font-semibold px-4 disabled:opacity-60">
            {deleting ? "Deleting…" : "Delete"}
          </button>
        )}
      </div>

      {deleteError && <p className="text-sm text-red-600 text-right">{deleteError}</p>}
    </form>
  );
}