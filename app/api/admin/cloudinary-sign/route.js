import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { signUpload } from "@/lib/cloudinary";

export async function POST() {
  try {
    requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(signUpload());
}