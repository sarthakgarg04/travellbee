import Link from "next/link";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-ink/90 backdrop-blur-md border-b border-black/5 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-body text-sm font-medium">
          <Link href="/destinations" className="hover:text-gold transition-colors">
            Destinations
          </Link>
          <Link href="/#packages" className="hover:text-gold transition-colors">
            Packages
          </Link>
          <Link href="/#enquire" className="hover:text-gold transition-colors">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/#enquire"
            className="bg-ink text-white dark:bg-gold dark:text-ink text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gold hover:text-ink transition-colors"
          >
            Plan my trip
          </Link>
        </div>
      </div>
    </header>
  );
}
