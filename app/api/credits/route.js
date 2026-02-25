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

    const [profileRes, transactionsRes, searchesRes, packagesRes] = await Promise.all([
      supabase.from("profiles").select("credits, total_searches, total_results_exported, plan").eq("id", user.id).single(),
      supabase
        .from("credit_transactions")
        .select("id, amount, balance_after, type, description, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("searches")
        .select("id, query, location, provider, result_count, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase.from("credit_packages").select("id, name, credits, price_inr, is_popular, sort_order").eq("is_active", true).order("sort_order"),
    ]);

    if (profileRes.error) {
      return NextResponse.json({ error: profileRes.error.message }, { status: 500 });
    }

    const profile = profileRes.data;
    return NextResponse.json({
      credits: profile?.credits ?? 0,
      total_searches: profile?.total_searches ?? 0,
      total_exported: profile?.total_results_exported ?? 0,
      plan: profile?.plan ?? "free",
      transactions: transactionsRes.data ?? [],
      recent_searches: searchesRes.data ?? [],
      packages: packagesRes.data ?? [],
    });
  } catch (err) {
    console.error("[GET /api/credits]", err);
    return NextResponse.json(
      { error: err.message || "Failed to load credits" },
      { status: 500 }
    );
  }
}
