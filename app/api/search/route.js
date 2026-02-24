import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { searchPlaces } from "@/lib/search-providers";
import {
  getCachedResults,
  setCachedResults,
  deductCredits,
  saveSearch,
  getUserCredits,
} from "@/lib/credits";

export async function POST(request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const query = typeof body.query === "string" ? body.query.trim() : "";
    const location = typeof body.location === "string" ? body.location.trim() : "";
    const providerOverride = body.provider;

    if (!query) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    const provider =
      providerOverride === "serpapi" || providerOverride === "serp"
        ? "serpapi"
        : "google_places";

    // 1. Check cache
    const cached = await getCachedResults(query, location, provider);
    if (cached && cached.length >= 0) {
      await saveSearch(user.id, query, location, provider, cached, 0);
      const creditsRemaining = await getUserCredits(user.id);
      return NextResponse.json({
        results: cached,
        count: cached.length,
        cached: true,
        provider,
        credits_used: 0,
        credits_remaining: creditsRemaining ?? 0,
      });
    }

    // 2. Deduct 1 credit
    const newBalance = await deductCredits(user.id, 1, "Search");
    if (newBalance === -1) {
      const credits = await getUserCredits(user.id);
      return NextResponse.json(
        { error: "Insufficient credits", credits: credits ?? 0 },
        { status: 402 }
      );
    }

    // 3. Search
    const results = await searchPlaces(query, location, providerOverride);

    // 4. Cache
    await setCachedResults(query, location, provider, results);

    // 5. Save search history
    await saveSearch(user.id, query, location, provider, results, 1);

    return NextResponse.json({
      results,
      count: results.length,
      cached: false,
      provider,
      credits_used: 1,
      credits_remaining: newBalance,
    });
  } catch (err) {
    console.error("[POST /api/search]", err);
    return NextResponse.json(
      { error: err.message || "Search failed" },
      { status: 500 }
    );
  }
}
