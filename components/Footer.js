import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-cloud dark:bg-[#1A1A1A] mt-24 border-t border-black/5 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <Logo className="mb-3" />
          <p className="text-sm text-graytext dark:text-white/60">
            Handpicked tour packages, planned by people who&apos;ve actually been there.
          </p>
        </div>
        <div className="text-sm text-graytext dark:text-white/60">
          <p className="airport-code mb-3">Reach us</p>
          <p>hello@travellbee.com</p>
          <p>+91 9685810350</p>
        </div>
        <div className="text-sm text-graytext dark:text-white/60">
          <p className="airport-code mb-3">Office</p>
          <p>Office No 202, Samkit Villa, Near By Rennaisance College, Shreyas Regenst, 53, Anurag Nagar, Indore-452011, Madhya Pradesh, India</p>
        </div>
      </div>
      <div className="border-t border-black/5 dark:border-white/10 py-4 text-center text-xs text-graytext dark:text-white/40">
        © {new Date().getFullYear()} Travell Bee. All rights reserved.
      </div>
    </footer>
  );
}
