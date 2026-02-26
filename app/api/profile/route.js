import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createAuthServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const supabase = createAuthServerSupabase(token);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, credits, org_name, pan_number, gst_number, nationality, company_domicile, phone, designation, city, purpose, profile_prompted")
      .eq("id", user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || {});
  } catch (err) {
    console.error("[GET /api/profile]", err);
    return NextResponse.json(
      { error: err.message || "Failed to load profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const supabase = createAuthServerSupabase(token);

    const updates = {};
    const allowed = [
      "org_name",
      "pan_number",
      "gst_number",
      "nationality",
      "company_domicile",
      "phone",
      "designation",
      "city",
      "purpose",
      "profile_prompted",
    ];
    for (const key of allowed) {
      if (key in body) {
        updates[key] = body[key] === "" ? null : body[key];
      }
    }
    updates.updated_at = new Date().toISOString();

    if (Object.keys(updates).length <= 1) {
      return NextResponse.json({ ok: true });
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[PUT /api/profile]", err);
    return NextResponse.json(
      { error: err.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
