"use client";

export default function CreditBadge({ credits = 0 }) {
    return (
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-brand-600 text-sm font-semibold px-3.5 py-1.5 rounded-full animate-pulse-glow">
            <span>🪙</span>
            <span>{credits} credit{credits !== 1 ? "s" : ""}</span>
        </div>
    );
}
