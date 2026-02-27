"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar variant="dark" />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-3xl text-white mb-8 text-center">Terms of Service</h1>
        <p className="text-slate-400 leading-relaxed mb-6">
          By using Geonayan you agree to use the service in compliance with applicable laws.
          Credits are non-refundable. See our <a href="/disclaimer" className="text-[#22c55e] hover:underline">Disclaimer</a> for data and accuracy terms.
        </p>
        <p className="text-slate-500 text-sm">Last updated: February 2026</p>
      </main>
      <Footer />
    </div>
  );
}
