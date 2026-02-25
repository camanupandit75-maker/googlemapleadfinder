"use client";

export default function CreditBadge({ credits = 0, variant = "light" }) {
    const isDark = variant === "dark";
    return (
        <div className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-1.5 rounded-full animate-pulse-glow ${isDark ? "bg-brand-500/10 text-[#22c55e] border border-brand-500/20" : "bg-emerald-50 text-brand-600"}`}>
            <span>🪙</span>
            <span>{credits} credit{credits !== 1 ? "s" : ""}</span>
        </div>
    );
}
