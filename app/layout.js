import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Travell Bee | Tour Packages & Custom Itineraries",
  description:
    "Handpicked tour packages and day-by-day itineraries from Travell Bee Holidays, Indore. Get a callback within 24 hours.",
};

// Runs before paint so the page never "flashes" the wrong theme on load.
// Reads a saved preference first, falls back to the OS-level preference.
const noFlashScript = `
  (function () {
    try {
      var saved = localStorage.getItem("theme");
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (saved === "dark" || (!saved && prefersDark)) {
        document.documentElement.classList.add("dark");
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body className="font-body bg-white dark:bg-darkbg text-ink dark:text-white transition-colors">
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
