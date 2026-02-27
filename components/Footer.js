"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 text-center">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-slate-500 mb-3">
        <Link href="/privacy" className="text-slate-400 hover:text-[#22c55e] transition-colors">
          Privacy Policy
        </Link>
        <span className="text-slate-600">|</span>
        <Link href="/terms" className="text-slate-400 hover:text-[#22c55e] transition-colors">
          Terms of Service
        </Link>
        <span className="text-slate-600">|</span>
        <Link href="/disclaimer" className="text-slate-400 hover:text-[#22c55e] transition-colors">
          Disclaimer
        </Link>
        <span className="text-slate-600">|</span>
        <Link href="/about" className="text-slate-400 hover:text-[#22c55e] transition-colors">
          About
        </Link>
      </div>
      <p className="text-sm text-slate-500 mb-2">
        Find Leads in:{" "}
        <Link href="/leads/mumbai" className="text-slate-400 hover:text-[#22c55e] transition-colors">Mumbai</Link>
        {" | "}
        <Link href="/leads/delhi" className="text-slate-400 hover:text-[#22c55e] transition-colors">Delhi</Link>
        {" | "}
        <Link href="/leads/bangalore" className="text-slate-400 hover:text-[#22c55e] transition-colors">Bangalore</Link>
        {" | "}
        <Link href="/leads/gurgaon" className="text-slate-400 hover:text-[#22c55e] transition-colors">Gurgaon</Link>
        {" | "}
        <Link href="/leads/chennai" className="text-slate-400 hover:text-[#22c55e] transition-colors">Chennai</Link>
        {" | "}
        <Link href="/leads/hyderabad" className="text-slate-400 hover:text-[#22c55e] transition-colors">Hyderabad</Link>
      </p>
      <p className="text-sm text-slate-500 mb-2">
        🔒 Your data is secure. We never sell or share user information.
      </p>
      <p className="text-xs text-slate-600 mb-2">
        SSL Encrypted | Official Google Places API
      </p>
      <p className="text-sm text-slate-500">
        © 2026 Geonayan
      </p>
    </footer>
  );
}
