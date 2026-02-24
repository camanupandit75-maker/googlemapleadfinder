"use client";

export default function StatCard({ label, value, color = "text-brand-500" }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 animate-fade-in-up">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                {label}
            </p>
            <p className={`text-3xl font-display font-bold ${color}`}>{value}</p>
        </div>
    );
}
