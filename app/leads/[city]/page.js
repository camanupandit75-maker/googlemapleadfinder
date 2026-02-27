import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCityBySlug, getAllCitySlugs, getTestimonialsForCity } from "@/lib/city-leads-data";

export function generateStaticParams() {
  return getAllCitySlugs().map((city) => ({ city }));
}

export async function generateMetadata({ params }) {
  const cityData = getCityBySlug(params?.city);
  if (!cityData) return { title: "Find Business Leads | Geonayan" };
  return {
    title: cityData.metaTitle,
    description: cityData.metaDescription,
  };
}

function Stars() {
  return (
    <div className="flex gap-0.5 text-[#22c55e]" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="text-sm">★</span>
      ))}
    </div>
  );
}

export default function CityLeadsPage({ params }) {
  const cityData = getCityBySlug(params?.city);
  if (!cityData) notFound();

  const testimonials = getTestimonialsForCity(cityData.name);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar variant="dark" />

      <section className="max-w-3xl mx-auto px-6 pt-20 pb-10 text-center">
        <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-tight mb-6 tracking-tight">
          Find Business Leads in {cityData.name} — Chartered Accountants, Law Firms & More
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Search {cityData.name} by PIN code or locality. Get phone numbers, emails, ratings — export to Excel in seconds.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-12">
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">
            {cityData.content}
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-12">
        <h2 className="font-display font-bold text-2xl text-white mb-4">
          Localities covered in the {cityData.name} heatmap
        </h2>
        <ul className="flex flex-wrap gap-2">
          {cityData.localities.map((loc) => (
            <li key={loc}>
              <span className="inline-block px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm">
                {loc}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-16 text-center">
        <Link
          href="/signup"
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors duration-150 shadow-lg shadow-brand-500/25"
        >
          Start Searching in {cityData.name} →
        </Link>
        <p className="text-slate-500 text-sm mt-3">10 free searches on signup — no credit card required</p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="font-display font-bold text-2xl text-center mb-6">What professionals say about Geonayan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card p-6">
              <p className="text-slate-300 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
              <Stars />
              <p className="font-semibold text-white mt-3 text-sm">{t.name}</p>
              <p className="text-xs text-slate-500">{t.designation}, {t.company}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-6">
          <Link href="/testimonials" className="text-brand-400 hover:text-brand-300 font-medium text-sm">
            Read more testimonials →
          </Link>
        </p>
      </section>

      <Footer />
    </div>
  );
}
