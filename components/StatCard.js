"use client";

export default function StatCard({ label, value, color = "text-brand-500", variant = "light" }) {
    const isDark = variant === "dark";
    return (
        <div className={`p-5 animate-fade-in-up ${isDark ? "glass-card" : "rounded-2xl border bg-white border-slate-200"}`}>
            <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {label}
            </p>
            <p className={`text-3xl font-display font-bold ${color}`}>{value}</p>
        </div>
    );
}
