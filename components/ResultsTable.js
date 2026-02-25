"use client";

export default function ResultsTable({ results = [], showEnrichedColumns = false, showSourceQuery = false, variant = "light" }) {
    if (results.length === 0) return null;

    const hasEnriched = showEnrichedColumns && results.some((r) => r.enrichment_status || r.enriched_emails?.length);
    const isDark = variant === "dark";

    const tableWrap = isDark ? "bg-white/5 rounded-2xl border border-white/10 overflow-hidden animate-fade-in" : "bg-white rounded-2xl border border-slate-200 overflow-hidden animate-fade-in";
    const theadTr = isDark ? "border-b border-white/10 bg-white/5" : "border-b border-slate-100 bg-slate-50";
    const thClass = isDark ? "px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider" : "px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider";
    const rowClass = isDark ? "border-b border-white/10 hover:bg-white/5 transition-colors duration-150 stagger-row" : "border-b border-slate-50 hover:bg-emerald-50/50 transition-colors duration-150 stagger-row";
    const tdMuted = isDark ? "text-slate-400" : "text-slate-400";
    const tdMain = isDark ? "text-white" : "text-slate-900";
    const tdSec = isDark ? "text-slate-300" : "text-slate-600";

    return (
        <div className={tableWrap}>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className={theadTr}>
                            <th className={`${thClass} w-10`}>#</th>
                            {showSourceQuery && (
                                <th className={`${thClass} min-w-[180px]`}>Source Query</th>
                            )}
                            <th className={`${thClass} min-w-[200px]`}>Business Name</th>
                            <th className={`${thClass} min-w-[140px]`}>Category</th>
                            <th className={`${thClass} min-w-[120px]`}>Rating</th>
                            <th className={`${thClass} min-w-[130px]`}>Phone</th>
                            <th className={`${thClass} min-w-[200px]`}>Address</th>
                            <th className={`${thClass} w-20`}>Website</th>
                            {hasEnriched && (
                                <>
                                    <th className={`${thClass} min-w-[140px]`}>Email</th>
                                    <th className={`${thClass} w-20`}>WhatsApp</th>
                                    <th className={`${thClass} w-24`}>Socials</th>
                                </>
                            )}
                            <th className={`${thClass} w-16`}>Map</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((item, index) => (
                            <tr
                                key={index}
                                className={rowClass}
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <td className={`px-4 py-3.5 ${tdMuted} font-medium`}>{index + 1}</td>
                                {showSourceQuery && (
                                    <td className={`px-4 py-3.5 ${tdSec} text-xs`}>
                                        {[item.source_query, item.source_location].filter(Boolean).join(" · ") || "—"}
                                    </td>
                                )}
                                <td className={`px-4 py-3.5 font-semibold ${tdMain}`}>
                                    <span className="flex items-center gap-1.5">
                                        {hasEnriched && item.enrichment_status === "found" && (
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Enriched" />
                                        )}
                                        {hasEnriched && item.enrichment_status === "error" && (
                                            <span className="text-amber-500" title="Enrichment error">⚠</span>
                                        )}
                                        {item.name}
                                    </span>
                                </td>
                                <td className={`px-4 py-3.5 ${tdSec}`}>{item.category}</td>
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-amber-400">★</span>
                                        <span className={`font-medium ${tdMain}`}>{item.rating}</span>
                                        <span className={`${tdMuted} text-xs`}>({item.reviews})</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3.5">
                                    {item.phone ? (
                                        <a
                                            href={`tel:${item.phone}`}
                                            className="text-[#22c55e] hover:text-brand-400 font-medium flex items-center gap-1 transition-colors"
                                        >
                                            <span className="text-xs">📞</span>
                                            {item.phone}
                                        </a>
                                    ) : (
                                        <span className={tdMuted}>—</span>
                                    )}
                                </td>
                                <td className={`px-4 py-3.5 ${tdSec} max-w-[220px]`}>
                                    <p className="line-clamp-2">{item.address}</p>
                                </td>
                                <td className="px-4 py-3.5">
                                    {item.website ? (
                                        <a
                                            href={item.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
                                        >
                                            🌐 Visit
                                        </a>
                                    ) : (
                                        <span className={tdMuted}>—</span>
                                    )}
                                </td>
                                {hasEnriched && (
                                    <>
                                        <td className="px-4 py-3.5">
                                            {item.enriched_emails?.length > 0 ? (
                                                <span className={isDark ? "bg-[#22c55e]/10 px-2 py-1 rounded" : "bg-emerald-50 px-2 py-1 rounded"}>
                                                    <a
                                                        href={`mailto:${item.enriched_emails[0]}`}
                                                        className="text-[#22c55e] hover:text-brand-400 font-medium"
                                                    >
                                                        {item.enriched_emails[0]}
                                                    </a>
                                                    {item.enriched_emails.length > 1 && (
                                                        <span className={`${isDark ? "text-slate-500" : "text-slate-500"} text-xs ml-1`}>(+{item.enriched_emails.length - 1})</span>
                                                    )}
                                                </span>
                                            ) : item.enrichment_status === "no_data" ? (
                                                <span className={tdMuted}>—</span>
                                            ) : item.enrichment_status === "error" ? (
                                                <span className="text-amber-500" title="Error">⚠</span>
                                            ) : (
                                                <span className={tdMuted}>—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {item.enriched_whatsapp?.length > 0 ? (
                                                <a
                                                    href={`https://wa.me/${item.enriched_whatsapp[0]}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#22c55e] text-white hover:bg-brand-600 transition-colors"
                                                    title="WhatsApp"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                                </a>
                                            ) : (
                                                <span className={tdMuted}>—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-1">
                                                {item.enriched_linkedin?.[0] && (
                                                    <a href={item.enriched_linkedin[0]} target="_blank" rel="noopener noreferrer" className="text-[#0A66C2] hover:opacity-80" title="LinkedIn">in</a>
                                                )}
                                                {item.enriched_twitter?.[0] && (
                                                    <a href={item.enriched_twitter[0]} target="_blank" rel="noopener noreferrer" className={isDark ? "text-slate-400 hover:text-sky-400" : "text-slate-600 hover:text-sky-500"} title="Twitter/X">𝕏</a>
                                                )}
                                                {item.enriched_facebook?.[0] && (
                                                    <a href={item.enriched_facebook[0]} target="_blank" rel="noopener noreferrer" className="text-[#1877F2] hover:opacity-80" title="Facebook">f</a>
                                                )}
                                                {!(item.enriched_linkedin?.[0] || item.enriched_twitter?.[0] || item.enriched_facebook?.[0]) && (
                                                    <span className={tdMuted}>—</span>
                                                )}
                                            </div>
                                        </td>
                                    </>
                                )}
                                <td className="px-4 py-3.5">
                                    {item.mapUrl ? (
                                        <a
                                            href={item.mapUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`${isDark ? "text-slate-400 hover:text-[#22c55e]" : "text-slate-500 hover:text-brand-600"} transition-colors`}
                                        >
                                            📍
                                        </a>
                                    ) : (
                                        <span className={tdMuted}>—</span>
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
