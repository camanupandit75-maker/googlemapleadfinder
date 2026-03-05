"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { createBrowserSupabase } from "@/lib/supabase";
import CreditBadge from "@/components/CreditBadge";
import ResultsTable from "@/components/ResultsTable";
import PackageCard from "@/components/PackageCard";

const QUERY_KEYS = ["business_type", "type", "business", "query", "search"];
const LOCATION_KEYS = ["location", "locality", "area", "pin_code", "pincode", "city"];

function normalizeRows(rawRows) {
  if (!Array.isArray(rawRows) || rawRows.length === 0) return [];
  const first = rawRows[0];
  const keys = typeof first === "object" && first !== null ? Object.keys(first) : [];
  const queryKey = keys.find((k) => QUERY_KEYS.includes(k.toLowerCase().trim()));
  const locationKey = keys.find((k) => LOCATION_KEYS.includes(k.toLowerCase().trim()));
  const q = queryKey || keys[0] || "business_type";
  const l = locationKey || keys[1] || "location";
  return rawRows.map((row) => ({
    business_type: (row[q] ?? row[q.toLowerCase?.()] ?? "").toString().trim(),
    location: (row[l] ?? row[l.toLowerCase?.()] ?? "").toString().trim(),
  })).filter((r) => r.business_type);
}

function mapResult(r, sourceQuery, sourceLocation) {
  return {
    ...r,
    name: r.name,
    category: r.category,
    rating: r.rating,
    reviews: r.review_count ?? r.reviews,
    phone: r.phone,
    address: r.address,
    website: r.website,
    mapUrl: r.maps_url ?? r.mapUrl,
    source_query: sourceQuery,
    source_location: sourceLocation,
  };
}

function packageForCard(pkg) {
  const price = pkg.price_inr != null ? pkg.price_inr / 100 : (pkg.price ?? 0);
  return {
    id: pkg.id,
    name: pkg.name,
    credits: pkg.credits,
    price,
    price_inr: pkg.price_inr,
    features: [
      `${pkg.credits} search credits`,
      "Export to Excel & CSV",
      "Maximum Coverage — always up-to-date",
      "Cached results at 0 cost",
    ],
  };
}

export default function BulkSearchPage() {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [credits, setCredits] = useState(0);
  const [packages, setPackages] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [parseError, setParseError] = useState(null);

  const [processing, setProcessing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [pauseReason, setPauseReason] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuery, setCurrentQuery] = useState("");
  const [rowStatus, setRowStatus] = useState({});
  const [failedRows, setFailedRows] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [cachedCount, setCachedCount] = useState(0);
  const [searchesDone, setSearchesDone] = useState([]);

  const [enriching, setEnriching] = useState(false);
  const [enrichmentStats, setEnrichmentStats] = useState(null);

  const fetchCredits = useCallback(async (token) => {
    if (!token) return;
    try {
      const res = await fetch("/api/credits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCredits(data.credits ?? 0);
        setPackages(data.packages ?? []);
      }
    } catch (e) {
      console.error("Failed to fetch credits", e);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setSession(session);
      await fetchCredits(session.access_token);
      setAuthLoading(false);
    };
    checkAuth();
  }, [router, supabase.auth, fetchCredits]);

  const parseFile = (file) => {
    setParseError(null);
    const name = file.name || "";
    const ext = name.split(".").pop()?.toLowerCase();

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (parsed) => {
          const normalized = normalizeRows(parsed.data || []);
          setRows(normalized);
          setFileName(name);
          if (normalized.length === 0) setParseError("No valid rows found. Use columns: business_type (or type/business/query), location (or locality/area/pin_code).");
        },
        error: (err) => setParseError(err.message || "Failed to parse CSV"),
      });
      return;
    }

    if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const wb = XLSX.read(data, { type: "array" });
          const firstSheet = wb.Sheets[wb.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
          const normalized = normalizeRows(json);
          setRows(normalized);
          setFileName(name);
          if (normalized.length === 0) setParseError("No valid rows found. Use columns: business_type (or type/business/query), location (or locality/area/pin_code).");
        } catch (err) {
          setParseError(err.message || "Failed to parse Excel");
        }
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    setParseError("Please upload a .csv or .xlsx file.");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) parseFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleFileInput = (e) => {
    const file = e.target?.files?.[0];
    if (file) parseFile(file);
    e.target.value = "";
  };

  const removeFile = () => {
    setRows([]);
    setFileName("");
    setParseError(null);
    setAllResults([]);
    setRowStatus({});
    setFailedRows([]);
    setCurrentIndex(0);
    setCreditsUsed(0);
    setCachedCount(0);
    setSearchesDone([]);
    setPaused(false);
    setPauseReason(null);
    setEnrichmentStats(null);
  };

  const processBulkSearch = useCallback(async (startFrom = 0) => {
    if (!session?.access_token || rows.length === 0) return;
    setProcessing(true);
    setPaused(false);
    setPauseReason(null);

    let totalCreditsUsed = startFrom === 0 ? 0 : creditsUsed;
    let totalCached = startFrom === 0 ? 0 : cachedCount;
    let combined = startFrom === 0 ? [] : [...allResults];
    const done = startFrom === 0 ? [] : [...searchesDone];

    for (let i = startFrom; i < rows.length; i++) {
      const row = rows[i];
      setCurrentIndex(i);
      setCurrentQuery(`${row.business_type}${row.location ? ` in ${row.location}` : ""}`);
      setRowStatus((prev) => ({ ...prev, [i]: "processing" }));

      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            query: row.business_type,
            location: row.location,
            provider: "google_places",
          }),
        });

        if (res.status === 402) {
          const data = await res.json().catch(() => ({}));
          setCredits(data.credits ?? credits);
          await fetchCredits(session.access_token);
          setPaused(true);
          setPauseReason("insufficient_credits");
          setRowStatus((prev) => ({ ...prev, [i]: "queued" }));
          setProcessing(false);
          return;
        }

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setFailedRows((prev) => [...prev, i]);
          setRowStatus((prev) => ({ ...prev, [i]: "failed" }));
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }

        const tagged = (data.results || []).map((r) => mapResult(r, row.business_type, row.location));
        combined = combined.concat(tagged);
        totalCreditsUsed += data.cached ? 0 : (data.credits_used ?? 1);
        if (data.cached) totalCached += 1;
        done.push({ query: row.business_type, location: row.location, result_count: (data.results || []).length, cached: data.cached });

        setAllResults(combined);
        setCreditsUsed(totalCreditsUsed);
        setCachedCount(totalCached);
        setSearchesDone(done);
        setRowStatus((prev) => ({ ...prev, [i]: "done" }));
        setCredits(data.credits_remaining ?? credits);
        fetch("/api/log-search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            search_type: "bulk",
            business_type: row.business_type,
            location: row.location ?? "",
            provider: "google_places",
            results_count: (data.results || []).length,
            credits_used: data.cached ? 0 : (data.credits_used ?? 1),
          }),
        }).catch(() => {});

        await new Promise((r) => setTimeout(r, 1000));
      } catch (err) {
        console.error(err);
        setFailedRows((prev) => [...prev, i]);
        setRowStatus((prev) => ({ ...prev, [i]: "failed" }));
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    setProcessing(false);
    setCurrentQuery("");
  }, [session?.access_token, rows, creditsUsed, cachedCount, allResults, searchesDone, credits, fetchCredits]);

  const handleEnrich = async () => {
    if (!allResults.length || enriching) return;
    setEnriching(true);
    setEnrichmentStats(null);
    try {
      const { data: { session: s } } = await supabase.auth.getSession();
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${s?.access_token}`,
        },
        body: JSON.stringify({ results: allResults }),
      });
      const data = await res.json();
      if (res.ok) {
        setAllResults(data.enriched ?? allResults);
        setEnrichmentStats(data.stats ?? null);
      } else {
        alert(data.error || "Enrichment failed");
      }
    } catch (err) {
      console.error(err);
      alert("Enrichment failed. Please try again.");
    } finally {
      setEnriching(false);
    }
  };

  const handleBulkExport = async () => {
    if (allResults.length === 0) return;
    try {
      const { data: { session: s } } = await supabase.auth.getSession();
      const res = await fetch("/api/bulk-export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${s?.access_token}`,
        },
        body: JSON.stringify({
          results: allResults,
          searches: searchesDone,
          stats: {
            total_searches: rows.length,
            total_results: allResults.length,
            credits_used: creditsUsed,
            cached_count: cachedCount,
            emails_found: enrichmentStats?.emails_found ?? allResults.reduce((s, r) => s + (r.enriched_emails?.length ?? 0), 0),
          },
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Export failed");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bulk_leads_export_${Date.now()}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      await fetchCredits(session?.access_token);
    } catch (e) {
      console.error(e);
      alert("Export failed. Please try again.");
    }
  };

  const handleBuy = async (pkg) => {
    if (typeof window === "undefined" || !window.Razorpay) {
      alert("Razorpay SDK not loaded. Please refresh and try again.");
      return;
    }
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      alert("Razorpay is not configured.");
      return;
    }
    const amountRupees = pkg.price != null ? pkg.price : (pkg.price_inr != null ? pkg.price_inr / 100 : 0);
    try {
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          amount: amountRupees,
          plan_name: pkg.name,
          credits: pkg.credits,
        }),
      });
      if (!orderRes.ok) {
        const err = await orderRes.json().catch(() => ({}));
        alert(err.error || "Failed to create order");
        return;
      }
      const { order_id, amount, currency } = await orderRes.json();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: currency || "INR",
        order_id,
        name: "Geonayan",
        description: `${pkg.credits} Credits — ${pkg.name}`,
        handler: async function (response) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.access_token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const data = await verifyRes.json().catch(() => ({}));
            if (!verifyRes.ok || !data.success) {
              alert(data.error || "Payment verification failed");
              return;
            }
            setCredits(data.new_balance ?? credits + pkg.credits);
            setShowModal(false);
            await fetchCredits(session?.access_token);
            alert(`🎉 ${data.credits_added} credits added!`);
            if (pauseReason === "insufficient_credits") {
              setPauseReason(null);
              processBulkSearch(currentIndex);
            }
          } catch (e) {
            console.error(e);
            alert("Verification failed. Please contact support if credits were charged.");
          }
        },
        prefill: {
          email: session?.user?.email || "",
          name: session?.user?.user_metadata?.full_name || "",
        },
        theme: { color: "#22c55e" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      console.error(e);
      alert("Failed to start payment. Please try again.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasResults = allResults.length > 0;

  return (
    <div className="min-h-screen bg-[#020617] text-white dashboard-dark">
      <header className="sticky top-0 z-40 bg-[#020617]/95 border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">GN</span>
              </div>
              <span className="font-display font-bold text-lg text-white">Geonayan</span>
            </Link>
            <nav className="flex items-center gap-1">
              <Link
                href="/dashboard"
                className="text-slate-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                Search
              </Link>
              <Link
                href="/dashboard/bulk"
                className="bg-white/10 text-white text-sm font-medium px-3 py-1.5 rounded-lg"
              >
                Bulk Search
              </Link>
              <Link
                href="/dashboard/map"
                className="text-slate-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                Market Map
              </Link>
              <Link
                href="/dashboard/profile"
                className="text-slate-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                Profile
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <CreditBadge credits={credits} variant="dark" />
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#22c55e] hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors duration-150"
            >
              Buy Credits
            </button>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white transition-colors" title="Log out">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="font-display font-bold text-2xl text-white mb-2">Bulk Search</h1>
        <p className="text-slate-400 text-sm mb-8">
          Upload a CSV or Excel file with business type and location. We’ll run each search, then you can enrich and export all results in one Excel file.
        </p>

        {/* Step 1 — Upload */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Step 1 — Upload</h2>

          {rows.length === 0 ? (
            <>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${dragActive ? "border-[#22c55e]/50 bg-[#22c55e]/5" : "border-white/10 hover:border-white/20"}`}
              >
                <p className="text-slate-400 mb-4">Drag and drop your file here, or click to browse</p>
                <p className="text-xs text-slate-500 mb-4">Accepts .csv and .xlsx</p>
                <label className="inline-block bg-white/10 hover:bg-white/15 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer transition-colors">
                  <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileInput} />
                  Choose file
                </label>
              </div>
              <div className="mt-4 p-4 glass-card">
                <p className="text-xs font-semibold text-slate-400 mb-2">Sample format:</p>
                <pre className="text-xs text-slate-500 font-mono whitespace-pre-wrap">
{`business_type,location
Chartered Accountants,Connaught Place Delhi
Tax Consultants,Dwarka New Delhi
Law Firms,110001
Chartered Accountants,Business Bay Dubai`}
                </pre>
                <a
                  href="/sample-bulk-template.csv"
                  download="sample-bulk-template.csv"
                  className="inline-block mt-2 text-[#22c55e] hover:text-brand-400 text-xs font-medium"
                >
                  Download Sample CSV
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-white">{fileName}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {rows.length} row{rows.length !== 1 ? "s" : ""} · This will use up to {rows.length} credits (cached searches are free).
                  </p>
                  <p className="text-slate-400 text-sm mt-2">
                    Your balance: <span className="text-[#22c55e] font-semibold">{credits} credits</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-red-400 hover:text-red-300 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
              {parseError && (
                <div className="mb-4 rounded-lg border border-red-500/30 bg-red-900/20 px-4 py-3 text-sm text-red-300">
                  {parseError}
                </div>
              )}
              <div className="overflow-x-auto rounded-lg border border-white/10 max-h-48 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">#</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">business_type</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 20).map((r, i) => (
                      <tr key={i} className="border-b border-white/10">
                        <td className="px-4 py-2 text-slate-400">{i + 1}</td>
                        <td className="px-4 py-2 text-white">{r.business_type}</td>
                        <td className="px-4 py-2 text-slate-300">{r.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {rows.length > 20 && (
                <p className="text-xs text-slate-500 mt-2">Showing first 20 of {rows.length} rows.</p>
              )}
            </>
          )}
        </div>

        {/* Step 2 — Processing */}
        {rows.length > 0 && (
          <div className="glass-card p-6 mb-8">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Step 2 — Processing</h2>

            {pauseReason === "insufficient_credits" && (
              <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-900/20 px-4 py-3 text-sm text-amber-200 flex items-center justify-between gap-4">
                <span>Insufficient credits — {rows.length - currentIndex} searches remaining. Buy credits to continue.</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-[#22c55e] hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                  >
                    Buy Credits
                  </button>
                  <button
                    onClick={() => processBulkSearch(currentIndex)}
                    className="border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-white/10"
                  >
                    Resume
                  </button>
                </div>
              </div>
            )}

            {!processing && !paused && allResults.length === 0 && (
              <button
                onClick={() => processBulkSearch(0)}
                disabled={credits < 1 && rows.length > 0}
                className="bg-[#22c55e] hover:bg-brand-600 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Start Bulk Search
              </button>
            )}

            {(processing || paused || hasResults) && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="h-2 flex-1 min-w-[200px] bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#22c55e] transition-all duration-300"
                      style={{ width: `${rows.length ? (Object.values(rowStatus).filter((s) => s === "done" || s === "failed").length / rows.length) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-400">
                    {processing ? "Processing" : "Completed"} {Object.values(rowStatus).filter((s) => s === "done" || s === "failed").length}/{rows.length} searches
                    {processing && "..."}
                  </span>
                </div>
                {currentQuery && processing && (
                  <p className="text-sm text-slate-300">Current: {currentQuery}</p>
                )}
                <p className="text-sm text-slate-400">
                  <span className="text-[#22c55e] font-semibold">{allResults.length}</span> results found so far
                  {cachedCount > 0 && (
                    <span className="ml-2 text-blue-400">· {cachedCount} cached (0 credits)</span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {rows.map((row, i) => {
                    const status = rowStatus[i] || "queued";
                    return (
                      <span
                        key={i}
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${
                          status === "done"
                            ? "bg-[#22c55e]/10 border-[#22c55e]/30 text-[#22c55e]"
                            : status === "processing"
                            ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                            : status === "failed"
                            ? "bg-red-500/10 border-red-500/30 text-red-400"
                            : "bg-white/5 border-white/10 text-slate-500"
                        }`}
                      >
                        {status === "done" && "✅"}
                        {status === "processing" && "⏳"}
                        {status === "queued" && "⏸"}
                        {status === "failed" && "❌"}
                        {row.business_type}{row.location ? ` · ${row.location}` : ""}
                        {status === "done" && allResults.filter((r) => r.source_query === row.business_type && r.source_location === row.location).length > 0 && (
                          <span className="opacity-80">({allResults.filter((r) => r.source_query === row.business_type && r.source_location === row.location).length})</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3 — Results */}
        {hasResults && (
          <div className="glass-card p-6 mb-8">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Step 3 — Results</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="glass-card p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Total Searches</p>
                <p className="text-2xl font-bold text-white">{rows.length}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Total Results</p>
                <p className="text-2xl font-bold text-[#22c55e]">{allResults.length}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Credits used</p>
                <p className="text-2xl font-bold text-blue-400">{creditsUsed} {cachedCount > 0 && `(${cachedCount} cached)`}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Emails found</p>
                <p className="text-2xl font-bold text-purple-400">{enrichmentStats?.emails_found ?? allResults.reduce((s, r) => s + (r.enriched_emails?.length ?? 0), 0)}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={handleEnrich}
                disabled={enriching || !!enrichmentStats}
                className="bg-[#6B2D3C] border-2 border-[#5a2530] text-white hover:bg-[#7d3542] disabled:opacity-50 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5"
              >
                {enrichmentStats ? "✅ Enriched" : enriching ? "Enriching…" : "🔍 Enrich All Emails"}
              </button>
              <button
                onClick={handleBulkExport}
                className="bg-[#22c55e] hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5"
              >
                📥 Export All to Excel
              </button>
            </div>
            <ResultsTable
              results={allResults}
              showEnrichedColumns={!!enrichmentStats}
              showSourceQuery
              variant="dark"
            />
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative glass-card bg-[#020617]/95 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-7">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-xl text-white">Buy Search Credits</h2>
                <p className="text-sm text-slate-400 mt-1">1 credit = 1 search = up to 20 results</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 mb-6">
              {(packages || []).map((p) => (
                <PackageCard
                  key={p.id}
                  pkg={packageForCard(p)}
                  popular={p.name === "Growth"}
                  onBuy={handleBuy}
                  variant="dark"
                />
              ))}
            </div>
            <p className="text-center text-xs text-slate-500">Secure payments via Razorpay. Credits never expire.</p>
          </div>
        </div>
      )}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </div>
  );
}
