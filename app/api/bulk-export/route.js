import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

const ALL_RESULTS_HEADERS = [
  "S.No",
  "Source Query",
  "Location",
  "Name",
  "Category",
  "Rating",
  "Reviews",
  "Phone",
  "Email",
  "WhatsApp",
  "Address",
  "Website",
  "LinkedIn",
  "Google Maps",
];

function buildAllResultsRows(results) {
  const list = Array.isArray(results) ? results : [];
  return list.map((r, i) => [
    i + 1,
    r.source_query ?? "",
    r.source_location ?? "",
    r.name ?? "",
    r.category ?? "",
    r.rating ?? "",
    r.review_count ?? r.reviews ?? "",
    r.phone ?? "",
    (r.enriched_emails ?? [])[0] ?? "",
    (r.enriched_whatsapp ?? []).map((w) => `https://wa.me/${w}`).join(", "),
    r.address ?? "",
    r.website ?? "",
    (r.enriched_linkedin ?? [])[0] ?? "",
    r.maps_url ?? r.mapUrl ?? "",
  ]);
}

function buildByLocationRows(results) {
  const list = Array.isArray(results) ? results : [];
  const byLocation = new Map();
  for (const r of list) {
    const loc = r.source_location ?? "";
    if (!byLocation.has(loc)) {
      byLocation.set(loc, {
        location: loc,
        count: 0,
        withPhone: 0,
        withEmail: 0,
        withWebsite: 0,
        ratings: [],
      });
    }
    const row = byLocation.get(loc);
    row.count += 1;
    if (r.phone) row.withPhone += 1;
    if ((r.enriched_emails ?? []).length > 0) row.withEmail += 1;
    if (r.website) row.withWebsite += 1;
    if (r.rating != null && r.rating !== "") row.ratings.push(Number(r.rating));
  }
  const out = [];
  for (const row of byLocation.values()) {
    const avgRating =
      row.ratings.length > 0
        ? (row.ratings.reduce((a, b) => a + b, 0) / row.ratings.length).toFixed(1)
        : "";
    out.push([
      row.location,
      row.count,
      row.withPhone,
      row.withEmail,
      row.withWebsite,
      avgRating,
    ]);
  }
  out.sort((a, b) => (a[0] || "").localeCompare(b[0] || ""));
  return [["Location", "Results Found", "With Phone", "With Email", "With Website", "Avg Rating"], ...out];
}

function buildSummaryRows(stats, exportedAt) {
  return [
    ["Field", "Value"],
    ["Total Searches", stats?.total_searches ?? 0],
    ["Total Results", stats?.total_results ?? 0],
    ["Emails Found", stats?.emails_found ?? 0],
    ["Credits Used", stats?.credits_used ?? 0],
    ["Cached Searches", stats?.cached_count ?? 0],
    ["Exported On", exportedAt],
  ];
}

export async function POST(request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const results = body.results ?? [];
    const searches = body.searches ?? [];
    const stats = body.stats ?? {};

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        { error: "results array is required and must not be empty" },
        { status: 400 }
      );
    }

    const wb = XLSX.utils.book_new();

    const allResultsRows = buildAllResultsRows(results);
    const wsAll = XLSX.utils.aoa_to_sheet([ALL_RESULTS_HEADERS, ...allResultsRows]);
    wsAll["!cols"] = [
      { wch: 6 },
      { wch: 28 },
      { wch: 28 },
      { wch: 32 },
      { wch: 22 },
      { wch: 8 },
      { wch: 8 },
      { wch: 18 },
      { wch: 32 },
      { wch: 28 },
      { wch: 45 },
      { wch: 35 },
      { wch: 45 },
      { wch: 50 },
    ];
    XLSX.utils.book_append_sheet(wb, wsAll, "All Results");

    const byLocationData = buildByLocationRows(results);
    const wsLocation = XLSX.utils.aoa_to_sheet(byLocationData);
    wsLocation["!cols"] = [{ wch: 32 }, { wch: 14 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, wsLocation, "By Location");

    const exportedAt = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });
    const emailsFound = results.reduce((s, r) => s + (r.enriched_emails?.length ?? 0), 0);
    const summaryStats = {
      ...stats,
      emails_found: stats.emails_found ?? emailsFound,
    };
    const wsSummary = XLSX.utils.aoa_to_sheet(buildSummaryRows(summaryStats, exportedAt));
    wsSummary["!cols"] = [{ wch: 22 }, { wch: 28 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    const filename = `bulk_leads_export_${Date.now()}.xlsx`;

    const supabase = createServerSupabase();
    const { data: profile } = await supabase
      .from("profiles")
      .select("total_results_exported")
      .eq("id", user.id)
      .single();
    const current = profile?.total_results_exported ?? 0;
    await supabase
      .from("profiles")
      .update({ total_results_exported: current + results.length })
      .eq("id", user.id);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("[POST /api/bulk-export]", err);
    return NextResponse.json(
      { error: err.message || "Bulk export failed" },
      { status: 500 }
    );
  }
}
