"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase";
import CreditBadge from "@/components/CreditBadge";
import StatCard from "@/components/StatCard";
import SearchForm from "@/components/SearchForm";
import ResultsTable from "@/components/ResultsTable";
import PackageCard from "@/components/PackageCard";

function mapResultForTable(r) {
    return {
        name: r.name,
        category: r.category,
        rating: r.rating,
        reviews: r.review_count ?? r.reviews,
        phone: r.phone,
        address: r.address,
        website: r.website,
        mapUrl: r.maps_url ?? r.mapUrl,
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
            "Google Places + SerpAPI",
            "Cached results at 0 cost",
        ],
    };
}

// ── Dashboard Page ─────────────────────────────────────────────────────────
export default function DashboardPage() {
    const router = useRouter();
    const supabase = createBrowserSupabase();

    const [session, setSession] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [credits, setCredits] = useState(10);
    const [totalSearches, setTotalSearches] = useState(0);
    const [totalExports, setTotalExports] = useState(0);

    const [results, setResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [lastQuery, setLastQuery] = useState(null);
    const [cached, setCached] = useState(false);

    const [filterName, setFilterName] = useState("");
    const [filterMinRating, setFilterMinRating] = useState("");
    const [filterHasPhone, setFilterHasPhone] = useState(false);
    const [filterHasEmail, setFilterHasEmail] = useState(false);
    const [filterHasWebsite, setFilterHasWebsite] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [packages, setPackages] = useState([]);
    const [enriching, setEnriching] = useState(false);
    const [enrichmentStats, setEnrichmentStats] = useState(null);
    const [searchError, setSearchError] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const filteredResults = useMemo(() => {
        let list = results;
        if (filterName.trim()) {
            const q = filterName.trim().toLowerCase();
            list = list.filter((r) => (r.name ?? "").toLowerCase().includes(q));
        }
        if (filterMinRating) {
            const min = parseFloat(filterMinRating, 10);
            if (!Number.isNaN(min)) {
                list = list.filter((r) => r.rating != null && Number(r.rating) >= min);
            }
        }
        if (filterHasPhone) list = list.filter((r) => !!(r.phone ?? "").trim());
        if (filterHasEmail) list = list.filter((r) => (r.enriched_emails?.length ?? 0) > 0);
        if (filterHasWebsite) list = list.filter((r) => !!(r.website ?? "").trim());
        return list;
    }, [results, filterName, filterMinRating, filterHasPhone, filterHasEmail, filterHasWebsite]);

    const hasActiveFilters = !!(filterName.trim() || filterMinRating || filterHasPhone || filterHasEmail || filterHasWebsite);

    const resetFilters = () => {
        setFilterName("");
        setFilterMinRating("");
        setFilterHasPhone(false);
        setFilterHasEmail(false);
        setFilterHasWebsite(false);
    };

    const fetchCredits = async (token) => {
        if (!token) return;
        try {
            const res = await fetch("/api/credits", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setCredits(data.credits ?? 0);
                setTotalSearches(data.total_searches ?? 0);
                setTotalExports(data.total_exported ?? 0);
                setPackages(data.packages ?? []);
                setRecentSearches((data.recent_searches ?? []).map((s) => ({
                    business: s.query,
                    locality: s.location ?? "",
                    provider: s.provider === "serpapi" ? "serpapi" : "google",
                    time: s.created_at ? new Date(s.created_at).toLocaleString() : "",
                })));
            }
        } catch (e) {
            console.error("Failed to fetch credits", e);
        }
    };

    // ── Auth Check ───────────────────────────────────────────────────────────
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
    }, []);

    // ── Search Handler ───────────────────────────────────────────────────────
    const handleSearch = async ({ business, locality, provider, deep = false }) => {
        setSearchLoading(true);
        setSearchError(null);
        setResults([]);
        setCached(false);
        setLastQuery({ business, locality, provider, deep });
        setFilterName("");
        setFilterMinRating("");
        setFilterHasPhone(false);
        setFilterHasEmail(false);
        setFilterHasWebsite(false);

        try {
            const res = await fetch("/api/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({
                    query: business,
                    location: locality,
                    provider: provider === "serpapi" ? "serpapi" : "google_places",
                    deep: !!deep,
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.status === 402) {
                setSearchError(data.error || "Insufficient credits");
                setSearchLoading(false);
                return;
            }
            if (!res.ok) {
                setSearchError(data.error || "Search failed");
                setSearchLoading(false);
                return;
            }
            setResults((data.results ?? []).map(mapResultForTable));
            setCached(data.cached ?? false);
            setCredits(data.credits_remaining ?? credits);
            setTotalSearches((prev) => prev + (data.cached ? 0 : 1));
            setEnrichmentStats(null);
            setLastQuery((prev) => prev ? { ...prev, creditsUsed: data.credits_used ?? 1 } : null);
            await fetchCredits(session?.access_token);
        } catch (e) {
            console.error(e);
            setSearchError("Search failed. Please try again.");
        } finally {
            setSearchLoading(false);
        }
    };

    const handleEnrich = async () => {
        if (!results.length || enriching) return;
        setEnriching(true);
        setEnrichmentStats(null);
        try {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            const res = await fetch("/api/enrich", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentSession?.access_token}`,
                },
                body: JSON.stringify({ results }),
            });
            const data = await res.json();
            if (res.ok) {
                setResults(data.enriched ?? results);
                setEnrichmentStats(data.stats ?? null);
            } else {
                alert(data.error || "Enrichment failed");
            }
        } catch (err) {
            console.error("Enrichment failed:", err);
            alert("Enrichment failed. Please try again.");
        } finally {
            setEnriching(false);
        }
    };

    // ── Export Handlers ──────────────────────────────────────────────────────
    const handleExport = async (format) => {
        if (results.length === 0) return;
        try {
            const res = await fetch("/api/export", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({
                    results: filteredResults,
                    format: format === "csv" ? "csv" : "xlsx",
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
            a.download = `leads_export_${Date.now()}.${format === "csv" ? "csv" : "xlsx"}`;
            a.click();
            URL.revokeObjectURL(url);
            setTotalExports((prev) => prev + filteredResults.length);
            await fetchCredits(session?.access_token);
        } catch (e) {
            console.error(e);
            alert("Export failed. Please try again.");
        }
    };

    // ── Razorpay Buy Handler ─────────────────────────────────────────────────
    const handleBuy = async (pkg) => {
        if (typeof window === "undefined" || !window.Razorpay) {
            alert("Razorpay SDK not loaded. Please refresh and try again.");
            return;
        }
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
            alert("Razorpay is not configured.");
            return;
        }
        try {
            const orderRes = await fetch("/api/razorpay/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({ package_id: pkg.id }),
            });
            if (!orderRes.ok) {
                const err = await orderRes.json().catch(() => ({}));
                alert(err.error || "Failed to create order");
                return;
            }
            const { order_id, amount, currency, package: pkgInfo } = await orderRes.json();
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount,
                currency: currency || "INR",
                order_id,
                name: "LeadFinder",
                description: `${pkg.credits} Search Credits — ${pkg.name} Pack`,
                handler: async function (response) {
                    try {
                        const verifyRes = await fetch("/api/razorpay/verify", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${session?.access_token}`,
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                package_id: pkg.id,
                            }),
                        });
                        if (!verifyRes.ok) {
                            const err = await verifyRes.json().catch(() => ({}));
                            alert(err.error || "Payment verification failed");
                            return;
                        }
                        const data = await verifyRes.json();
                        setCredits(data.new_balance ?? credits + pkg.credits);
                        setShowModal(false);
                        await fetchCredits(session?.access_token);
                        alert(`Payment successful! ${data.credits_added} credits added.`);
                    } catch (e) {
                        console.error(e);
                        alert("Verification failed. Please contact support if credits were charged.");
                    }
                },
                prefill: {
                    email: session?.user?.email || "",
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

    // ── Logout ───────────────────────────────────────────────────────────────
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    // ── Loading guard ────────────────────────────────────────────────────────
    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white dashboard-dark">
            {/* ── Header ────────────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-40 bg-[#020617]/95 border-b border-white/10 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center">
                                <span className="text-white font-display font-bold text-sm">LF</span>
                            </div>
                            <span className="font-display font-bold text-lg text-white">LeadFinder</span>
                        </Link>
                        <nav className="flex items-center gap-1">
                            <Link href="/dashboard" className="bg-white/10 text-white text-sm font-medium px-3 py-1.5 rounded-lg">
                                Search
                            </Link>
                            <Link href="/dashboard/bulk" className="text-slate-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
                                Bulk Search
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
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-white transition-colors"
                            title="Log out"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Main Content ─────────────────────────────────────────────────── */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <StatCard label="Credits Left" value={credits} color="text-[#22c55e]" variant="dark" />
                    <StatCard label="Total Searches" value={totalSearches} color="text-blue-400" variant="dark" />
                    <StatCard label="Results Exported" value={totalExports} color="text-purple-400" variant="dark" />
                </div>

                {/* Search Form */}
                <div className="mb-6">
                    <SearchForm onSearch={handleSearch} loading={searchLoading} variant="dark" />
                </div>

                {/* Search Error Banner */}
                {searchError && (
                    <div className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-red-500/30 bg-red-900/20 px-4 py-3 text-sm text-red-300 animate-fade-in">
                        <span>{searchError}</span>
                        <button
                            type="button"
                            onClick={() => setSearchError(null)}
                            className="shrink-0 rounded p-1 text-red-400 hover:text-red-200 hover:bg-red-500/20 transition-colors"
                            aria-label="Dismiss"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {searchLoading && (
                    <div className="text-center py-16 animate-fade-in">
                        <div className="w-10 h-10 border-4 border-[#22c55e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-slate-400 font-medium">Searching Google Maps...</p>
                    </div>
                )}

                {/* Results Meta Bar + Table */}
                {!searchLoading && results.length > 0 && (
                    <>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 animate-fade-in">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-sm font-medium text-slate-300">
                                    {hasActiveFilters ? `Showing ${filteredResults.length} of ${results.length} results` : `${results.length} results found`}
                                </span>
                                {cached ? (
                                    <span className="bg-blue-500/10 text-blue-400 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-500/20">
                                        Cached — 0 credits used
                                    </span>
                                ) : (
                                    <span className="text-xs text-slate-500">
                                        {lastQuery?.creditsUsed ?? 1} credit{(lastQuery?.creditsUsed ?? 1) !== 1 ? "s" : ""} used · via {lastQuery?.provider === "google" ? "Google Places" : "SerpAPI"}
                                    </span>
                                )}
                                {enrichmentStats && (
                                    <span className="bg-[#22c55e]/10 text-[#22c55e] text-xs font-medium px-2.5 py-1 rounded-full border border-[#22c55e]/20">
                                        ✅ Enriched — {enrichmentStats.emails_found} emails, {enrichmentStats.phones_found} phones{enrichmentStats.whatsapp_found ? `, ${enrichmentStats.whatsapp_found} WhatsApp` : ""} from {enrichmentStats.with_websites} websites
                                    </span>
                                )}
                                {enriching && (
                                    <span className="text-slate-400 text-xs flex items-center gap-1.5">
                                        <span className="w-3.5 h-3.5 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
                                        Enriching websites…
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleEnrich}
                                    disabled={enriching || !results.length || !!enrichmentStats}
                                    className={`bg-[#6B2D3C] border-2 border-[#5a2530] text-white hover:bg-[#7d3542] hover:border-[#8a3d4a] disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${!enriching && !enrichmentStats && results.length ? "animate-pulse" : ""}`}
                                >
                                    {enrichmentStats ? "✅ Enriched" : enriching ? "Enriching…" : "🔍 Enrich Emails"}
                                </button>
                                <button
                                    onClick={() => handleExport("excel")}
                                    disabled={filteredResults.length === 0}
                                    className="bg-[#22c55e] hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                                >
                                    📥 Export Excel
                                </button>
                                <button
                                    onClick={() => handleExport("csv")}
                                    disabled={filteredResults.length === 0}
                                    className="border border-white/10 hover:border-white/20 disabled:opacity-50 text-slate-300 text-xs font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                                >
                                    📥 CSV
                                </button>
                            </div>
                        </div>

                        {/* Filter bar */}
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-4 flex flex-wrap items-center gap-3">
                            <input
                                type="text"
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                                placeholder="Search by name..."
                                className="px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22c55e] w-48"
                            />
                            <select
                                value={filterMinRating}
                                onChange={(e) => setFilterMinRating(e.target.value)}
                                className="px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                            >
                                <option value="">Min rating: Any</option>
                                <option value="3">3+</option>
                                <option value="3.5">3.5+</option>
                                <option value="4">4+</option>
                                <option value="4.5">4.5+</option>
                            </select>
                            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filterHasPhone}
                                    onChange={(e) => setFilterHasPhone(e.target.checked)}
                                    className="rounded border-white/20 text-[#22c55e] focus:ring-[#22c55e]"
                                />
                                Has Phone
                            </label>
                            {enrichmentStats && (
                                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filterHasEmail}
                                        onChange={(e) => setFilterHasEmail(e.target.checked)}
                                        className="rounded border-white/20 text-[#22c55e] focus:ring-[#22c55e]"
                                    />
                                    Has Email
                                </label>
                            )}
                            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filterHasWebsite}
                                    onChange={(e) => setFilterHasWebsite(e.target.checked)}
                                    className="rounded border-white/20 text-[#22c55e] focus:ring-[#22c55e]"
                                />
                                Has Website
                            </label>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="text-xs font-medium text-slate-400 hover:text-white px-2 py-1 rounded border border-white/10 hover:border-white/20"
                                >
                                    Reset Filters
                                </button>
                            )}
                        </div>

                        <ResultsTable results={filteredResults} showEnrichedColumns={!!enrichmentStats} variant="dark" />
                    </>
                )}

                {/* Empty State */}
                {!searchLoading && results.length === 0 && (
                    <div className="text-center py-16 animate-fade-in-up">
                        <div className="text-5xl mb-4">🔍</div>
                        <h3 className="font-display font-bold text-xl text-white mb-2">
                            Search for businesses
                        </h3>
                        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                            Enter a business type and locality above to find leads from Google Maps.
                            Results include phone numbers, addresses, websites, and ratings.
                        </p>
                        <Link
                            href="/dashboard/bulk"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#22c55e]/30 text-slate-300 hover:text-white text-sm font-medium px-5 py-2.5 mb-8 transition-colors"
                        >
                            📤 Bulk Search — upload CSV
                        </Link>

                        {recentSearches.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                    Recent Searches
                                </h4>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {recentSearches.map((s, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSearch({ business: s.business, locality: s.locality, provider: s.provider || "google" })}
                                            className="bg-white/5 border border-white/10 hover:border-[#22c55e]/50 text-slate-300 hover:text-[#22c55e] text-xs font-medium px-4 py-2 rounded-lg transition-all"
                                        >
                                            {s.business}{s.locality ? ` in ${s.locality}` : ""} · {s.time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* ── Buy Credits Modal ────────────────────────────────────────────── */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
                        onClick={() => setShowModal(false)}
                    />

                    <div className="relative bg-[#020617] border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-7 animate-fade-in-up">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="font-display font-bold text-xl text-white">
                                    Buy Search Credits
                                </h2>
                                <p className="text-sm text-slate-400 mt-1">
                                    1 credit = 1 search = up to 20 results
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-400 hover:text-white transition-colors p-1"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            {(packages.length ? packages.map(packageForCard) : []).map((pkg) => (
                                <PackageCard
                                    key={pkg.id}
                                    pkg={pkg}
                                    popular={pkg.name === "Growth"}
                                    onBuy={handleBuy}
                                    variant="dark"
                                />
                            ))}
                        </div>

                        <p className="text-center text-xs text-slate-500">
                            Secure payments via Razorpay. Credits never expire.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
