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

export const dynamic = "force-dynamic";

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
    const deep = !!body.deep;

    if (!query) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    const provider =
      providerOverride === "serpapi" || providerOverride === "serp"
        ? "serpapi"
        : "google_places";

    const isGoogle = provider === "google_places";
    const wantDeep = isGoogle && deep;

    // 1. Check cache
    const cached = await getCachedResults(query, location, provider, wantDeep);
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

    // 2. Deduct credits (2 for deep, 1 otherwise). If deep and only 1 credit, get first page only.
    let creditsToDeduct = wantDeep ? 2 : 1;
    const userCredits = await getUserCredits(user.id);
    if (wantDeep && (userCredits ?? 0) < 2) {
      creditsToDeduct = 1;
    }

    const newBalance = await deductCredits(user.id, creditsToDeduct, "Search");
    if (newBalance === -1) {
      const credits = await getUserCredits(user.id);
      return NextResponse.json(
        { error: "Insufficient credits", credits: credits ?? 0 },
        { status: 402 }
      );
    }

    const actuallyDeep = wantDeep && creditsToDeduct === 2;

    // 3. Search
    const results = await searchPlaces(query, location, providerOverride, { deep: actuallyDeep });

    // 4. Cache
    await setCachedResults(query, location, provider, results, actuallyDeep);

    // 5. Save search history
    await saveSearch(user.id, query, location, provider, results, creditsToDeduct);

    return NextResponse.json({
      results,
      count: results.length,
      cached: false,
      provider,
      credits_used: creditsToDeduct,
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
