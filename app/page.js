"use client";

import Link from "next/link";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FEATURES = [
  { emoji: "🔍", title: "Search Any Locality", desc: "Enter any PIN code, city, or area name to find businesses listed on Google Maps." },
  { emoji: "📊", title: "Rich Data Extraction", desc: "Get phone numbers, addresses, websites, ratings, and review counts for every result." },
  { emoji: "📥", title: "Excel Export", desc: "Download all results as a formatted Excel or CSV file with a single click." },
  { emoji: "💳", title: "Pay Per Search", desc: "No monthly subscriptions. Buy credits and use them whenever you want." },
  { emoji: "⚡", title: "Search once, access forever", desc: "Repeat searches pull cached data at zero cost — saving your credits." },
  { emoji: "🔗", title: "Maximum Coverage", desc: "Always up-to-date data from multiple sources so you never miss a lead." },
];

const DIFFERENT = [
  { emoji: "🗺️", title: "Market Heatmap", desc: "See business density across any city. Find underserved areas or competitive hotspots." },
  { emoji: "🏢", title: "Career Scanner", desc: "Find which businesses are actively hiring. Filter by job titles and confidence." },
  { emoji: "🔥", title: "AI Lead Scoring", desc: "Instantly know which leads to contact first. Prioritize by rating, reviews, and data quality." },
  { emoji: "📧", title: "Email Enrichment", desc: "Extract emails directly from business websites. No manual hunting." },
];

const TESTIMONIALS_HOME = [
  {
    quote: "We used to spend 2 days building a list of CAs in Mumbai for our audit panel. Geonayan did it in 5 minutes with emails included.",
    name: "Rohit Mehta",
    designation: "Partner",
    company: "Tax Advisory Firm, Mumbai",
  },
  {
    quote: "The market heatmap showed us exactly which areas in Delhi had fewer tax consultants. We opened our second branch in Dwarka based on that data.",
    name: "Priya Sharma",
    designation: "Founder",
    company: "Sharma Tax Consultants, Delhi",
  },
  {
    quote: "Exporting 200 leads with phone numbers and emails to Excel in one click? This saves our BD team hours every week.",
    name: "Amit Verma",
    designation: "Business Development Head",
    company: "Legal Services Firm, Bangalore",
  },
];

const USE_CASES = [
  { title: "Chartered Accountants", desc: "Find potential clients or audit panel firms in any city in 5 minutes." },
  { title: "Sales & BD Teams", desc: "Build a 200-contact prospect list without manual searching." },
  { title: "Recruiters", desc: "Discover which firms are hiring in your target area." },
  { title: "Startups & SMBs", desc: "Research competitors and vendors by locality." },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-[#22c55e]" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="text-sm">★</span>
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar variant="dark" />
      <Script
        id="geonayan-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Geonayan",
            url: "https://www.geonayan.com",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description:
              "B2B lead generation tool for India. Search any PIN code or city to find business leads from Google Maps with phone numbers, emails, ratings. Export to Excel.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "INR",
              description: "10 free searches on signup",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "8",
            },
          }),
        }}
      />

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center animate-fade-in-up">
        <h1 className="font-display font-extrabold text-5xl md:text-6xl leading-tight mb-6 tracking-tight">
          Get 10 Free Business Leads{" "}
          <span className="text-brand-400">— No Credit Card Required</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Search any locality or PIN code. Get phone numbers, emails, ratings — exported to Excel in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
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

        {/* Social proof stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
          <div>
            <p className="text-2xl md:text-3xl font-display font-bold text-white">35,000+</p>
            <p className="text-sm text-slate-500">Searches Powered</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-display font-bold text-white">800+</p>
            <p className="text-sm text-slate-500">Results Exported</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-display font-bold text-white">6</p>
            <p className="text-sm text-slate-500">Cities Mapped</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="font-display font-bold text-3xl text-center mb-8 animate-fade-in">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group glass-card p-6 transition-all duration-200 animate-fade-in-up hover:border-brand-500/50"
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

      {/* Pricing anchor */}
      <section className="max-w-2xl mx-auto px-6 pb-16 text-center">
        <h2 className="font-display font-bold text-3xl text-center mb-4">
          Pricing
        </h2>
        <p className="text-slate-400 text-lg mb-4">
          Credits start at just ₹10 per search. No subscription. No commitment.
        </p>
        <Link
          href="/pricing"
          className="text-brand-400 hover:text-brand-300 font-semibold inline-flex items-center gap-1"
        >
          View Pricing →
        </Link>
      </section>

      {/* What makes Geonayan different */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="font-display font-bold text-3xl text-center mb-10 animate-fade-in">
          What makes Geonayan different?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {DIFFERENT.map((d, i) => (
            <div
              key={d.title}
              className="group glass-card p-6 transition-all duration-200 animate-fade-in-up hover:border-brand-500/50"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="text-2xl mb-3 block">{d.emoji}</span>
              <h3 className="font-display font-semibold text-base text-white mb-2">
                {d.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials (top 3) */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="font-display font-bold text-3xl text-center mb-4">Testimonials</h2>
        <p className="text-slate-400 text-center mb-10 max-w-xl mx-auto">
          Trusted by CAs, sales teams, and recruiters across India and UAE.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS_HOME.map((t, i) => (
            <div
              key={i}
              className="glass-card p-6 animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <p className="text-slate-300 text-base leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
              <Stars />
              <h3 className="font-semibold text-white mt-3 text-base">{t.name}</h3>
              <p className="text-sm text-slate-500">{t.designation}, {t.company}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-8">
          <Link href="/testimonials" className="text-brand-400 hover:text-brand-300 font-medium">
            Read more testimonials →
          </Link>
        </p>
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
              className="border-l-4 border-brand-500 glass-card rounded-r-2xl pl-5 pr-6 py-5 animate-fade-in-up"
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
