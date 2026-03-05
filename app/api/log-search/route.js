import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const search_type = body.search_type ?? "single";
    const business_type = body.business_type ?? "";
    const location = body.location ?? "";
    const provider = body.provider ?? "google_places";
    const results_count = typeof body.results_count === "number" ? body.results_count : 0;
    const credits_used = typeof body.credits_used === "number" ? body.credits_used : 1;

    const supabase = createServerSupabase();
    const { error } = await supabase.from("search_logs").insert({
      user_id: user.id,
      user_email: user.email ?? null,
      search_type,
      business_type,
      location,
      provider,
      results_count,
      credits_used,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[POST /api/log-search]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/log-search]", err);
    return NextResponse.json(
      { error: err.message || "Log failed" },
      { status: 500 }
    );
  }
}
