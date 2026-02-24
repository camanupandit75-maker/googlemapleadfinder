"use client";

import { useState } from "react";

const QUICK_CHIPS = [
    { label: "CAs in CP Delhi", business: "Chartered Accountants", locality: "Connaught Place Delhi" },
    { label: "Tax Consultants", business: "Tax Consultants", locality: "" },
    { label: "Law Firms", business: "Law Firms", locality: "" },
    { label: "CAs in Dubai", business: "Chartered Accountants", locality: "Dubai" },
    { label: "Auditors", business: "Auditors", locality: "" },
];

export default function SearchForm({ onSearch, loading = false }) {
    const [business, setBusiness] = useState("");
    const [locality, setLocality] = useState("");
    const [provider, setProvider] = useState("google");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!business.trim()) return;
        onSearch({ business: business.trim(), locality: locality.trim(), provider });
    };

    const handleChipClick = (chip) => {
        setBusiness(chip.business);
        setLocality(chip.locality);
        onSearch({ business: chip.business, locality: chip.locality, provider });
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-fade-in-up">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    {/* Business Type */}
                    <div className="md:col-span-5">
                        <input
                            type="text"
                            value={business}
                            onChange={(e) => setBusiness(e.target.value)}
                            placeholder="e.g., Chartered Accountants, Law Firms..."
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Locality */}
                    <div className="md:col-span-4">
                        <input
                            type="text"
                            value={locality}
                            onChange={(e) => setLocality(e.target.value)}
                            placeholder="e.g., Connaught Place Delhi, 110001..."
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Provider Select */}
                    <div className="md:col-span-2">
                        <select
                            value={provider}
                            onChange={(e) => setProvider(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                        >
                            <option value="google">Google Places</option>
                            <option value="serpapi">SerpAPI</option>
                        </select>
                    </div>

                    {/* Search Button */}
                    <div className="md:col-span-1">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-full min-h-[48px] bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white rounded-lg flex items-center justify-center transition-colors duration-150"
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
            </form>

            {/* Quick Search Chips */}
            <div className="flex flex-wrap gap-2 mt-4">
                {QUICK_CHIPS.map((chip) => (
                    <button
                        key={chip.label}
                        onClick={() => handleChipClick(chip)}
                        className="px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-brand-50 hover:text-brand-600 rounded-full border border-slate-200 hover:border-brand-300 transition-all duration-150"
                    >
                        {chip.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
