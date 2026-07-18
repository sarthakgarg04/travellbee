import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { timingSafeEqual, createHash } from "crypto";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

function safeEqual(a, b) {
  // Hash first so the compare is always fixed-length regardless of input length.
  const ha = createHash("sha256").update(String(a)).digest();
  const hb = createHash("sha256").update(String(b)).digest();
  return timingSafeEqual(ha, hb);
}

async function login(formData) {
  "use server";
  const user = String(formData.get("user") || "");
  const pass = String(formData.get("pass") || "");

  const ok =
    safeEqual(user, process.env.ADMIN_USER || "") &&
    safeEqual(pass, process.env.ADMIN_PASS || "");

  if (!ok) redirect("/admin/login?e=1");

  cookies().set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  redirect("/admin/packages");
}

export const metadata = { title: "Admin login" };

export default function LoginPage({ searchParams }) {
  return (
    <section className="max-w-sm mx-auto px-6 py-24">
      <h1 className="font-display text-2xl font-bold text-ink dark:text-white mb-6">
        Travell Bee admin
      </h1>
      <form action={login} className="ticket-stub p-6 space-y-4">
        <input
          name="user" placeholder="Username" autoComplete="username" required
          className="w-full border border-black/15 dark:border-white/15 rounded-stub px-3 py-2 bg-white dark:bg-white/5 dark:text-white"
        />
        <input
          name="pass" type="password" placeholder="Password" autoComplete="current-password" required
          className="w-full border border-black/15 dark:border-white/15 rounded-stub px-3 py-2 bg-white dark:bg-white/5 dark:text-white"
        />
        {searchParams?.e && (
          <p className="text-sm text-red-600">Wrong username or password.</p>
        )}
        <button className="w-full bg-gold text-ink font-semibold px-6 py-3 rounded-full hover:bg-ink hover:text-white transition-colors">
          Sign in
        </button>
      </form>
    </section>
  );
}