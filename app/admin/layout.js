import Link from "next/link";
import { redirect } from "next/navigation";
import { clearSession } from "@/lib/auth";

async function logout() {
  "use server";
  clearSession();
  redirect("/admin/login");
}

export default function AdminLayout({ children }) {
  return (
    <div>
      <div className="border-b border-black/5 dark:border-white/10 bg-cloud dark:bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4 sm:gap-6 text-sm overflow-x-auto">
          <span className="airport-code shrink-0">Admin</span>
          <Link href="/admin/packages" className="font-medium hover:text-gold shrink-0">Packages</Link>
          <Link href="/admin/destinations" className="font-medium hover:text-gold shrink-0">Destinations</Link>
          <Link href="/admin" className="font-medium hover:text-gold shrink-0">Enquiries</Link>
          <Link href="/admin/reviews" className="font-medium hover:text-gold shrink-0">Reviews</Link>
          <form action={logout} className="ml-auto shrink-0">
            <button className="text-graytext dark:text-white/50 hover:text-gold whitespace-nowrap">Sign out</button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}