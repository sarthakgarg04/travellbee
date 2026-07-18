"use client";

export default function AdminError({ reset }) {
  return (
    <section className="max-w-sm mx-auto px-6 py-24 text-center">
      <p className="text-ink dark:text-white mb-4">Something went wrong.</p>
      <button onClick={reset} className="text-sm font-semibold text-gold">Try again</button>
    </section>
  );
}