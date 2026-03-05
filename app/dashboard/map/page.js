"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import * as XLSX from "xlsx";
import { createBrowserSupabase } from "@/lib/supabase";
import { getLocalitiesByCity, getMapCityNames } from "@/lib/city-leads-data";
import CreditBadge from "@/components/CreditBadge";

import "leaflet/dist/leaflet.css";

const CITY_LOCALITIES = getLocalitiesByCity();

const CITY_CENTERS = {
  Delhi: { lat: 28.6139, lng: 77.209, zoom: 11 },
  Mumbai: { lat: 19.076, lng: 72.8777, zoom: 11 },
  Bangalore: { lat: 12.9716, lng: 77.5946, zoom: 11 },
  Gurgaon: { lat: 28.4595, lng: 77.0266, zoom: 12 },
  Chennai: { lat: 13.0827, lng: 80.2707, zoom: 11 },
  Hyderabad: { lat: 17.385, lng: 78.4867, zoom: 11 },
  Jaipur: { lat: 26.9124, lng: 75.7873, zoom: 11 },
  Indore: { lat: 22.7196, lng: 75.8577, zoom: 11 },
  Pune: { lat: 18.5204, lng: 73.8567, zoom: 11 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714, zoom: 11 },
  Kolkata: { lat: 22.5726, lng: 88.3639, zoom: 11 },
  Lucknow: { lat: 26.8467, lng: 80.9462, zoom: 11 },
  Chandigarh: { lat: 30.7333, lng: 76.7794, zoom: 11 },
  Noida: { lat: 28.5355, lng: 77.391, zoom: 11 },
  Kochi: { lat: 9.9312, lng: 76.2673, zoom: 11 },
  Coimbatore: { lat: 11.0168, lng: 76.9558, zoom: 11 },
  Nagpur: { lat: 21.1458, lng: 79.0882, zoom: 11 },
  Surat: { lat: 21.1702, lng: 72.8311, zoom: 11 },
  Vadodara: { lat: 22.3072, lng: 73.1812, zoom: 11 },
  Bhopal: { lat: 23.2599, lng: 77.4126, zoom: 11 },
  Visakhapatnam: { lat: 17.6868, lng: 83.2185, zoom: 11 },
  Dubai: { lat: 25.2048, lng: 55.2708, zoom: 11 },
  "Abu Dhabi": { lat: 24.4539, lng: 54.3773, zoom: 11 },
  Sharjah: { lat: 25.3463, lng: 55.4209, zoom: 11 },
  Johannesburg: { lat: -26.2041, lng: 28.0473, zoom: 10 },
  "Cape Town": { lat: -33.9249, lng: 18.4241, zoom: 10 },
  Durban: { lat: -29.8587, lng: 31.0218, zoom: 10 },
  "New York": { lat: 40.7128, lng: -74.006, zoom: 10 },
  "Los Angeles": { lat: 34.0522, lng: -118.2437, zoom: 10 },
  Chicago: { lat: 41.8781, lng: -87.6298, zoom: 10 },
  Houston: { lat: 29.7604, lng: -95.3698, zoom: 10 },
  Miami: { lat: 25.7617, lng: -80.1918, zoom: 10 },
  Tokyo: { lat: 35.6762, lng: 139.6503, zoom: 10 },
  Osaka: { lat: 34.6937, lng: 135.5023, zoom: 10 },
  London: { lat: 51.5074, lng: -0.1278, zoom: 10 },
  Manchester: { lat: 53.4808, lng: -2.2426, zoom: 11 },
  Birmingham: { lat: 52.4862, lng: -1.8904, zoom: 11 },
  Berlin: { lat: 52.52, lng: 13.405, zoom: 10 },
  Munich: { lat: 48.1351, lng: 11.582, zoom: 10 },
  Frankfurt: { lat: 50.1109, lng: 8.6821, zoom: 10 },
  Paris: { lat: 48.8566, lng: 2.3522, zoom: 10 },
  Lyon: { lat: 45.764, lng: 4.8357, zoom: 11 },
  Singapore: { lat: 1.3521, lng: 103.8198, zoom: 11 },
  Sydney: { lat: -33.8688, lng: 151.2093, zoom: 10 },
  Melbourne: { lat: -37.8136, lng: 144.9631, zoom: 10 },
  Toronto: { lat: 43.6532, lng: -79.3832, zoom: 10 },
  Vancouver: { lat: 49.2827, lng: -123.1207, zoom: 10 },
  Riyadh: { lat: 24.7136, lng: 46.6753, zoom: 10 },
  Jeddah: { lat: 21.5433, lng: 39.1728, zoom: 10 },
};

const CITIES = getMapCityNames();

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
  const [enriching, setEnriching] = useState(false);
  const [enrichmentStats, setEnrichmentStats] = useState(null);
  const [enrichProgress, setEnrichProgress] = useState({ current: 0, total: 0 });

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
        fetch("/api/log-search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            search_type: "market_map",
            business_type: businessType,
            location: locality,
            provider: "google_places",
            results_count: placeList.length,
            credits_used: data.cached ? 0 : (data.credits_used ?? 1),
          }),
        }).catch(() => {});
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

  const handleExportEnrichedOnly = async () => {
    const enrichedOnly = allResults.filter((r) => (r.enriched_emails?.length ?? 0) > 0);
    if (enrichedOnly.length === 0) return;
    try {
      const res = await fetch("/api/bulk-export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          results: enrichedOnly,
          searches: localityResults.map((r) => ({ query: businessType, location: r.locality, result_count: r.count })),
          stats: {
            total_searches: localityResults.length,
            total_results: enrichedOnly.length,
            credits_used: 0,
            cached_count: 0,
            emails_found: enrichedOnly.reduce((s, r) => s + (r.enriched_emails?.length ?? 0), 0),
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
      a.download = `market_map_enriched_only_${Date.now()}.xlsx`;
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
      const chunkSize = 3;
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

  const mergeEnrichChunkIntoMap = (currentResults, currentLocalityResults, chunkEnriched) => {
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

  const handleEnrich = async () => {
    const withWebsites = allResults.filter((r) => !!(r.website ?? r.websiteUri ?? "").trim());
    if (!withWebsites.length || enriching) return;
    setEnriching(true);
    setEnrichmentStats(null);
    setEnrichProgress({ current: 0, total: withWebsites.length });
    try {
      const chunkSize = 10;
      const total = withWebsites.length;
      let mergedAll = allResults;
      let mergedLocality = localityResults;
      let aggStats = { emails_found: 0, phones_found: 0, whatsapp_found: 0, with_websites: 0, enriched: 0 };
      for (let i = 0; i < total; i += chunkSize) {
        const chunk = withWebsites.slice(i, i + chunkSize);
        const res = await fetch("/api/enrich", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ results: chunk }),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || "Enrichment failed");
          break;
        }
        const chunkResults = data.enriched ?? [];
        const { newAll, newLocality } = mergeEnrichChunkIntoMap(mergedAll, mergedLocality, chunkResults);
        mergedAll = newAll;
        mergedLocality = newLocality;
        setAllResults(mergedAll);
        setLocalityResults(mergedLocality);
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
      await fetchCredits(session?.access_token);
    } catch (e) {
      console.error(e);
      alert("Enrichment failed. Please try again.");
    } finally {
      setEnriching(false);
      setEnrichProgress({ current: 0, total: 0 });
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
  const emailByLocality = localityResults.map((loc) => ({
    locality: loc.locality,
    withEmail: (loc.results ?? []).filter((r) => (r.enriched_emails?.length ?? 0) > 0).length,
    count: loc.count ?? (loc.results ?? []).length,
  }));
  const totalWithEmails = emailByLocality.reduce((s, x) => s + x.withEmail, 0);
  const localitiesWithEmails = emailByLocality.filter((x) => x.withEmail > 0).length;
  const bestEmailCoverage = [...emailByLocality]
    .filter((x) => x.count > 0)
    .map((x) => ({ ...x, pct: (x.withEmail / x.count) * 100 }))
    .sort((a, b) => b.pct - a.pct)[0];
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
                <span className="text-white font-display font-bold text-sm">GN</span>
              </div>
              <span className="font-display font-bold text-lg text-white">Geonayan</span>
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
              <Link href="/dashboard/profile" className="text-slate-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
                Profile
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
                    {enrichmentStats && (
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">Emails Found</th>
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
                      {enrichmentStats && (
                        <td className="px-4 py-3 text-slate-300">
                          {emailByLocality.find((e) => e.locality === r.locality)?.withEmail ?? 0}
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
                {enrichmentStats && totalWithEmails > 0 && (
                  <p className="text-slate-300">
                    📧 Email Coverage: <span className="text-white font-medium">{totalWithEmails} businesses</span> with emails across {localitiesWithEmails} localities
                  </p>
                )}
                {enrichmentStats && bestEmailCoverage && bestEmailCoverage.withEmail > 0 && (
                  <p className="text-slate-300">
                    📧 Best Email Coverage: <span className="text-white font-medium">{bestEmailCoverage.locality}</span> ({Math.round(bestEmailCoverage.pct)}% have emails)
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
                    {hiringOnlyList.map((row, idx) => {
                      const jobTitles = row.job_titles ?? [];
                      const jobTitlesStr = jobTitles.length > 0 ? jobTitles.join(", ") : "—";
                      return (
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
                        <td className="px-4 py-3 text-slate-300 max-w-[200px] truncate" title={jobTitlesStr}>
                          {jobTitlesStr}
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
                    );
                    })}
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
              {enrichmentStats && totalWithEmails > 0 && (
                <button
                  onClick={handleExportEnrichedOnly}
                  className="border-2 border-[#22c55e]/50 text-[#22c55e] hover:bg-[#22c55e]/10 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Export Enriched Only
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
              {enriching && enrichProgress.total > 0 ? (
                <div className="flex flex-col gap-1.5 min-w-[220px]">
                  <span className="text-slate-300 text-sm font-medium">
                    📧 Enriching... {enrichProgress.current}/{enrichProgress.total} businesses ({Math.round((enrichProgress.current / enrichProgress.total) * 100)}%)
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
                  disabled={enriching || !allResults.some((r) => !!(r.website ?? r.websiteUri ?? "").trim()) || !!enrichmentStats}
                  className="border-2 border-[#22c55e]/50 text-[#22c55e] hover:bg-[#22c55e]/10 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  {enrichmentStats ? "✅ Enrich All for Emails" : "📧 Enrich All for Emails"}
                </button>
              )}
            </div>
            {careerScanStats && !careerScanning && (
              <p className="text-cyan-400/90 text-sm mb-6">
                🏢 Career Scan: {careerScanStats.hiring} actively hiring, {careerScanStats.with_job_titles} with job listings | {careerScanStats.credits_used} credit{careerScanStats.credits_used !== 1 ? "s" : ""} used
              </p>
            )}
            {enrichmentStats && !enriching && (
              <p className="text-[#22c55e]/90 text-sm mb-6">
                📧 Enrichment: {enrichmentStats.emails_found} emails, {enrichmentStats.phones_found} phones{enrichmentStats.whatsapp_found ? `, ${enrichmentStats.whatsapp_found} WhatsApp` : ""} from {enrichmentStats.with_websites} websites
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
