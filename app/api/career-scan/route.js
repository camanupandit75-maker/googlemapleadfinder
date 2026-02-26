import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getUserCredits, deductCredits } from "@/lib/credits";
import { batchScanCareers } from "@/lib/career-scanner";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const results = body.results ?? [];
    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        { error: "results array is required and must not be empty" },
        { status: 400 }
      );
    }

    const withWebsites = results.filter((r) => !!(r.website ?? r.websiteUri?.trim()));
    const creditCost = Math.ceil(withWebsites.length / 10);

    const balance = await getUserCredits(user.id);
    if (balance == null || balance < creditCost) {
      return NextResponse.json(
        {
          error: `Not enough credits. Need ${creditCost} credit${creditCost !== 1 ? "s" : ""} to scan ${withWebsites.length} businesses.`,
          credits: balance ?? 0,
        },
        { status: 402 }
      );
    }

    const scanned = await batchScanCareers(withWebsites, 3);

    const newBalance = await deductCredits(user.id, creditCost, "Career scan");
    if (newBalance < 0) {
      return NextResponse.json(
        { error: "Insufficient credits. Please try again." },
        { status: 402 }
      );
    }

    const enrichedResults = results.map((r) => {
      const scannedResult = scanned.find(
        (s) =>
          (s.place_id && s.place_id === r.place_id) || (s.name && s.name === r.name)
      );
      if (scannedResult?.career_scan) {
        return {
          ...r,
          is_hiring: scannedResult.career_scan.is_hiring,
          career_url: scannedResult.career_scan.career_url ?? null,
          job_titles: scannedResult.career_scan.job_titles ?? [],
          hiring_confidence: scannedResult.career_scan.confidence,
        };
      }
      return r;
    });

    const hiring_count = enrichedResults.filter((r) => r.is_hiring).length;
    const with_jobs = enrichedResults.filter(
      (r) => r.job_titles && r.job_titles.length > 0
    ).length;

    return NextResponse.json({
      results: enrichedResults,
      stats: {
        total: results.length,
        with_websites: withWebsites.length,
        hiring: hiring_count,
        with_job_titles: with_jobs.length,
        credits_used: creditCost,
      },
    });
  } catch (err) {
    console.error("[POST /api/career-scan]", err);
    return NextResponse.json(
      { error: err.message || "Career scan failed" },
      { status: 500 }
    );
  }
}
