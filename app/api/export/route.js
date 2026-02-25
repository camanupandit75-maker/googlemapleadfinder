import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

const BASE_COLUMNS = [
  "S.No",
  "Name",
  "Category",
  "Rating",
  "Reviews",
  "Phone",
  "Address",
  "Website",
  "Hours",
  "Latitude",
  "Longitude",
  "Google Maps URL",
];

const ENRICHED_COLUMNS = ["Email", "WhatsApp", "LinkedIn", "Facebook", "Extra Phones"];

function buildRows(results, includeEnriched = false) {
  const list = Array.isArray(results) ? results : [];
  const hasEnriched = includeEnriched && list.some((r) => r.enriched_emails?.length || r.enriched_whatsapp?.length);
  return list.map((r, i) => {
    const base = [
      i + 1,
      r.name ?? "",
      r.category ?? "",
      r.rating ?? "",
      r.review_count ?? r.reviews ?? "",
      r.phone ?? "",
      r.address ?? "",
      r.website ?? "",
      r.hours ?? "",
      r.latitude ?? "",
      r.longitude ?? "",
      r.maps_url ?? r.mapUrl ?? "",
    ];
    if (hasEnriched) {
      base.push(
        (r.enriched_emails ?? []).join(", "),
        (r.enriched_whatsapp ?? []).map((w) => `https://wa.me/${w}`).join(", "),
        (r.enriched_linkedin ?? [])[0] ?? "",
        (r.enriched_facebook ?? [])[0] ?? "",
        (r.enriched_phones ?? []).join(", ")
      );
    }
    return base;
  });
}

export async function POST(request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const results = body.results ?? [];
    const format = (body.format || "xlsx").toLowerCase();

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        { error: "results array is required and must not be empty" },
        { status: 400 }
      );
    }

    const hasEnriched = results.some((r) => r.enriched_emails?.length || r.enriched_whatsapp?.length);
    const COLUMNS = hasEnriched ? [...BASE_COLUMNS, ...ENRICHED_COLUMNS] : BASE_COLUMNS;
    const rows = buildRows(results, true);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([COLUMNS, ...rows]);

    const colWidths = [
      { wch: 6 },
      { wch: 28 },
      { wch: 22 },
      { wch: 8 },
      { wch: 8 },
      { wch: 18 },
      { wch: 45 },
      { wch: 35 },
      { wch: 40 },
      { wch: 12 },
      { wch: 12 },
      { wch: 50 },
    ];
    if (hasEnriched) {
      colWidths.push({ wch: 32 }, { wch: 28 }, { wch: 45 }, { wch: 40 }, { wch: 25 });
    }
    ws["!cols"] = colWidths;
    XLSX.utils.book_append_sheet(wb, ws, "Leads");

    if (format === "csv") {
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
      const csv = XLSX.utils.sheet_to_csv(ws);
      const filename = `leads_export_${Date.now()}.csv`;
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    const filename = `leads_export_${Date.now()}.xlsx`;
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
    console.error("[POST /api/export]", err);
    return NextResponse.json(
      { error: err.message || "Export failed" },
      { status: 500 }
    );
  }
}
