"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 text-center">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-slate-500 mb-3">
        <Link href="/about" className="text-slate-400 hover:text-[#22c55e] transition-colors">
          About
        </Link>
        <span className="text-slate-600">|</span>
        <Link href="/disclaimer" className="text-slate-400 hover:text-[#22c55e] transition-colors">
          Disclaimer
        </Link>
        <span className="text-slate-600">|</span>
        <Link href="/testimonials" className="text-slate-400 hover:text-[#22c55e] transition-colors">
          Testimonials
        </Link>
      </div>
      <p className="text-sm text-slate-500">
        © {new Date().getFullYear()} LeadFinder · Built by Trutech Finance Consultants
      </p>
    </footer>
  );
}
