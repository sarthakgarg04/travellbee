import Link from "next/link";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import UtilityStrip from "./UtilityStrip";
import AnimatedSearch from "./AnimatedSearch";
import AccountMenu from "./AccountMenu";
import MobileMenu from "./MobileMenu";

const PHONE_HREF = "tel:+919685810350";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-ink/90 backdrop-blur-md border-b border-black/5 dark:border-white/10">
      <UtilityStrip />
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden lg:flex items-center gap-7 font-body text-sm font-medium ml-2">
          <Link href="/destinations" className="hover:text-gold transition-colors">Destinations</Link>
          <Link href="/#packages" className="hover:text-gold transition-colors">Packages</Link>
          <Link href="/#enquire" className="hover:text-gold transition-colors">Contact</Link>
        </nav>

        <AnimatedSearch className="hidden sm:flex flex-1 max-w-xs ml-auto" />

        <div className="flex items-center gap-2.5 ml-auto sm:ml-0">
          <ThemeToggle />
          <a
            href={PHONE_HREF}
            className="hidden sm:inline-flex items-center gap-2 bg-gold text-ink text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-ink hover:text-white transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1l-2.2 2.2z" />
            </svg>
            Call us
          </a>
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}