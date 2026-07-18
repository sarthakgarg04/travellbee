import { createHash } from "crypto";

const FOLDER = "travellbee/packages";

/** Cloudinary signs: params sorted by key, joined k=v&k=v, + api_secret, SHA-1. */
function sign(params) {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1")
    .update(toSign + process.env.CLOUDINARY_API_SECRET)
    .digest("hex");
}

export function signUpload() {
  const timestamp = Math.round(Date.now() / 1000);
  const params = { folder: FOLDER, timestamp };
  return {
    signature: sign(params),
    timestamp,
    folder: FOLDER,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  };
}

/** Best-effort asset deletion. Never let this fail a DB operation. */
export async function destroyAsset(publicId) {
  if (!publicId || !process.env.CLOUDINARY_API_SECRET) return;
  const timestamp = Math.round(Date.now() / 1000);
  const signature = sign({ public_id: publicId, timestamp });
  const body = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    signature,
    api_key: process.env.CLOUDINARY_API_KEY,
  });
  await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/destroy`,
    { method: "POST", body }
  );
}