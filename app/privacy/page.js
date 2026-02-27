"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar variant="dark" />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-3xl text-white mb-8 text-center">Privacy Policy</h1>
        <p className="text-slate-400 leading-relaxed mb-6">
          Your data is secure. Geonayan does not sell or share user information with third parties.
          We use your account data only to provide the service (credits, search history, profile) and to comply with applicable law.
        </p>
        <p className="text-slate-500 text-sm">Last updated: February 2026</p>
      </main>
      <Footer />
    </div>
  );
}
