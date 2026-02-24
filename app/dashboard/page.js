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

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_RESULTS = [
    { name: "Sharma & Associates", category: "Chartered Accountants", rating: 4.8, reviews: 124, phone: "+91-11-2334-5678", address: "B-12, Connaught Place, New Delhi, 110001", website: "https://sharmaassociates.in", mapUrl: "https://maps.google.com" },
    { name: "Delhi Tax Consultants", category: "Tax Consultants", rating: 4.5, reviews: 89, phone: "+91-11-2345-6789", address: "First Floor, L Block, Connaught Place, New Delhi", website: "https://delhitax.com", mapUrl: "https://maps.google.com" },
    { name: "Gupta Legal Services", category: "Legal Services", rating: 4.7, reviews: 201, phone: "+91-11-4567-8901", address: "42, Barakhamba Road, New Delhi, 110001", website: "https://guptalegal.in", mapUrl: "https://maps.google.com" },
    { name: "Verma Audit Firm", category: "Chartered Accountants", rating: 4.3, reviews: 56, phone: "+91-11-5678-9012", address: "Tolstoy Marg, Janpath Area, New Delhi", website: null, mapUrl: "https://maps.google.com" },
    { name: "Capital Finance Advisory", category: "Financial Advisors", rating: 4.9, reviews: 312, phone: "+91-98765-43210", address: "DLF Centre, Sansad Marg, New Delhi, 110001", website: "https://capitalfinance.co.in", mapUrl: "https://maps.google.com" },
    { name: "Singh & Partners CA", category: "Chartered Accountants", rating: 4.6, reviews: 67, phone: "+91-11-6789-0123", address: "A-23, Middle Circle, Connaught Place, Delhi", website: "https://singhpartners.co", mapUrl: "https://maps.google.com" },
    { name: "Agarwal Tax House", category: "Tax Consultants", rating: 4.2, reviews: 45, phone: "+91-11-7890-1234", address: "F-14, Rajiv Chowk Metro Station Area, CP", website: null, mapUrl: "https://maps.google.com" },
    { name: "National Audit Bureau", category: "Auditors", rating: 4.4, reviews: 178, phone: "+91-11-8901-2345", address: "Parliament Street, New Delhi, 110001", website: "https://nab.co.in", mapUrl: "https://maps.google.com" },
    { name: "PKR & Company", category: "Chartered Accountants", rating: 4.1, reviews: 34, phone: "+91-99876-54321", address: "Janpath Lane, Near Palika Bazaar, New Delhi", website: "https://pkrco.in", mapUrl: "https://maps.google.com" },
    { name: "Metro Business Solutions", category: "Business Consulting", rating: 4.7, reviews: 256, phone: "+91-11-9012-3456", address: "Kasturba Gandhi Marg, New Delhi, 110001", website: "https://metrobusiness.in", mapUrl: "https://maps.google.com" },
];

const PACKAGES = [
    { id: "starter", name: "Starter", credits: 50, price: 499, features: ["50 search credits", "Export to Excel & CSV", "Google Places + SerpAPI", "Email support"] },
    { id: "growth", name: "Growth", credits: 200, price: 1499, features: ["200 search credits", "Export to Excel & CSV", "Google Places + SerpAPI", "Priority support", "Cached results at 0 cost"] },
    { id: "pro", name: "Pro", credits: 500, price: 2999, features: ["500 search credits", "Export to Excel & CSV", "Google Places + SerpAPI", "Priority support", "Cached results at 0 cost", "Bulk export"] },
    { id: "enterprise", name: "Enterprise", credits: 2000, price: 9999, features: ["2,000 search credits", "Export to Excel & CSV", "All providers", "Dedicated support", "Cached results at 0 cost", "Bulk export", "API access"] },
];

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

    const [showModal, setShowModal] = useState(false);

    // ── Auth Check ───────────────────────────────────────────────────────────
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
                return;
            }
            setSession(session);
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

        // Simulate API call
        await new Promise((r) => setTimeout(r, 1500));

        const isCached = Math.random() > 0.7;
        setCached(isCached);
        setResults(MOCK_RESULTS);
        setTotalSearches((prev) => prev + 1);
        if (!isCached) setCredits((prev) => Math.max(0, prev - 1));

        // Add to recent searches
        setRecentSearches((prev) => {
            const updated = [{ business, locality, time: new Date().toLocaleTimeString() }, ...prev];
            return updated.slice(0, 5);
        });

        setSearchLoading(false);
    };

    // ── Export Handlers ──────────────────────────────────────────────────────
    const handleExport = (format) => {
        // Mock export — trigger dummy download
        const content = format === "csv"
            ? "Name,Category,Rating,Phone,Address\n" + results.map(r => `"${r.name}","${r.category}",${r.rating},"${r.phone}","${r.address}"`).join("\n")
            : "Mock Excel export data";

        const blob = new Blob([content], { type: format === "csv" ? "text/csv" : "application/vnd.ms-excel" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `leads_export.${format === "csv" ? "csv" : "xlsx"}`;
        a.click();
        URL.revokeObjectURL(url);
        setTotalExports((prev) => prev + 1);
    };

    // ── Razorpay Buy Handler ─────────────────────────────────────────────────
    const handleBuy = (pkg) => {
        if (typeof window === "undefined" || !window.Razorpay) {
            alert("Razorpay SDK not loaded. Please refresh and try again.");
            return;
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: pkg.price * 100,
            currency: "INR",
            name: "LeadFinder",
            description: `${pkg.credits} Search Credits — ${pkg.name} Pack`,
            handler: function (response) {
                // In production, verify payment server-side
                setCredits((prev) => prev + pkg.credits);
                setShowModal(false);
                alert(`Payment successful! ${pkg.credits} credits added.`);
            },
            prefill: {
                email: session?.user?.email || "",
            },
            theme: {
                color: "#22c55e",
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
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
                                            onClick={() => handleSearch({ business: s.business, locality: s.locality, provider: "google" })}
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
                            {PACKAGES.map((pkg) => (
                                <PackageCard
                                    key={pkg.id}
                                    pkg={pkg}
                                    popular={pkg.id === "growth"}
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
