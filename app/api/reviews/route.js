import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// In-memory rate limit, same approach as the enquiry route.
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 3;
}

const emailOk = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e || "");

export async function POST(request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
    }

    const payload = await request.json();
    const { name, email, rating, title, body, packageId, website } = payload;

    // Honeypot: bots fill hidden fields, humans don't.
    if (website) return NextResponse.json({ success: true });

    const r = Number(rating);
    if (
      !name?.trim() ||
      !emailOk(email) ||
      !(r >= 1 && r <= 5) ||
      !body?.trim() ||
      body.trim().length < 10
    ) {
      return NextResponse.json(
        { error: "Please add your name, a valid email, a rating, and a short review." },
        { status: 400 }
      );
    }
    if (!packageId) {
      return NextResponse.json({ error: "Missing package." }, { status: 400 });
    }

    const pkg = await prisma.package.findUnique({ where: { id: packageId }, select: { id: true } });
    if (!pkg) return NextResponse.json({ error: "Package not found." }, { status: 404 });

    try {
      await prisma.review.create({
        data: {
          packageId,
          authorName: name.trim().slice(0, 120),
          authorEmail: email.trim().toLowerCase().slice(0, 160),
          rating: Math.round(r),
          title: (title || "").trim().slice(0, 120),
          body: body.trim().slice(0, 3000),
          // status defaults to PENDING — hidden until an admin approves it.
        },
      });
    } catch (e) {
      // One review per email per package (unique constraint).
      if (e.code === "P2002") {
        return NextResponse.json({ error: "You have already reviewed this trip." }, { status: 409 });
      }
      throw e;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Review submission failed:", err);
    return NextResponse.json({ error: "Could not save your review." }, { status: 500 });
  }
}