"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PACKAGES = [
    { id: "starter", name: "Starter", credits: 50, price: 499, features: ["50 search credits", "Export to Excel & CSV", "Google Places + SerpAPI", "Email support", "Cached results at 0 cost"] },
    { id: "growth", name: "Growth", credits: 200, price: 1499, features: ["200 search credits", "Export to Excel & CSV", "Google Places + SerpAPI", "Priority support", "Cached results at 0 cost", "Bulk export"] },
    { id: "pro", name: "Pro", credits: 500, price: 2999, features: ["500 search credits", "Export to Excel & CSV", "Google Places + SerpAPI", "Priority support", "Cached results at 0 cost", "Bulk export"] },
    { id: "enterprise", name: "Enterprise", credits: 2000, price: 9999, features: ["2,000 search credits", "Export to Excel & CSV", "All providers", "Dedicated support", "Cached results at 0 cost", "Bulk export", "API access"] },
];

const FAQS = [
    { q: "What counts as 1 credit?", a: "1 credit = 1 search query. Each search returns up to 20 results with full contact details. If the same query was searched before and is cached, it costs 0 credits." },
    { q: "Do credits expire?", a: "No, credits never expire. Buy once and use them whenever you want — there's no time limit." },
    { q: "What data do I get?", a: "Every result includes: business name, category, phone number, full address, website URL, Google Maps link, star rating, and number of reviews." },
    { q: "Which countries are supported?", a: "LeadFinder works globally — any locality that Google Maps covers. This includes India, UAE, USA, UK, Australia, and 200+ other countries." },
    { q: "Can I get a refund?", a: "Since credits are delivered instantly and are digital in nature, we don't offer refunds. However, unused credits never expire so you can use them anytime." },
];

export default function PricingPage() {
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navbar variant="dark" />

            {/* ── Header ─────────────────────────────────────────────────────────── */}
            <section className="max-w-5xl mx-auto px-6 pt-16 pb-4 text-center animate-fade-in-up">
                <h1 className="font-display font-extrabold text-4xl md:text-5xl mb-4 tracking-tight">
                    Simple, Pay-As-You-Go Pricing
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-6">
                    No subscriptions, no hidden fees. Buy credits once and use them whenever you want.
                </p>
                <span className="inline-block bg-brand-500/10 text-brand-400 text-sm font-medium px-4 py-1.5 rounded-full border border-brand-500/20">
                    10 free credits on signup — no card required
                </span>
            </section>

            {/* ── Pricing Grid ───────────────────────────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {PACKAGES.map((pkg, i) => {
                        const isPopular = pkg.id === "growth";
                        return (
                            <div
                                key={pkg.id}
                                className={`relative rounded-2xl border p-6 transition-all duration-200 hover:scale-105 animate-fade-in-up ${isPopular
                                        ? "border-brand-500 bg-white/10 shadow-lg shadow-brand-500/10"
                                        : "border-white/10 bg-white/5 hover:border-white/20"
                                    }`}
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                {isPopular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="bg-brand-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <h3 className="font-display font-bold text-lg text-white mb-1">
                                    {pkg.name}
                                </h3>
                                <p className="text-sm text-slate-400 mb-4">
                                    {pkg.credits} search credits
                                </p>

                                <div className="mb-4">
                                    <span className="text-4xl font-display font-bold text-white">
                                        ₹{pkg.price.toLocaleString("en-IN")}
                                    </span>
                                    <span className="text-sm text-slate-500 ml-1.5">one-time</span>
                                </div>

                                <p className="text-xs text-slate-500 mb-6">
                                    ₹{(pkg.price / pkg.credits).toFixed(1)} per search
                                </p>

                                <ul className="space-y-2.5 mb-6">
                                    {pkg.features.map((f, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                                            <span className="text-brand-400 text-xs">✓</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/signup"
                                    className={`block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 ${isPopular
                                            ? "bg-brand-500 hover:bg-brand-600 text-white"
                                            : "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                                        }`}
                                >
                                    Get Started
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── FAQ ────────────────────────────────────────────────────────────── */}
            <section className="max-w-3xl mx-auto px-6 pb-24">
                <h2 className="font-display font-bold text-2xl text-center mb-10 animate-fade-in">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                    {FAQS.map((faq, i) => (
                        <div
                            key={i}
                            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden animate-fade-in-up"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center justify-between px-6 py-4 text-left"
                            >
                                <span className="font-medium text-sm text-white">{faq.q}</span>
                                <span className={`text-slate-400 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}>
                                    ▾
                                </span>
                            </button>
                            {openFaq === i && (
                                <div className="px-6 pb-4">
                                    <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
