"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import * as XLSX from "xlsx";
import { createBrowserSupabase } from "@/lib/supabase";
import CreditBadge from "@/components/CreditBadge";

import "leaflet/dist/leaflet.css";

const CITY_LOCALITIES = {
  Delhi: [
    "Connaught Place Delhi", "Dwarka Delhi", "Rohini Delhi", "Karol Bagh Delhi", "Laxmi Nagar Delhi", "Pitampura Delhi",
    "Janakpuri Delhi", "Saket Delhi", "Nehru Place Delhi", "Rajouri Garden Delhi", "Preet Vihar Delhi", "Mayur Vihar Delhi",
    "Vasant Kunj Delhi", "Greater Kailash Delhi", "Defence Colony Delhi", "Hauz Khas Delhi", "Chandni Chowk Delhi", "Patel Nagar Delhi",
    "Kalkaji Delhi", "Tilak Nagar Delhi",
  ],
  Mumbai: [
    "Andheri Mumbai", "Bandra Mumbai", "Dadar Mumbai", "Borivali Mumbai", "Thane Mumbai", "Malad Mumbai",
    "Goregaon Mumbai", "Powai Mumbai", "Lower Parel Mumbai", "Fort Mumbai", "Churchgate Mumbai", "Juhu Mumbai",
    "Kandivali Mumbai", "Mulund Mumbai", "Vikhroli Mumbai", "Chembur Mumbai", "Navi Mumbai", "Vashi Mumbai",
    "BKC Mumbai", "Worli Mumbai",
  ],
  Bangalore: [
    "Koramangala Bangalore", "Indiranagar Bangalore", "HSR Layout Bangalore", "Whitefield Bangalore", "Electronic City Bangalore", "Jayanagar Bangalore",
    "JP Nagar Bangalore", "Marathahalli Bangalore", "BTM Layout Bangalore", "Malleshwaram Bangalore", "Rajajinagar Bangalore", "Hebbal Bangalore",
    "Yelahanka Bangalore", "Banashankari Bangalore", "MG Road Bangalore", "Sadashivanagar Bangalore", "RT Nagar Bangalore", "Basavanagudi Bangalore",
    "Vijayanagar Bangalore", "Bannerghatta Road Bangalore",
  ],
  Gurgaon: [
    "Sector 14 Gurgaon", "Sector 29 Gurgaon", "DLF Phase 1 Gurgaon", "DLF Phase 3 Gurgaon", "Sohna Road Gurgaon", "MG Road Gurgaon",
    "Golf Course Road Gurgaon", "Sector 56 Gurgaon", "Sector 49 Gurgaon", "Udyog Vihar Gurgaon", "Palam Vihar Gurgaon", "South City Gurgaon",
    "Sector 15 Gurgaon", "Sector 44 Gurgaon", "Cyber City Gurgaon",
  ],
  Chennai: [
    "T Nagar Chennai", "Anna Nagar Chennai", "Adyar Chennai", "Velachery Chennai", "Tambaram Chennai", "OMR Chennai",
    "Mylapore Chennai", "Nungambakkam Chennai", "Egmore Chennai", "Porur Chennai", "Guindy Chennai", "Chromepet Chennai",
    "Kilpauk Chennai", "Kodambakkam Chennai", "Thiruvanmiyur Chennai",
  ],
  Hyderabad: [
    "Ameerpet Hyderabad", "Madhapur Hyderabad", "HITEC City Hyderabad", "Banjara Hills Hyderabad", "Jubilee Hills Hyderabad", "Kukatpally Hyderabad",
    "Gachibowli Hyderabad", "Secunderabad", "Begumpet Hyderabad", "Dilsukhnagar Hyderabad", "LB Nagar Hyderabad", "Abids Hyderabad",
    "Kondapur Hyderabad", "Miyapur Hyderabad", "Uppal Hyderabad",
  ],
  Dubai: [
    "Business Bay Dubai", "DIFC Dubai", "Deira Dubai", "Bur Dubai", "JLT Dubai", "Downtown Dubai",
    "Dubai Marina", "Al Barsha Dubai", "Karama Dubai", "International City Dubai", "Silicon Oasis Dubai", "JBR Dubai",
  ],
};

const CITY_CENTERS = {
  Delhi: { lat: 28.6139, lng: 77.209, zoom: 11 },
  Mumbai: { lat: 19.076, lng: 72.8777, zoom: 11 },
  Bangalore: { lat: 12.9716, lng: 77.5946, zoom: 11 },
  Gurgaon: { lat: 28.4595, lng: 77.0266, zoom: 12 },
  Chennai: { lat: 13.0827, lng: 80.2707, zoom: 11 },
  Hyderabad: { lat: 17.385, lng: 78.4867, zoom: 11 },
  Dubai: { lat: 25.2048, lng: 55.2708, zoom: 11 },
};

const CITIES = Object.keys(CITY_LOCALITIES);

function getRadius(count) {
  if (count <= 5) return 8;
  if (count <= 15) return 14;
  return 20;
}

function getColor(count) {
  if (count <= 5) return "#22c55e";
  if (count <= 12) return "#eab308";
  if (count <= 18) return "#f97316";
  return "#ef4444";
}

const MapDisplay = dynamic(
  () => import("@/components/MarketMap").then((m) => m.MarketMap),
  { ssr: false }
);

export default function MarketMapPage() {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [credits, setCredits] = useState(0);

  const [businessType, setBusinessType] = useState("Chartered Accountants");
  const [city, setCity] = useState("Delhi");
  const [customLocalitiesText, setCustomLocalitiesText] = useState("");

  const [localities, setLocalities] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localityStatus, setLocalityStatus] = useState({});
  const [localityResults, setLocalityResults] = useState([]);
  const [totalBusinesses, setTotalBusinesses] = useState(0);
  const [allResults, setAllResults] = useState([]);
  const [careerScanning, setCareerScanning] = useState(false);
  const [careerScanStats, setCareerScanStats] = useState(null);
  const [careerScanDialog, setCareerScanDialog] = useState(false);
  const [careerScanProgress, setCareerScanProgress] = useState({ current: 0, total: 0 });

  const fetchCredits = useCallback(async (token) => {
    if (!token) return;
    try {
      const res = await fetch("/api/credits", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setCredits(data.credits ?? 0);
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

  const getLocalitiesList = useCallback(() => {
    if (city === "Custom") {
      return customLocalitiesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return CITY_LOCALITIES[city] || [];
  }, [city, customLocalitiesText]);

  const handleScan = useCallback(async () => {
    const list = getLocalitiesList();
    if (!session?.access_token || list.length === 0) return;
    setScanning(true);
    setLocalityResults([]);
    setAllResults([]);
    setTotalBusinesses(0);
    setLocalityStatus({});
    setCurrentIndex(0);

    const results = [];
    let total = 0;

    for (let i = 0; i < list.length; i++) {
      const locality = list[i];
      setCurrentIndex(i);
      setLocalityStatus((prev) => ({ ...prev, [locality]: "scanning" }));

      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            query: businessType,
            location: locality,
            provider: "google_places",
          }),
        });

        if (res.status === 402) {
          const data = await res.json().catch(() => ({}));
          setCredits(data.credits ?? 0);
          setLocalityStatus((prev) => ({ ...prev, [locality]: "queued" }));
          setScanning(false);
          return;
        }

        const data = await res.json().catch(() => ({}));
        const placeList = data.results || [];
        const withPhone = placeList.filter((r) => !!(r.phone)).length;
        const withWebsite = placeList.filter((r) => !!(r.website)).length;
        const ratings = placeList.map((r) => r.rating).filter((v) => v != null && !Number.isNaN(Number(v)));
        const avgRating = ratings.length ? (ratings.reduce((a, b) => a + Number(b), 0) / ratings.length).toFixed(1) : null;
        const first = placeList[0];
        const lat = first?.latitude ?? null;
        const lng = first?.longitude ?? null;
        const topBusinessNames = placeList.slice(0, 3).map((r) => r.name ?? "—");

        const tagged = placeList.map((r) => ({
          ...r,
          source_query: businessType,
          source_location: locality,
        }));

        results.push({
          locality,
          count: placeList.length,
          results: tagged,
          avgRating: avgRating ? parseFloat(avgRating) : null,
          withPhone,
          withWebsite,
          topBusinesses: topBusinessNames,
          lat,
          lng,
        });
        total += placeList.length;
        setLocalityResults([...results]);
        setAllResults((prev) => prev.concat(tagged));
        setTotalBusinesses(total);
        setLocalityStatus((prev) => ({ ...prev, [locality]: "done" }));
        setCredits(data.credits_remaining ?? credits);
      } catch (err) {
        console.error(err);
        setLocalityStatus((prev) => ({ ...prev, [locality]: "failed" }));
      }

      await new Promise((r) => setTimeout(r, 1500));
    }

    setScanning(false);
  }, [session?.access_token, businessType, getLocalitiesList, credits]);

  useEffect(() => {
    setLocalities(getLocalitiesList());
  }, [getLocalitiesList, city, customLocalitiesText]);

  const handleExportMapData = () => {
    if (localityResults.length === 0) return;
    const rows = localityResults.map((r) => [
      r.locality,
      r.count,
      r.avgRating ?? "",
      r.lat ?? "",
      r.lng ?? "",
      (r.topBusinesses || []).join("; "),
    ]);
    const ws = XLSX.utils.aoa_to_sheet([
      ["Locality", "Businesses Found", "Avg Rating", "Latitude", "Longitude", "Top Businesses"],
      ...rows,
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Map Data");
    XLSX.writeFile(wb, `market_map_${Date.now()}.xlsx`);
  };

  const handleExportAllLeads = async () => {
    if (allResults.length === 0) return;
    try {
      const res = await fetch("/api/bulk-export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          results: allResults,
          searches: localityResults.map((r) => ({ query: businessType, location: r.locality, result_count: r.count })),
          stats: {
            total_searches: localityResults.length,
            total_results: allResults.length,
            credits_used: localityResults.length,
            cached_count: 0,
            emails_found: 0,
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
      a.download = `market_map_leads_${Date.now()}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      await fetchCredits(session?.access_token);
    } catch (e) {
      console.error(e);
      alert("Export failed. Please try again.");
    }
  };

  const handleExportHiringOnly = async () => {
    const hiringOnly = allResults.filter((r) => r.is_hiring === true);
    if (hiringOnly.length === 0) return;
    try {
      const res = await fetch("/api/bulk-export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          results: hiringOnly,
          searches: localityResults.map((r) => ({ query: businessType, location: r.locality, result_count: r.count })),
          stats: {
            total_searches: localityResults.length,
            total_results: hiringOnly.length,
            credits_used: 0,
            cached_count: 0,
            emails_found: 0,
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
      a.download = `market_map_hiring_${Date.now()}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      await fetchCredits(session?.access_token);
    } catch (e) {
      console.error(e);
      alert("Export failed. Please try again.");
    }
  };

  const handleCareerScanClick = () => {
    const withWebsites = allResults.filter((r) => !!(r.website ?? "").trim());
    if (!withWebsites.length || careerScanning) return;
    setCareerScanDialog(true);
  };

  const mergeCareerChunkIntoMap = (currentResults, currentLocalityResults, chunkEnriched) => {
    const mergedMap = new Map();
    chunkEnriched.forEach((r) => {
      const key = [r.source_query, r.source_location, r.name].filter(Boolean).join("|");
      if (key) mergedMap.set(key, r);
    });
    const newAll = currentResults.map((r) => {
      const key = [r.source_query, r.source_location, r.name].filter(Boolean).join("|");
      return mergedMap.get(key) ?? r;
    });
    const newLocality = currentLocalityResults.map((loc) => ({
      ...loc,
      results: (loc.results ?? []).map((row) => {
        const key = [row.source_query, row.source_location, row.name].filter(Boolean).join("|");
        return mergedMap.get(key) ?? row;
      }),
    }));
    return { newAll, newLocality };
  };

  const confirmCareerScan = async () => {
    const withWebsites = allResults.filter((r) => !!(r.website ?? "").trim());
    if (!withWebsites.length || careerScanning) return;
    setCareerScanDialog(false);
    setCareerScanning(true);
    setCareerScanStats(null);
    setCareerScanProgress({ current: 0, total: withWebsites.length });
    try {
      const chunkSize = 10;
      const total = withWebsites.length;
      let mergedAll = allResults;
      let mergedLocality = localityResults;
      let aggStats = { hiring: 0, with_job_titles: 0, credits_used: 0 };
      for (let i = 0; i < total; i += chunkSize) {
        const chunk = withWebsites.slice(i, i + chunkSize);
        const res = await fetch("/api/career-scan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ results: chunk }),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || "Career scan failed");
          break;
        }
        const chunkResults = data.results ?? [];
        const { newAll, newLocality } = mergeCareerChunkIntoMap(mergedAll, mergedLocality, chunkResults);
        mergedAll = newAll;
        mergedLocality = newLocality;
        setAllResults(mergedAll);
        setLocalityResults(mergedLocality);
        setCareerScanProgress({ current: Math.min(i + chunkSize, total), total });
        if (data.stats) {
          aggStats.hiring += data.stats.hiring ?? 0;
          aggStats.with_job_titles += data.stats.with_job_titles ?? 0;
          aggStats.credits_used += data.stats.credits_used ?? 0;
        }
      }
      setCareerScanStats(aggStats);
      await fetchCredits(session?.access_token);
    } catch (e) {
      console.error(e);
      alert("Career scan failed. Please try again.");
    } finally {
      setCareerScanning(false);
      setCareerScanProgress({ current: 0, total: 0 });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const sortedResults = [...localityResults].sort((a, b) => b.count - a.count);
  const mostCompetitive = sortedResults[0];
  const opportunityZone = sortedResults.filter((r) => r.count > 0).pop();
  const highestRated = [...localityResults].filter((r) => r.avgRating != null).sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0))[0];
  const bestPhoneCoverage = [...localityResults].filter((r) => r.count > 0).sort((a, b) => (b.withPhone / b.count) - (a.withPhone / a.count))[0];
  const hiringByLocality = localityResults.map((loc) => ({
    locality: loc.locality,
    hiring: (loc.results ?? []).filter((r) => r.is_hiring === true).length,
  }));
  const totalHiring = hiringByLocality.reduce((s, x) => s + x.hiring, 0);
  const localitiesWithHiring = hiringByLocality.filter((x) => x.hiring > 0).length;
  const topHiringArea = [...hiringByLocality].sort((a, b) => b.hiring - a.hiring)[0];
  const confidenceOrder = { high: 0, medium: 1, low: 2 };
  const hiringOnlyList = [...allResults]
    .filter((r) => r.is_hiring === true)
    .sort((a, b) => (confidenceOrder[a.hiring_confidence] ?? 99) - (confidenceOrder[b.hiring_confidence] ?? 99));
  const getHiringColor = (count) => (count >= 5 ? "#22c55e" : count >= 1 ? "#eab308" : "#64748b");

  const mapCenter = city === "Custom" ? { lat: 28.6139, lng: 77.209, zoom: 10 } : (CITY_CENTERS[city] || { lat: 28.6139, lng: 77.209, zoom: 11 });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white dashboard-dark">
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
              <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
                Search
              </Link>
              <Link href="/dashboard/bulk" className="text-slate-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
                Bulk Search
              </Link>
              <Link href="/dashboard/map" className="bg-white/10 text-white text-sm font-medium px-3 py-1.5 rounded-lg">
                Market Map
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <CreditBadge credits={credits} variant="dark" />
            <Link
              href="/dashboard"
              className="bg-[#22c55e] hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Buy Credits
            </Link>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white transition-colors" title="Log out">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="font-display font-bold text-2xl text-white mb-2">Market Map</h1>
        <p className="text-slate-400 text-sm mb-8">
          Scan localities in a city to see business density. Find underserved areas or competitive hotspots.
        </p>

        <div className="glass-card p-6 mb-8">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Controls</h2>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Business Type</label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-64 px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                placeholder="Chartered Accountants"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">City / Region</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Custom">Custom</option>
              </select>
            </div>
            {city === "Custom" && (
              <div>
                <label className="block text-xs text-slate-500 mb-1">Localities (comma-separated)</label>
                <input
                  type="text"
                  value={customLocalitiesText}
                  onChange={(e) => setCustomLocalitiesText(e.target.value)}
                  placeholder="Area 1, Area 2, Area 3"
                  className="w-80 px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                />
              </div>
            )}
            <button
              onClick={handleScan}
              disabled={scanning || localities.length === 0}
              className="bg-[#22c55e] hover:bg-brand-600 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              {scanning ? "Scanning…" : "Scan Market"}
            </button>
          </div>
          <p className="text-slate-500 text-sm mt-3">
            This will scan ~{localities.length} localities using ~{localities.length} credits. Cached searches are free. Your balance:{" "}
            <span className="text-[#22c55e] font-semibold">{credits} credits</span>
          </p>
        </div>

        {scanning && (
          <div className="glass-card p-6 mb-8">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Scanning Progress</h2>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-[#22c55e] transition-all duration-300"
                style={{ width: `${localities.length ? (Object.values(localityStatus).filter((s) => s === "done" || s === "failed").length / localities.length) * 100 : 0}%` }}
              />
            </div>
            <p className="text-slate-400 text-sm mb-2">
              Scanning {localities[currentIndex]}... ({currentIndex + 1}/{localities.length})
            </p>
            <p className="text-[#22c55e] font-semibold">{totalBusinesses} businesses found so far</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {localities.map((loc) => {
                const status = localityStatus[loc] || "queued";
                const res = localityResults.find((r) => r.locality === loc);
                return (
                  <span
                    key={loc}
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${
                      status === "done" ? "bg-[#22c55e]/10 border-[#22c55e]/30 text-[#22c55e]" :
                      status === "scanning" ? "bg-blue-500/10 border-blue-500/30 text-blue-400" :
                      status === "failed" ? "bg-red-500/10 border-red-500/30 text-red-400" :
                      "bg-white/5 border-white/10 text-slate-500"
                    }`}
                  >
                    {status === "done" && "✅"}
                    {status === "scanning" && "⏳"}
                    {status === "queued" && "⏸"}
                    {status === "failed" && "❌"}
                    {loc}{res ? ` (${res.count})` : ""}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {localityResults.length > 0 && (
          <>
            <div className="glass-card p-6 mb-8">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Map</h2>
              <div className="glass-card overflow-hidden" style={{ height: 420 }}>
                <MapDisplay
                  center={mapCenter}
                  localityResults={localityResults}
                  getRadius={getRadius}
                  getColor={getColor}
                  businessType={businessType}
                />
              </div>
            </div>

            <div className="glass-card p-6 mb-8 overflow-x-auto">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Results by Locality</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">Rank</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">Locality</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">Businesses</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">Avg Rating</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">With Phone</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">With Website</th>
                    {careerScanStats && (
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">Hiring</th>
                    )}
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">Top Business</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map((r, i) => (
                    <tr key={r.locality} className="border-b border-white/10">
                      <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                      <td className="px-4 py-3 text-white">{r.locality}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium" style={{ color: getColor(r.count) }}>{r.count}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{r.avgRating ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-300">{r.withPhone}</td>
                      <td className="px-4 py-3 text-slate-300">{r.withWebsite}</td>
                      {careerScanStats && (
                        <td className="px-4 py-3">
                          <span className="font-medium" style={{ color: getHiringColor(hiringByLocality.find((h) => h.locality === r.locality)?.hiring ?? 0) }}>
                            {hiringByLocality.find((h) => h.locality === r.locality)?.hiring ?? 0}
                          </span>
                        </td>
                      )}
                      <td className="px-4 py-3 text-slate-400 truncate max-w-[180px]">{r.topBusinesses?.[0] ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="glass-card p-6 mb-8">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Insights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {careerScanStats && totalHiring > 0 && (
                  <p className="text-slate-300">
                    🏢 Actively Hiring: <span className="text-white font-medium">{totalHiring} businesses</span> across {localitiesWithHiring} localities
                  </p>
                )}
                {careerScanStats && topHiringArea?.hiring > 0 && (
                  <p className="text-slate-300">
                    📋 Top Hiring Area: <span className="text-white font-medium">{topHiringArea.locality}</span> ({topHiringArea.hiring} hiring)
                  </p>
                )}
                {careerScanStats && careerScanStats.with_job_titles > 0 && (
                  <p className="text-slate-300">
                    💼 With Job Listings: <span className="text-white font-medium">{careerScanStats.with_job_titles} businesses</span>
                  </p>
                )}
                {mostCompetitive && (
                  <p className="text-slate-300">
                    🔥 Most Competitive: <span className="text-white font-medium">{mostCompetitive.locality}</span> ({mostCompetitive.count} {businessType} found)
                  </p>
                )}
                {opportunityZone && opportunityZone.count > 0 && (
                  <p className="text-slate-300">
                    💡 Opportunity Zone: <span className="text-white font-medium">{opportunityZone.locality}</span> (only {opportunityZone.count} found)
                  </p>
                )}
                {highestRated && (
                  <p className="text-slate-300">
                    ⭐ Highest Rated Area: <span className="text-white font-medium">{highestRated.locality}</span> (avg {highestRated.avgRating})
                  </p>
                )}
                {bestPhoneCoverage && bestPhoneCoverage.count > 0 && (
                  <p className="text-slate-300">
                    📱 Best Phone Coverage: <span className="text-white font-medium">{bestPhoneCoverage.locality}</span> ({Math.round((bestPhoneCoverage.withPhone / bestPhoneCoverage.count) * 100)}% have phone)
                  </p>
                )}
              </div>
            </div>

            {careerScanStats && hiringOnlyList.length > 0 && (
              <div className="glass-card p-6 mb-8 overflow-x-auto">
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Hiring Results</h2>
                <p className="text-slate-400 text-sm mb-4">
                  Businesses actively hiring ({hiringOnlyList.length} total), sorted by confidence.
                </p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">#</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">Business Name</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">Locality</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">Phone</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">Website</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">Career Page</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">Job Titles</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hiringOnlyList.map((row, idx) => (
                      <tr key={idx} className="border-b border-white/10">
                        <td className="px-4 py-3 text-slate-400">{idx + 1}</td>
                        <td className="px-4 py-3 text-white font-medium">{row.name ?? "—"}</td>
                        <td className="px-4 py-3 text-slate-300">{row.source_location ?? "—"}</td>
                        <td className="px-4 py-3">
                          {row.phone ? (
                            <a href={`tel:${row.phone}`} className="text-[#22c55e] hover:underline">{row.phone}</a>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {row.website ? (
                            <a href={row.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Visit</a>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {row.career_url ? (
                            <a href={row.career_url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Visit</a>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-300 max-w-[200px] truncate" title={(row.job_titles ?? []).join(", ")}">
                          {(row.job_titles ?? []).length > 0 ? (row.job_titles ?? []).join(", ") : "—"}
                        </td>
                        <td className="px-4 py-3">
                          {row.hiring_confidence === "high" && (
                            <span className="inline-flex rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium px-2 py-0.5 border border-emerald-500/30">High</span>
                          )}
                          {row.hiring_confidence === "medium" && (
                            <span className="inline-flex rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium px-2 py-0.5 border border-amber-500/30">Medium</span>
                          )}
                          {(row.hiring_confidence === "low" || (!row.hiring_confidence && row.is_hiring)) && (
                            <span className="inline-flex rounded-full bg-slate-500/20 text-slate-400 text-xs font-medium px-2 py-0.5 border border-slate-500/30">Low</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={handleExportMapData}
                className="bg-[#22c55e] hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg"
              >
                Export Map Data to Excel
              </button>
              <button
                onClick={handleExportAllLeads}
                className="border border-white/10 hover:bg-white/5 text-slate-300 text-sm font-medium px-4 py-2 rounded-lg"
              >
                Export All Leads to Excel
              </button>
              {careerScanStats && totalHiring > 0 && (
                <button
                  onClick={handleExportHiringOnly}
                  className="border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Export Hiring Only
                </button>
              )}
              {careerScanning && careerScanProgress.total > 0 ? (
                <div className="flex flex-col gap-1.5 min-w-[220px]">
                  <span className="text-slate-300 text-sm font-medium">
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
                  onClick={handleCareerScanClick}
                  disabled={careerScanning || !allResults.some((r) => !!(r.website ?? "").trim()) || !!careerScanStats}
                  className="border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  {careerScanStats ? "✅ Scan All for Hiring" : "🏢 Scan All for Hiring"}
                </button>
              )}
            </div>
            {careerScanStats && !careerScanning && (
              <p className="text-cyan-400/90 text-sm mb-6">
                🏢 Career Scan: {careerScanStats.hiring} actively hiring, {careerScanStats.with_job_titles} with job listings | {careerScanStats.credits_used} credit{careerScanStats.credits_used !== 1 ? "s" : ""} used
              </p>
            )}

            {/* Career Scan Confirmation Dialog */}
            {careerScanDialog && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setCareerScanDialog(false)} />
                <div className="relative glass-card bg-[#020617]/95 shadow-2xl max-w-md w-full p-6">
                  <h2 className="font-display font-bold text-lg text-white mb-2">🏢 Scan All for Hiring</h2>
                  <p className="text-slate-400 text-sm mb-4">
                    Scan {allResults.filter((r) => !!(r.website ?? "").trim()).length} businesses across all localities.
                    <br />
                    Cost: <span className="text-cyan-400 font-semibold">{Math.ceil(allResults.filter((r) => !!(r.website ?? "").trim()).length / 10)} credits</span> (1 per 10 businesses)
                  </p>
                  <p className="text-slate-300 text-sm mb-6">
                    Your balance: <span className="text-[#22c55e] font-semibold">{credits} credits</span>
                  </p>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setCareerScanDialog(false)} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white border border-white/10 rounded-lg">
                      Cancel
                    </button>
                    <button onClick={confirmCareerScan} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 hover:bg-cyan-600 rounded-lg">
                      Scan Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
