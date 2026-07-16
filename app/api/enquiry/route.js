import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, travelers, message, packageId } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required." },
        { status: 400 }
      );
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        phone,
        email: email || null,
        travelers: travelers || 1,
        message: message || null,
        packageId: packageId || null,
      },
    });

    // TODO (Phase 1 wiring): send an email/WhatsApp notification to the
    // client here, e.g. via Resend, Nodemailer, or the WhatsApp Business API,
    // so they're alerted the moment a lead comes in.

    return NextResponse.json({ success: true, id: enquiry.id });
  } catch (err) {
    console.error("Enquiry submission failed:", err);
    return NextResponse.json(
      { error: "Could not save enquiry." },
      { status: 500 }
    );
  }
}
