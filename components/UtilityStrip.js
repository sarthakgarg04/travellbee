const PHONE = "+91 96858 10350";
const PHONE_HREF = "tel:+919685810350";
const EMAIL = "hello@travellbee.com";
const INSTAGRAM = "https://instagram.com/travellbeeholidays"; // ← replace with the real handle

export default function UtilityStrip() {
  return (
    <div className="hidden md:block bg-ink text-white/70 text-xs">
      <div className="max-w-6xl mx-auto px-6 h-9 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <a href={PHONE_HREF} className="hover:text-gold transition-colors">{PHONE}</a>
          <span className="text-white/20">·</span>
          <a href={`mailto:${EMAIL}`} className="hover:text-gold transition-colors">{EMAIL}</a>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/50">Based in Indore · Across India</span>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-gold transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 3.4a6.4 6.4 0 100 12.8 6.4 6.4 0 000-12.8zm0 10.6a4.2 4.2 0 110-8.4 4.2 4.2 0 010 8.4zm6.6-10.9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}