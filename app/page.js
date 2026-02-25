"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FEATURES = [
  { emoji: "🔍", title: "Search Any Locality", desc: "Enter any PIN code, city, or area name to find businesses listed on Google Maps." },
  { emoji: "📊", title: "Rich Data Extraction", desc: "Get phone numbers, addresses, websites, ratings, and review counts for every result." },
  { emoji: "📥", title: "Excel Export", desc: "Download all results as a formatted Excel or CSV file with a single click." },
  { emoji: "💳", title: "Pay Per Search", desc: "No monthly subscriptions. Buy credits and use them whenever you want." },
  { emoji: "⚡", title: "Smart Caching", desc: "Repeat searches pull cached data at zero cost — saving your credits." },
  { emoji: "🔗", title: "Dual Provider", desc: "Switch between Google Places API and SerpAPI for maximum coverage." },
];

const USE_CASES = [
  { title: "Chartered Accountants", desc: "Find potential clients, audit targets, or partnership firms in any city." },
  { title: "Sales & BD Teams", desc: "Build targeted lead lists of businesses in specific localities for outreach." },
  { title: "Recruiters", desc: "Discover companies and hiring managers across industries and locations." },
  { title: "Startups & SMBs", desc: "Research competitors, vendors, and collaborators in your market area." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar variant="dark" />

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-24 text-center animate-fade-in-up">
        {/* Badge */}
        <div className="inline-block mb-6">
          <span className="bg-brand-500/10 text-brand-400 text-sm font-medium px-4 py-1.5 rounded-full border border-brand-500/20">
            10 free searches on signup
          </span>
        </div>

        <h1 className="font-display font-extrabold text-5xl md:text-6xl leading-tight mb-6 tracking-tight">
          Find business leads{" "}
          <span className="text-brand-400">from Google Maps</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Search any locality or PIN code to discover chartered accountants, law firms,
          restaurants, and thousands more. Get phone numbers, addresses, ratings —
          and export everything to Excel.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors duration-150 shadow-lg shadow-brand-500/25"
          >
            Start Searching — It&apos;s Free
          </Link>
          <Link
            href="/pricing"
            className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium px-8 py-3.5 rounded-xl text-base transition-all duration-150"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group bg-white/5 border border-white/10 hover:border-brand-500/50 rounded-xl p-6 transition-all duration-200 animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="text-2xl mb-3 block">{f.emoji}</span>
              <h3 className="font-display font-semibold text-base text-white mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <h2 className="font-display font-bold text-3xl text-center mb-10 animate-fade-in">
          Who is this for?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {USE_CASES.map((uc, i) => (
            <div
              key={uc.title}
              className="border-l-4 border-brand-500 bg-white/5 rounded-r-xl pl-5 pr-6 py-5 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <h3 className="font-display font-semibold text-lg text-white mb-1">
                {uc.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
