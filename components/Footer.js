"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 text-center">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-slate-400 mb-3">
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
      <p className="text-sm text-slate-400 mb-2">
        India:{" "}
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
        {" | "}
        <Link href="/leads/jaipur" className="text-slate-400 hover:text-[#22c55e] transition-colors">Jaipur</Link>
        {" | "}
        <Link href="/leads/pune" className="text-slate-400 hover:text-[#22c55e] transition-colors">Pune</Link>
        {" | "}
        <Link href="/leads/kolkata" className="text-slate-400 hover:text-[#22c55e] transition-colors">Kolkata</Link>
        {" | "}
        <Link href="/leads/ahmedabad" className="text-slate-400 hover:text-[#22c55e] transition-colors">Ahmedabad</Link>
        {" | "}
        <Link href="/leads/indore" className="text-slate-400 hover:text-[#22c55e] transition-colors">Indore</Link>
        {" | "}
        <Link href="/leads/lucknow" className="text-slate-400 hover:text-[#22c55e] transition-colors">Lucknow</Link>
        {" | "}
        <Link href="/leads/chandigarh" className="text-slate-400 hover:text-[#22c55e] transition-colors">Chandigarh</Link>
        {" | "}
        <Link href="/leads/noida" className="text-slate-400 hover:text-[#22c55e] transition-colors">Noida</Link>
        {" | "}
        <Link href="/leads/kochi" className="text-slate-400 hover:text-[#22c55e] transition-colors">Kochi</Link>
        {" | "}
        <Link href="/leads/coimbatore" className="text-slate-400 hover:text-[#22c55e] transition-colors">Coimbatore</Link>
        {" | "}
        <Link href="/leads/nagpur" className="text-slate-400 hover:text-[#22c55e] transition-colors">Nagpur</Link>
        {" | "}
        <Link href="/leads/surat" className="text-slate-400 hover:text-[#22c55e] transition-colors">Surat</Link>
        {" | "}
        <Link href="/leads/vadodara" className="text-slate-400 hover:text-[#22c55e] transition-colors">Vadodara</Link>
        {" | "}
        <Link href="/leads/bhopal" className="text-slate-400 hover:text-[#22c55e] transition-colors">Bhopal</Link>
        {" | "}
        <Link href="/leads/visakhapatnam" className="text-slate-400 hover:text-[#22c55e] transition-colors">Visakhapatnam</Link>
      </p>
      <p className="text-sm text-slate-400 mb-2">
        Global:{" "}
        <Link href="/leads/dubai" className="text-slate-400 hover:text-[#22c55e] transition-colors">Dubai</Link>
        {" | "}
        <Link href="/leads/london" className="text-slate-400 hover:text-[#22c55e] transition-colors">London</Link>
        {" | "}
        <Link href="/leads/new-york" className="text-slate-400 hover:text-[#22c55e] transition-colors">New York</Link>
        {" | "}
        <Link href="/leads/tokyo" className="text-slate-400 hover:text-[#22c55e] transition-colors">Tokyo</Link>
        {" | "}
        <Link href="/leads/singapore" className="text-slate-400 hover:text-[#22c55e] transition-colors">Singapore</Link>
        {" | "}
        <Link href="/leads/sydney" className="text-slate-400 hover:text-[#22c55e] transition-colors">Sydney</Link>
        {" | "}
        <Link href="/leads/toronto" className="text-slate-400 hover:text-[#22c55e] transition-colors">Toronto</Link>
        {" | "}
        <Link href="/leads/paris" className="text-slate-400 hover:text-[#22c55e] transition-colors">Paris</Link>
        {" | "}
        <Link href="/leads/abu-dhabi" className="text-slate-400 hover:text-[#22c55e] transition-colors">Abu Dhabi</Link>
        {" | "}
        <Link href="/leads/sharjah" className="text-slate-400 hover:text-[#22c55e] transition-colors">Sharjah</Link>
        {" | "}
        <Link href="/leads/riyadh" className="text-slate-400 hover:text-[#22c55e] transition-colors">Riyadh</Link>
        {" | "}
        <Link href="/leads/jeddah" className="text-slate-400 hover:text-[#22c55e] transition-colors">Jeddah</Link>
        {" | "}
        <Link href="/leads/melbourne" className="text-slate-400 hover:text-[#22c55e] transition-colors">Melbourne</Link>
        {" | "}
        <Link href="/leads/vancouver" className="text-slate-400 hover:text-[#22c55e] transition-colors">Vancouver</Link>
        {" | "}
        <Link href="/leads/los-angeles" className="text-slate-400 hover:text-[#22c55e] transition-colors">Los Angeles</Link>
        {" | "}
        <Link href="/leads/chicago" className="text-slate-400 hover:text-[#22c55e] transition-colors">Chicago</Link>
        {" | "}
        <Link href="/leads/manchester" className="text-slate-400 hover:text-[#22c55e] transition-colors">Manchester</Link>
        {" | "}
        <Link href="/leads/berlin" className="text-slate-400 hover:text-[#22c55e] transition-colors">Berlin</Link>
      </p>
      <p className="text-sm text-slate-400 mb-2">
        🔒 Your data is secure. We never sell or share user information.
      </p>
      <p className="text-xs text-slate-600 mb-2">
        SSL Encrypted | Official Google Places API
      </p>
      <p className="text-sm text-slate-400">
        © 2026 Geonayan
      </p>
    </footer>
  );
}
