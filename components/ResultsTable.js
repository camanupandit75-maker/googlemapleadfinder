"use client";

export default function ResultsTable({ results = [] }) {
    if (results.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-10">#</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[200px]">Business Name</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[140px]">Category</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[120px]">Rating</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[130px]">Phone</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[200px]">Address</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-20">Website</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">Map</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((item, index) => (
                            <tr
                                key={index}
                                className="border-b border-slate-50 hover:bg-emerald-50/50 transition-colors duration-150 stagger-row"
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <td className="px-4 py-3.5 text-slate-400 font-medium">{index + 1}</td>
                                <td className="px-4 py-3.5 font-semibold text-slate-900">{item.name}</td>
                                <td className="px-4 py-3.5 text-slate-600">{item.category}</td>
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-amber-400">★</span>
                                        <span className="font-medium text-slate-900">{item.rating}</span>
                                        <span className="text-slate-400 text-xs">({item.reviews})</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3.5">
                                    {item.phone ? (
                                        <a
                                            href={`tel:${item.phone}`}
                                            className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1 transition-colors"
                                        >
                                            <span className="text-xs">📞</span>
                                            {item.phone}
                                        </a>
                                    ) : (
                                        <span className="text-slate-400">—</span>
                                    )}
                                </td>
                                <td className="px-4 py-3.5 text-slate-600 max-w-[220px]">
                                    <p className="line-clamp-2">{item.address}</p>
                                </td>
                                <td className="px-4 py-3.5">
                                    {item.website ? (
                                        <a
                                            href={item.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors"
                                        >
                                            🌐 Visit
                                        </a>
                                    ) : (
                                        <span className="text-slate-400">—</span>
                                    )}
                                </td>
                                <td className="px-4 py-3.5">
                                    {item.mapUrl ? (
                                        <a
                                            href={item.mapUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-slate-500 hover:text-brand-600 transition-colors"
                                        >
                                            📍
                                        </a>
                                    ) : (
                                        <span className="text-slate-400">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
