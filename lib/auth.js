import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.SESSION_SECRET || "";
const COOKIE = "tb_admin";

function sign(value) {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

export function createSessionToken() {
  const payload = String(Date.now() + 1000 * 60 * 60 * 12); // 12h
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token) {
  if (!token || !SECRET) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  if (sig.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  return Number(payload) > Date.now();
}

/** Call at the TOP of every admin page and every admin server action. */
export function requireAdmin() {
  const token = cookies().get(COOKIE)?.value;
  if (!verifySessionToken(token)) {
    throw new Error("UNAUTHORIZED");
  }
}

export function clearSession() {
  cookies().delete(COOKIE);
}

export const SESSION_COOKIE = COOKIE;