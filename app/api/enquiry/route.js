import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Simple in-memory rate limit. Fine for one region at low traffic.
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

export async function POST(request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
    }

    const body = await request.json();
    const { name, phone, email, travelers, message, packageId, website } = body;

    // Honeypot: bots fill hidden fields, humans don't.
    if (website) return NextResponse.json({ success: true });

    if (!name?.trim() || !/^[\d+\-\s()]{8,15}$/.test(phone || "")) {
      return NextResponse.json(
        { error: "A valid name and phone number are required." },
        { status: 400 }
      );
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name: name.trim().slice(0, 120),
        phone: phone.trim(),
        email: email?.trim() || null,
        travelers: Math.min(Math.max(Number(travelers) || 1, 1), 50),
        message: message?.trim().slice(0, 2000) || null,
        packageId: packageId || null,
      },
      include: { package: true },
    });

    // Fire-and-forget: a failed email must never fail the lead capture.
    notifyLead(enquiry).catch((e) => console.error("Lead notify failed:", e));

    return NextResponse.json({ success: true, id: enquiry.id });
  } catch (err) {
    console.error("Enquiry submission failed:", err);
    return NextResponse.json({ error: "Could not save your enquiry." }, { status: 500 });
  }
}

async function notifyLead(enquiry) {
  if (!process.env.RESEND_API_KEY || !process.env.LEAD_NOTIFY_EMAIL) return;

  const waNumber = enquiry.phone.replace(/\D/g, "").slice(-10);
  const html = `
    <div style="font-family:sans-serif;max-width:520px">
      <h2 style="margin:0 0 4px">New enquiry — call within 24 hours</h2>
      <p style="color:#666;margin:0 0 16px">${enquiry.package?.title || "General enquiry"}</p>
      <table style="border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0;color:#666">Name</td><td><b>${enquiry.name}</b></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Phone</td><td><a href="tel:${enquiry.phone}">${enquiry.phone}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td>${enquiry.email || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Travelers</td><td>${enquiry.travelers}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">Message</td><td>${enquiry.message || "—"}</td></tr>
      </table>
      <p style="margin:16px 0">
        <a href="https://wa.me/91${waNumber}" style="background:#25D366;color:#fff;padding:8px 16px;border-radius:8px;text-decoration:none">WhatsApp them</a>
      </p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Travell Bee Leads <onboarding@resend.dev>",
      to: process.env.LEAD_NOTIFY_EMAIL,
      subject: `New lead: ${enquiry.name} — ${enquiry.package?.title || "General"}`,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend ${res.status}: ${text}`);
  }
}
