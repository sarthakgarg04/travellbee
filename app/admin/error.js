"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminError({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    if (error?.message === "UNAUTHORIZED") {
      router.replace("/admin/login");
    }
  }, [error, router]);

  if (error?.message === "UNAUTHORIZED") {
    return (
      <section className="max-w-sm mx-auto px-6 py-24 text-center">
        <p className="text-sm text-graytext dark:text-white/50">Redirecting to login…</p>
      </section>
    );
  }

  return (
    <section className="max-w-sm mx-auto px-6 py-24 text-center">
      <p className="text-ink dark:text-white mb-4">Something went wrong.</p>
      <button onClick={reset} className="text-sm font-semibold text-gold">Try again</button>
    </section>
  );
}