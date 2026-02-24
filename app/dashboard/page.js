"use client";

import { useState, useEffect } from "react";
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
    const [recentSearches, setRecentSearches] = useState([]);
    const [packages, setPackages] = useState([]);

    const [showModal, setShowModal] = useState(false);

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
    const handleSearch = async ({ business, locality, provider }) => {
        setSearchLoading(true);
        setResults([]);
        setCached(false);
        setLastQuery({ business, locality, provider });

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
                }),
            });
            if (res.status === 402) {
                const data = await res.json().catch(() => ({}));
                alert(data.error || "Insufficient credits");
                setSearchLoading(false);
                return;
            }
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                alert(err.error || "Search failed");
                setSearchLoading(false);
                return;
            }
            const data = await res.json();
            setResults((data.results ?? []).map(mapResultForTable));
            setCached(data.cached ?? false);
            setCredits(data.credits_remaining ?? credits);
            setTotalSearches((prev) => prev + (data.cached ? 0 : 1));
            await fetchCredits(session?.access_token);
        } catch (e) {
            console.error(e);
            alert("Search failed. Please try again.");
        } finally {
            setSearchLoading(false);
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
                    results,
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
            setTotalExports((prev) => prev + results.length);
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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ── Header ────────────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-display font-bold text-sm">LF</span>
                        </div>
                        <span className="font-display font-bold text-lg text-slate-900">LeadFinder</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <CreditBadge credits={credits} />
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors duration-150"
                        >
                            Buy Credits
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
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
                    <StatCard label="Credits Left" value={credits} color="text-brand-500" />
                    <StatCard label="Total Searches" value={totalSearches} color="text-blue-500" />
                    <StatCard label="Results Exported" value={totalExports} color="text-purple-500" />
                </div>

                {/* Search Form */}
                <div className="mb-6">
                    <SearchForm onSearch={handleSearch} loading={searchLoading} />
                </div>

                {/* Loading State */}
                {searchLoading && (
                    <div className="text-center py-16 animate-fade-in">
                        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">Searching Google Maps...</p>
                    </div>
                )}

                {/* Results Meta Bar + Table */}
                {!searchLoading && results.length > 0 && (
                    <>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 animate-fade-in">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-slate-700">
                                    {results.length} results found
                                </span>
                                {cached ? (
                                    <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">
                                        Cached — 0 credits used
                                    </span>
                                ) : (
                                    <span className="text-xs text-slate-400">
                                        1 credit used · via {lastQuery?.provider === "google" ? "Google Places" : "SerpAPI"}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleExport("excel")}
                                    className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                                >
                                    📥 Export Excel
                                </button>
                                <button
                                    onClick={() => handleExport("csv")}
                                    className="border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                                >
                                    📥 CSV
                                </button>
                            </div>
                        </div>
                        <ResultsTable results={results} />
                    </>
                )}

                {/* Empty State */}
                {!searchLoading && results.length === 0 && (
                    <div className="text-center py-16 animate-fade-in-up">
                        <div className="text-5xl mb-4">🔍</div>
                        <h3 className="font-display font-bold text-xl text-slate-800 mb-2">
                            Search for businesses
                        </h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
                            Enter a business type and locality above to find leads from Google Maps.
                            Results include phone numbers, addresses, websites, and ratings.
                        </p>

                        {/* Recent Searches */}
                        {recentSearches.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                    Recent Searches
                                </h4>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {recentSearches.map((s, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSearch({ business: s.business, locality: s.locality, provider: s.provider || "google" })}
                                            className="bg-white border border-slate-200 hover:border-brand-300 text-slate-600 hover:text-brand-600 text-xs font-medium px-4 py-2 rounded-lg transition-all"
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
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
                        onClick={() => setShowModal(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-7 animate-fade-in-up">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="font-display font-bold text-xl text-slate-900">
                                    Buy Search Credits
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    1 credit = 1 search = up to 20 results
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Package Cards */}
                        <div className="space-y-4 mb-6">
                            {(packages.length ? packages.map(packageForCard) : []).map((pkg) => (
                                <PackageCard
                                    key={pkg.id}
                                    pkg={pkg}
                                    popular={pkg.name === "Growth"}
                                    onBuy={handleBuy}
                                />
                            ))}
                        </div>

                        {/* Footer */}
                        <p className="text-center text-xs text-slate-400">
                            Secure payments via Razorpay. Credits never expire.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
