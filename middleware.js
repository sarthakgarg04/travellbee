import { NextResponse } from "next/server";

// NOT a security boundary. Real enforcement is requireAdmin() inside every
// admin page and server action (see lib/auth.js). This only saves logged-out
// staff from seeing a thrown error instead of a login form.
export function middleware(request) {
  const hasCookie = request.cookies.has("tb_admin");
  if (!hasCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // Exclude the login page itself, or you get a redirect loop.
  matcher: ["/admin", "/admin/((?!login).*)"],
};