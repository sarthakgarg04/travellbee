// Swap WHATSAPP_NUMBER for the client's real business number (with country code, no + or spaces).
const WHATSAPP_NUMBER = "9685810350";
const MESSAGE = encodeURIComponent("Hi Travell Bee! I'd like to know more about your tour packages.");

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-card hover:bg-ink transition-colors"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.8L2 22l5.44-1.43a9.9 9.9 0 0 0 4.6 1.14h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.12c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11a16.6 16.6 0 0 1-1.62-.6c-2.85-1.23-4.7-4.1-4.84-4.29-.14-.19-1.16-1.54-1.16-2.94s.73-2.09.99-2.37c.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.12.57.17.28.75 1.24 1.62 2 1.11.99 2.05 1.3 2.33 1.44.28.14.44.12.6-.07.17-.19.71-.83.9-1.12.19-.28.38-.24.64-.14.26.09 1.65.78 1.94.92.28.14.47.21.53.33.07.12.07.68-.17 1.36Z" />
      </svg>
      <span className="hidden sm:inline text-sm font-medium">Chat with us</span>
    </a>
  );
}
