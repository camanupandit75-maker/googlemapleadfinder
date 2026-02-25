"use client";

export default function PackageCard({ pkg, popular = false, onBuy, variant = "light" }) {
    const isDark = variant === "dark";
    return (
        <div
            className={`relative rounded-2xl border p-6 transition-all duration-200 hover:scale-[1.03] ${popular
                    ? "border-[#22c55e] bg-white/10 shadow-lg shadow-brand-500/10"
                    : isDark
                        ? "border-white/10 bg-white/5 hover:border-white/20"
                        : "border-slate-200 bg-white hover:border-slate-300"
                }`}
        >
            {popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#22c55e] text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                    </span>
                </div>
            )}

            <div className="mb-4">
                <h3 className={`font-display font-bold text-lg ${isDark ? "text-white" : "text-slate-900"}`}>
                    {pkg.name}
                </h3>
                <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {pkg.credits} search credits
                </p>
            </div>

            <div className="mb-4">
                <span className={`text-3xl font-display font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                    ₹{pkg.price.toLocaleString("en-IN")}
                </span>
                <span className={`text-sm ml-1.5 ${isDark ? "text-slate-500" : "text-slate-500"}`}>one-time</span>
            </div>

            <p className={`text-xs mb-5 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                ₹{(pkg.price / pkg.credits).toFixed(1)} per search
            </p>

            <ul className="space-y-2.5 mb-6">
                {pkg.features.map((feature, idx) => (
                    <li key={idx} className={`flex items-center gap-2 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        <span className="text-[#22c55e] text-xs">✓</span>
                        {feature}
                    </li>
                ))}
            </ul>

            <button
                onClick={() => onBuy?.(pkg)}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 ${popular
                        ? "bg-[#22c55e] hover:bg-brand-600 text-white"
                        : isDark
                            ? "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                            : "bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-600 border border-slate-200"
                    }`}
            >
                {onBuy ? "Buy Now" : "Get Started"}
            </button>
        </div>
    );
}
