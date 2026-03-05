"use client";

import Link from "next/link";

export default function Navbar({ variant = "dark" }) {
    const isDark = variant === "dark";

    return (
        <nav
            className={`w-full px-6 py-4 flex items-center justify-between ${isDark ? "bg-transparent" : "bg-white border-b border-slate-200"
                }`}
        >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-display font-bold text-sm">GN</span>
                </div>
                <span
                    className={`font-display font-bold text-lg ${isDark ? "text-white" : "text-slate-900"
                        }`}
                >
                    Geonayan
                </span>
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-4">
                <Link
                    href="/login"
                    className={`text-sm font-medium transition-colors duration-150 ${isDark
                            ? "text-slate-300 hover:text-white"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                >
                    Log in
                </Link>
        <Link
          href="/demo"
          className={`text-sm font-medium transition-colors duration-150 ${isDark
            ? "text-slate-300 hover:text-white"
            : "text-slate-600 hover:text-slate-900"
            }`}
        >
          Request Demo
        </Link>
                <Link
                    href="/signup"
                    className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors duration-150"
                >
                    Get Started Free
                </Link>
            </div>
        </nav>
    );
}
