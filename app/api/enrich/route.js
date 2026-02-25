import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { batchExtractContacts } from "@/lib/enrichment";

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

    const websites = results.map((r) => r.website ?? r.websiteUri).filter(Boolean);
    const withWebsites = websites.length;
    const urlToIndex = new Map();
    websites.forEach((url, i) => {
      const normalized = url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`;
      if (!urlToIndex.has(normalized)) urlToIndex.set(normalized, []);
      urlToIndex.get(normalized).push(i);
    });
    const uniqueUrls = [...urlToIndex.keys()];

    const extracted = await batchExtractContacts(uniqueUrls, 3);

    const enriched = results.map((r, idx) => {
      const website = (r.website ?? r.websiteUri ?? "").trim();
      const normalizedUrl = website.startsWith("http") ? website : `https://${website}`;
      const extractIdx = uniqueUrls.indexOf(normalizedUrl);
      const data = extractIdx >= 0 && extracted[extractIdx] ? extracted[extractIdx] : null;

      let enrichment_status = "no_data";
      if (!website) enrichment_status = "no_data";
      else if (data?.error) enrichment_status = "error";
      else if (data?.has_data) enrichment_status = "found";

      return {
        ...r,
        enriched_emails: data?.emails ?? [],
        enriched_phones: data?.phones ?? [],
        enriched_whatsapp: data?.whatsapp ?? [],
        enriched_linkedin: data?.linkedin ?? [],
        enriched_twitter: data?.twitter ?? [],
        enriched_facebook: data?.facebook ?? [],
        enriched_instagram: data?.instagram ?? [],
        enrichment_status,
      };
    });

    const emailsFound = enriched.reduce((s, r) => s + (r.enriched_emails?.length ?? 0), 0);
    const phonesFound = enriched.reduce((s, r) => s + (r.enriched_phones?.length ?? 0), 0);
    const whatsappFound = enriched.reduce((s, r) => s + (r.enriched_whatsapp?.length ?? 0), 0);
    const enrichedCount = enriched.filter((r) => r.enrichment_status === "found").length;

    return NextResponse.json({
      enriched,
      stats: {
        total: results.length,
        with_websites: withWebsites,
        enriched: enrichedCount,
        emails_found: emailsFound,
        phones_found: phonesFound,
        whatsapp_found: whatsappFound,
      },
    });
  } catch (err) {
    console.error("[POST /api/enrich]", err);
    return NextResponse.json(
      { error: err.message || "Enrichment failed" },
      { status: 500 }
    );
  }
}
