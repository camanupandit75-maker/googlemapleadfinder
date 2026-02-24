"use client";

export default function PackageCard({ pkg, popular = false, onBuy }) {
    return (
        <div
            className={`relative rounded-2xl border p-6 transition-all duration-200 hover:scale-[1.03] ${popular
                    ? "border-brand-500 bg-white shadow-lg shadow-brand-100"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
        >
            {/* Popular Badge */}
            {popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                    </span>
                </div>
            )}

            {/* Package Info */}
            <div className="mb-4">
                <h3 className="font-display font-bold text-lg text-slate-900">
                    {pkg.name}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                    {pkg.credits} search credits
                </p>
            </div>

            {/* Price */}
            <div className="mb-4">
                <span className="text-3xl font-display font-bold text-slate-900">
                    ₹{pkg.price.toLocaleString("en-IN")}
                </span>
                <span className="text-sm text-slate-500 ml-1.5">one-time</span>
            </div>

            {/* Per Search Cost */}
            <p className="text-xs text-slate-500 mb-5">
                ₹{(pkg.price / pkg.credits).toFixed(1)} per search
            </p>

            {/* Features */}
            <ul className="space-y-2.5 mb-6">
                {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                        <span className="text-brand-500 text-xs">✓</span>
                        {feature}
                    </li>
                ))}
            </ul>

            {/* CTA Button */}
            <button
                onClick={() => onBuy?.(pkg)}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 ${popular
                        ? "bg-brand-500 hover:bg-brand-600 text-white"
                        : "bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-600 border border-slate-200"
                    }`}
            >
                {onBuy ? "Buy Now" : "Get Started"}
            </button>
        </div>
    );
}
