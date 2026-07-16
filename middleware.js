import { NextResponse } from "next/server";

// Simple HTTP Basic Auth gate for /admin, good enough for Phase 1 with one
// staff user. Swap for NextAuth.js in Phase 2 if you need multiple admins.
export function middleware(request) {
  const auth = request.headers.get("authorization");
  const user = process.env.ADMIN_USER || "admin";
  const pass = process.env.ADMIN_PASS || "changeme";
  const expected = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");

  if (auth === expected) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
  });
}

export const config = {
  matcher: "/admin/:path*",
};
