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
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6 text-sm">
          <span className="airport-code">Admin</span>
          <Link href="/admin/packages" className="font-medium hover:text-gold">Packages</Link>
          <Link href="/admin" className="font-medium hover:text-gold">Enquiries</Link>
          <form action={logout} className="ml-auto">
            <button className="text-graytext dark:text-white/50 hover:text-gold">Sign out</button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}