"use client";

import { useState } from "react";

const QUICK_CHIPS = [
    { label: "CAs in CP Delhi", business: "Chartered Accountants", locality: "Connaught Place Delhi" },
    { label: "Tax Consultants", business: "Tax Consultants", locality: "" },
    { label: "Law Firms", business: "Law Firms", locality: "" },
    { label: "CAs in Dubai", business: "Chartered Accountants", locality: "Dubai" },
    { label: "Auditors", business: "Auditors", locality: "" },
];

const inputBase = "w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent transition-all";
const inputLight = "border border-slate-200 text-slate-900 placeholder:text-slate-400";
const inputDark = "border border-white/10 bg-white/5 text-white placeholder:text-slate-500";

export default function SearchForm({ onSearch, loading = false, variant = "light" }) {
    const isDark = variant === "dark";
    const inputClass = `${inputBase} ${isDark ? inputDark : inputLight}`;

    const [business, setBusiness] = useState("");
    const [locality, setLocality] = useState("");
    const [provider, setProvider] = useState("google");
    const [deep, setDeep] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!business.trim()) return;
        onSearch({ business: business.trim(), locality: locality.trim(), provider, deep });
    };

    const handleChipClick = (chip) => {
        setBusiness(chip.business);
        setLocality(chip.locality);
        onSearch({ business: chip.business, locality: chip.locality, provider, deep });
    };

    return (
        <div className={`rounded-2xl border p-6 animate-fade-in-up ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-5">
                        <input
                            type="text"
                            value={business}
                            onChange={(e) => setBusiness(e.target.value)}
                            placeholder="e.g., Chartered Accountants, Law Firms..."
                            className={inputClass}
                        />
                    </div>
                    <div className="md:col-span-4">
                        <input
                            type="text"
                            value={locality}
                            onChange={(e) => setLocality(e.target.value)}
                            placeholder="e.g., Connaught Place Delhi, 110001..."
                            className={inputClass}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <select
                            value={provider}
                            onChange={(e) => setProvider(e.target.value)}
                            className={`${inputClass} appearance-none cursor-pointer ${isDark ? "bg-white/5" : "bg-white"}`}
                        >
                            <option value="google">Google Places</option>
                            <option value="serpapi">SerpAPI</option>
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-full min-h-[48px] bg-[#22c55e] hover:bg-brand-600 disabled:opacity-50 text-white rounded-lg flex items-center justify-center transition-colors duration-150"
                        >
                            {loading ? (
                                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                {provider === "google" && (
                    <label className={`flex items-center gap-2 mt-3 cursor-pointer ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        <input
                            type="checkbox"
                            checked={deep}
                            onChange={(e) => setDeep(e.target.checked)}
                            className="rounded border-white/20 text-[#22c55e] focus:ring-[#22c55e]"
                        />
                        <span className="text-sm">Deep Search (up to 40 results, uses 2 credits)</span>
                    </label>
                )}
            </form>
            <div className="flex flex-wrap gap-2 mt-4">
                {QUICK_CHIPS.map((chip) => (
                    <button
                        key={chip.label}
                        onClick={() => handleChipClick(chip)}
                        className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition-all duration-150 ${isDark ? "text-slate-300 bg-white/5 border-white/10 hover:border-[#22c55e]/50 hover:text-[#22c55e]" : "text-slate-600 bg-slate-100 border-slate-200 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-300"}`}
                    >
                        {chip.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
