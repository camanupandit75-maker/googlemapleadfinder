"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const STATS = [
  { value: "35,000+", label: "searches powered monthly" },
  { value: "6 Cities", label: "with pre-built market maps" },
  { value: "40%", label: "average email extraction rate from business websites" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar variant="dark" />

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Hero */}
        <section className="text-center mb-16 animate-fade-in-up">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
            Built for professionals who need leads, not listings
          </h1>
        </section>

        {/* Story */}
        <section className="mb-14 animate-fade-in-up">
          <h2 className="font-display font-semibold text-lg text-white mb-3">Our Story</h2>
          <p className="text-slate-400 leading-relaxed">
            Geonayan was built by a Chartered Accountant who was tired of manually searching Google Maps for business contacts. What started as an internal tool for finding CA firms across India became a full-fledged business intelligence platform.
          </p>
        </section>

        {/* What we do */}
        <section className="mb-14 animate-fade-in-up">
          <h2 className="font-display font-semibold text-lg text-white mb-3">What We Do</h2>
          <p className="text-slate-400 leading-relaxed">
            We turn Google Maps data into actionable business leads — with verified emails, phone numbers, WhatsApp contacts, and market insights that help sales teams, recruiters, and consultants close deals faster.
          </p>
        </section>

        {/* Key stats */}
        <section className="mb-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="glass-card p-6 text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <p className="font-display font-bold text-2xl text-[#22c55e] mb-1">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-14 animate-fade-in-up">
          <h2 className="font-display font-semibold text-lg text-white mb-3">Team</h2>
          <p className="text-slate-400 leading-relaxed">
            Built by <span className="text-white font-medium">Bharat AI Academy</span> — serving clients across India and MENA.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center pt-4 animate-fade-in-up">
          <Link
            href="/signup"
            className="inline-block bg-[#22c55e] hover:bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
          >
            Start your first search — 10 free credits on signup
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
