import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));

    const full_name = (body.full_name ?? "").toString().trim();
    const email = (body.email ?? "").toString().trim();
    const phone = body.phone ? body.phone.toString().trim() : null;
    const company = body.company ? body.company.toString().trim() : null;
    const role = body.role ? body.role.toString().trim() : null;
    const message = body.message ? body.message.toString().trim() : null;

    if (!full_name || !email) {
      return NextResponse.json(
        { error: "full_name and email are required" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabase();
    const { error } = await supabase.from("demo_requests").insert({
      full_name,
      email,
      phone,
      company,
      role,
      message,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[POST /api/demo-request] insert error", error);
      return NextResponse.json(
        { error: error.message || "Failed to save demo request" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/demo-request]", err);
    return NextResponse.json(
      { error: err.message || "Failed to save demo request" },
      { status: 500 }
    );
  }
}

