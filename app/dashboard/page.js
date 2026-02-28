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
    const [filterIsHiring, setFilterIsHiring] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [packages, setPackages] = useState([]);
    const [enriching, setEnriching] = useState(false);
    const [enrichmentStats, setEnrichmentStats] = useState(null);
    const [careerScanning, setCareerScanning] = useState(false);
    const [careerScanStats, setCareerScanStats] = useState(null);
    const [careerScanDialog, setCareerScanDialog] = useState(false);
    const [careerScanProgress, setCareerScanProgress] = useState({ current: 0, total: 0 });
    const [enrichProgress, setEnrichProgress] = useState({ current: 0, total: 0 });
    const [searchError, setSearchError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileForm, setProfileForm] = useState({
        full_name: "",
        account_type: "individual",
        org_name: "",
        designation: "",
        phone: "",
        city: "",
        pan_number: "",
        gst_number: "",
        nationality: "Indian",
        company_domicile: "India",
        purpose: "",
    });
    const [profileSaveError, setProfileSaveError] = useState(null);
    const [profileSaving, setProfileSaving] = useState(false);

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
        if (filterIsHiring) list = list.filter((r) => r.is_hiring === true);
        return list;
    }, [results, filterName, filterMinRating, filterHasPhone, filterHasEmail, filterHasWebsite, filterIsHiring]);

    const hasActiveFilters = !!(filterName.trim() || filterMinRating || filterHasPhone || filterHasEmail || filterHasWebsite || filterIsHiring);

    const resetFilters = () => {
        setFilterName("");
        setFilterMinRating("");
        setFilterHasPhone(false);
        setFilterHasEmail(false);
        setFilterHasWebsite(false);
        setFilterIsHiring(false);
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
            try {
                const profileRes = await fetch("/api/profile", {
                    headers: { Authorization: `Bearer ${session.access_token}` },
                });
                if (profileRes.ok) {
                    const profile = await profileRes.json();
                    if (profile.profile_prompted === false || profile.profile_prompted == null) {
                        setShowProfileModal(true);
                        setProfileForm({
                            full_name: profile.full_name ?? "",
                            account_type: profile.account_type === "business" ? "business" : "individual",
                            org_name: profile.org_name ?? "",
                            designation: profile.designation ?? "",
                            phone: profile.phone ?? "",
                            city: profile.city ?? "",
                            pan_number: profile.pan_number ?? "",
                            gst_number: profile.gst_number ?? "",
                            nationality: profile.nationality ?? "Indian",
                            company_domicile: profile.company_domicile ?? "India",
                            purpose: profile.purpose ?? "",
                        });
                    }
                }
            } catch (e) {
                console.error("Failed to fetch profile", e);
            }
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
        setFilterIsHiring(false);

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
            setCareerScanStats(null);
            setLastQuery((prev) => prev ? { ...prev, creditsUsed: data.credits_used ?? 1 } : null);
            await fetchCredits(session?.access_token);
        } catch (e) {
            console.error(e);
            setSearchError("Search failed. Please try again.");
        } finally {
            setSearchLoading(false);
        }
    };

    const mergeChunkIntoResults = (current, chunk) => {
        const next = [...current];
        for (const item of chunk) {
            const idx = next.findIndex((r) => (r.place_id && r.place_id === item.place_id) || (r.name && r.name === item.name));
            if (idx >= 0) next[idx] = item;
        }
        return next;
    };

    const handleEnrich = async () => {
        if (!results.length || enriching) return;
        const withWebsites = results.filter((r) => !!(r.website ?? r.websiteUri ?? "").trim());
        const total = withWebsites.length;
        if (total === 0) return;
        setEnriching(true);
        setEnrichmentStats(null);
        setEnrichProgress({ current: 0, total });
        try {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            const chunkSize = 10;
            let merged = results;
            let aggStats = { emails_found: 0, phones_found: 0, whatsapp_found: 0, with_websites: 0, enriched: 0 };
            for (let i = 0; i < total; i += chunkSize) {
                const chunk = withWebsites.slice(i, i + chunkSize);
                const res = await fetch("/api/enrich", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${currentSession?.access_token}`,
                    },
                    body: JSON.stringify({ results: chunk }),
                });
                const data = await res.json();
                if (!res.ok) {
                    alert(data.error || "Enrichment failed");
                    break;
                }
                merged = mergeChunkIntoResults(merged, data.enriched ?? []);
                setResults(merged);
                setEnrichProgress({ current: Math.min(i + chunkSize, total), total });
                if (data.stats) {
                    aggStats.emails_found += data.stats.emails_found ?? 0;
                    aggStats.phones_found += data.stats.phones_found ?? 0;
                    aggStats.whatsapp_found += data.stats.whatsapp_found ?? 0;
                    aggStats.with_websites += data.stats.with_websites ?? 0;
                    aggStats.enriched += data.stats.enriched ?? 0;
                }
            }
            setEnrichmentStats(aggStats);
        } catch (err) {
            console.error("Enrichment failed:", err);
            alert("Enrichment failed. Please try again.");
        } finally {
            setEnriching(false);
            setEnrichProgress({ current: 0, total: 0 });
        }
    };

    const handleCareerScan = async () => {
        const withWebsites = results.filter((r) => !!(r.website ?? "").trim());
        if (!withWebsites.length || careerScanning) return;
        setCareerScanDialog(true);
    };

    const confirmCareerScan = async () => {
        const withWebsites = results.filter((r) => !!(r.website ?? "").trim());
        if (!withWebsites.length || careerScanning) return;
        setCareerScanDialog(false);
        setCareerScanning(true);
        setCareerScanStats(null);
        setCareerScanProgress({ current: 0, total: withWebsites.length });
        try {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            const chunkSize = 3;
            const total = withWebsites.length;
            let merged = results;
            let aggStats = { hiring: 0, with_job_titles: 0, credits_used: 0 };
            for (let i = 0; i < total; i += chunkSize) {
                const chunk = withWebsites.slice(i, i + chunkSize);
                const res = await fetch("/api/career-scan", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${currentSession?.access_token}`,
                    },
                    body: JSON.stringify({ results: chunk }),
                });
                const data = await res.json();
                if (!res.ok) {
                    alert(data.error || "Career scan failed");
                    break;
                }
                merged = mergeChunkIntoResults(merged, data.results ?? []);
                setResults(merged);
                setCareerScanProgress({ current: Math.min(i + chunkSize, total), total });
                if (data.stats) {
                    aggStats.hiring += data.stats.hiring ?? 0;
                    aggStats.with_job_titles += data.stats.with_job_titles ?? 0;
                    aggStats.credits_used += data.stats.credits_used ?? 0;
                }
            }
            setCareerScanStats(aggStats);
            await fetchCredits(currentSession?.access_token);
        } catch (err) {
            console.error("Career scan failed:", err);
            alert("Career scan failed. Please try again.");
        } finally {
            setCareerScanning(false);
            setCareerScanProgress({ current: 0, total: 0 });
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
                name: "Geonayan",
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

    // ── Profile modal ────────────────────────────────────────────────────────
    const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    const handleProfileSkip = async () => {
        setProfileSaveError(null);
        setProfileSaving(true);
        try {
            const { data: { session: s } } = await supabase.auth.getSession();
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${s?.access_token}`,
                },
                body: JSON.stringify({ profile_prompted: true }),
            });
            if (res.ok) {
                setShowProfileModal(false);
            } else {
                const err = await res.json().catch(() => ({}));
                setProfileSaveError(err.error || "Failed to update");
            }
        } catch (e) {
            setProfileSaveError("Failed to update. Please try again.");
        } finally {
            setProfileSaving(false);
        }
    };

    const handleProfileSave = async () => {
        const pan = (profileForm.pan_number ?? "").trim().toUpperCase();
        const gst = (profileForm.gst_number ?? "").trim().toUpperCase();
        if (pan && !PAN_REGEX.test(pan)) {
            setProfileSaveError("Invalid PAN format (e.g. ABCDE1234F)");
            return;
        }
        if (gst && !GST_REGEX.test(gst)) {
            setProfileSaveError("Invalid GST format (e.g. 27ABCDE1234F1Z5)");
            return;
        }
        setProfileSaveError(null);
        setProfileSaving(true);
        try {
            const { data: { session: s } } = await supabase.auth.getSession();
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${s?.access_token}`,
                },
                body: JSON.stringify({
                    full_name: profileForm.full_name || null,
                    account_type: profileForm.account_type || null,
                    org_name: profileForm.org_name || null,
                    designation: profileForm.designation || null,
                    phone: profileForm.phone || null,
                    city: profileForm.city || null,
                    pan_number: pan || null,
                    gst_number: gst || null,
                    nationality: profileForm.nationality || null,
                    company_domicile: profileForm.company_domicile || null,
                    purpose: profileForm.purpose || null,
                    profile_prompted: true,
                }),
            });
            if (res.ok) {
                setShowProfileModal(false);
            } else {
                const err = await res.json().catch(() => ({}));
                setProfileSaveError(err.error || "Failed to save");
            }
        } catch (e) {
            setProfileSaveError("Failed to save. Please try again.");
        } finally {
            setProfileSaving(false);
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
                                <span className="text-white font-display font-bold text-sm">GN</span>
                            </div>
                            <span className="font-display font-bold text-lg text-white">Geonayan</span>
                        </Link>
                        <nav className="flex items-center gap-1">
                            <Link href="/dashboard" className="bg-white/10 text-white text-sm font-medium px-3 py-1.5 rounded-lg">
                                Search
                            </Link>
                            <Link href="/dashboard/bulk" className="text-slate-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
                                Bulk Search
                            </Link>
                            <Link href="/dashboard/map" className="text-slate-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
                                Market Map
                            </Link>
                            <Link href="/dashboard/profile" className="text-slate-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
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
                                {careerScanStats && (
                                    <span className="bg-cyan-500/10 text-cyan-400 text-xs font-medium px-2.5 py-1 rounded-full border border-cyan-500/20">
                                        🏢 Career Scan: {careerScanStats.hiring} actively hiring, {careerScanStats.with_job_titles} with job listings | {careerScanStats.credits_used} credit{careerScanStats.credits_used !== 1 ? "s" : ""} used
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                {enriching && enrichProgress.total > 0 ? (
                                    <div className="flex flex-col gap-1.5 min-w-[200px]">
                                        <span className="text-slate-300 text-xs font-medium">
                                            🔍 Enriching emails... {enrichProgress.current}/{enrichProgress.total} businesses ({Math.round((enrichProgress.current / enrichProgress.total) * 100)}%)
                                        </span>
                                        <div className="h-2 rounded overflow-hidden transition-all duration-300 ease-out" style={{ background: "rgba(255,255,255,0.1)", borderRadius: 4 }}>
                                            <div
                                                className="h-full rounded bg-[#22c55e] transition-all duration-300 ease-out"
                                                style={{ width: `${(enrichProgress.current / enrichProgress.total) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleEnrich}
                                        disabled={enriching || !results.length || !!enrichmentStats}
                                        className={`bg-[#6B2D3C] border-2 border-[#5a2530] text-white hover:bg-[#7d3542] hover:border-[#8a3d4a] disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${!enriching && !enrichmentStats && results.length ? "animate-pulse" : ""}`}
                                    >
                                        {enrichmentStats ? "✅ Enriched" : "🔍 Enrich Emails"}
                                    </button>
                                )}
                                {careerScanning && careerScanProgress.total > 0 ? (
                                    <div className="flex flex-col gap-1.5 min-w-[200px]">
                                        <span className="text-slate-300 text-xs font-medium">
                                            🏢 Scanning for hiring... {careerScanProgress.current}/{careerScanProgress.total} businesses ({Math.round((careerScanProgress.current / careerScanProgress.total) * 100)}%)
                                        </span>
                                        <div className="h-2 rounded overflow-hidden transition-all duration-300 ease-out" style={{ background: "rgba(255,255,255,0.1)", borderRadius: 4 }}>
                                            <div
                                                className="h-full rounded bg-[#22c55e] transition-all duration-300 ease-out"
                                                style={{ width: `${(careerScanProgress.current / careerScanProgress.total) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleCareerScan}
                                        disabled={careerScanning || !results.length || !!careerScanStats || !results.some((r) => !!(r.website ?? "").trim())}
                                        className="border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                                    >
                                        {careerScanStats ? "✅ Scan Hiring" : "🏢 Scan Hiring"}
                                    </button>
                                )}
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
                        <div className="glass-card p-4 mb-4 flex flex-wrap items-center gap-3">
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
                            {careerScanStats && (
                                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filterIsHiring}
                                        onChange={(e) => setFilterIsHiring(e.target.checked)}
                                        className="rounded border-white/20 text-cyan-400 focus:ring-cyan-400"
                                    />
                                    Is Hiring
                                </label>
                            )}
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

                        <ResultsTable results={filteredResults} showEnrichedColumns={!!enrichmentStats} showCareerColumns={!!careerScanStats} variant="dark" />
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

                    <div className="relative glass-card bg-[#020617]/95 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-7 animate-fade-in-up">
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

            {/* ── Career Scan Confirmation Dialog ───────────────────────────── */}
            {careerScanDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
                        onClick={() => setCareerScanDialog(false)}
                    />
                    <div className="relative glass-card bg-[#020617]/95 shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
                        <h2 className="font-display font-bold text-lg text-white mb-2">🏢 Scan for Hiring</h2>
                        <p className="text-slate-400 text-sm mb-4">
                            Scan {results.filter((r) => !!(r.website ?? "").trim()).length} businesses for career pages.
                            <br />
                            Cost: <span className="text-cyan-400 font-semibold">{Math.ceil(results.filter((r) => !!(r.website ?? "").trim()).length / 10)} credits</span> (1 per 10 businesses)
                        </p>
                        <p className="text-slate-300 text-sm mb-6">
                            Your balance: <span className="text-[#22c55e] font-semibold">{credits} credits</span>
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setCareerScanDialog(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white border border-white/10 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmCareerScan}
                                className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
                            >
                                Scan Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Profile completion modal (first signup) ────────────────────── */}
            {showProfileModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div className="relative glass-card bg-[#020617]/95 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
                        <h2 className="font-display font-bold text-xl text-white mb-1">Complete your profile</h2>
                        <p className="text-slate-400 text-sm mb-6">Optional — helps us serve you better</p>
                        {profileSaveError && (
                            <p className="text-red-400 text-sm mb-4">{profileSaveError}</p>
                        )}
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">
                                    {profileForm.account_type === "business" ? "Business / Organization Name" : "Full Name"}
                                </label>
                                <input
                                    type="text"
                                    value={profileForm.full_name}
                                    onChange={(e) => setProfileForm((f) => ({ ...f, full_name: e.target.value }))}
                                    placeholder={profileForm.account_type === "business" ? "Your business name" : "Your name"}
                                    className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                                />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={profileForm.account_type === "business"}
                                    onChange={(e) => setProfileForm((f) => ({ ...f, account_type: e.target.checked ? "business" : "individual" }))}
                                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#22c55e] focus:ring-[#22c55e]"
                                />
                                <span className="text-sm text-slate-300">I&apos;m registering as a business</span>
                            </label>
                            {profileForm.account_type === "individual" && (
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Nationality</label>
                                    <select
                                        value={profileForm.nationality}
                                        onChange={(e) => setProfileForm((f) => ({ ...f, nationality: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                                    >
                                        <option value="Indian">Indian</option>
                                        <option value="UAE">UAE</option>
                                        <option value="Singapore">Singapore</option>
                                        <option value="Malaysia">Malaysia</option>
                                        <option value="Saudi Arabia">Saudi Arabia</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            )}
                            {profileForm.account_type === "business" && (
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Country of Domicile</label>
                                    <select
                                        value={profileForm.company_domicile}
                                        onChange={(e) => setProfileForm((f) => ({ ...f, company_domicile: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                                    >
                                        <option value="India">India</option>
                                        <option value="UAE">UAE</option>
                                        <option value="Saudi Arabia">Saudi Arabia</option>
                                        <option value="Singapore">Singapore</option>
                                        <option value="Malaysia">Malaysia</option>
                                        <option value="UK">UK</option>
                                        <option value="USA">USA</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            )}
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Organization Name</label>
                                <input
                                    type="text"
                                    value={profileForm.org_name}
                                    onChange={(e) => setProfileForm((f) => ({ ...f, org_name: e.target.value }))}
                                    placeholder="e.g. Sharma & Associates"
                                    className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Designation</label>
                                <input
                                    type="text"
                                    value={profileForm.designation}
                                    onChange={(e) => setProfileForm((f) => ({ ...f, designation: e.target.value }))}
                                    placeholder="e.g. Partner, CA, Manager"
                                    className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Phone</label>
                                <input
                                    type="text"
                                    value={profileForm.phone}
                                    onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
                                    placeholder="e.g. +91 98765 43210"
                                    className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">City</label>
                                <input
                                    type="text"
                                    value={profileForm.city}
                                    onChange={(e) => setProfileForm((f) => ({ ...f, city: e.target.value }))}
                                    placeholder="e.g. Mumbai"
                                    className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">PAN Number</label>
                                <input
                                    type="text"
                                    value={profileForm.pan_number}
                                    onChange={(e) => setProfileForm((f) => ({ ...f, pan_number: e.target.value.toUpperCase() }))}
                                    placeholder="e.g. ABCDE1234F"
                                    className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">GST Number</label>
                                <input
                                    type="text"
                                    value={profileForm.gst_number}
                                    onChange={(e) => setProfileForm((f) => ({ ...f, gst_number: e.target.value.toUpperCase() }))}
                                    placeholder="e.g. 27ABCDE1234F1Z5"
                                    className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Purpose</label>
                                <select
                                    value={profileForm.purpose}
                                    onChange={(e) => setProfileForm((f) => ({ ...f, purpose: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                                >
                                    <option value="">Select...</option>
                                    <option value="Lead Generation">Lead Generation</option>
                                    <option value="Market Research">Market Research</option>
                                    <option value="Recruitment">Recruitment</option>
                                    <option value="Competitor Analysis">Competitor Analysis</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={handleProfileSkip}
                                disabled={profileSaving}
                                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white border border-white/10 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Skip for now
                            </button>
                            <button
                                type="button"
                                onClick={handleProfileSave}
                                disabled={profileSaving}
                                className="px-4 py-2 text-sm font-semibold text-white bg-[#22c55e] hover:bg-brand-600 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {profileSaving ? "Saving…" : "Save Profile"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
