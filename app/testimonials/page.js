"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TESTIMONIALS = [
  {
    quote: "We used to spend 2 days building a list of CAs in Mumbai for our audit panel. Geonayan did it in 5 minutes with emails included.",
    name: "Rohit Mehta",
    designation: "Partner",
    company: "Tax Advisory Firm, Mumbai",
  },
  {
    quote: "The market heatmap showed us exactly which areas in Delhi had fewer tax consultants. We opened our second branch in Dwarka based on that data.",
    name: "Priya Sharma",
    designation: "Founder",
    company: "Sharma Tax Consultants, Delhi",
  },
  {
    quote: "Exporting 200 leads with phone numbers and emails to Excel in one click? This saves our BD team hours every week.",
    name: "Amit Verma",
    designation: "Business Development Head",
    company: "Legal Services Firm, Bangalore",
  },
  {
    quote: "We needed CA firms across 30 PIN codes for a compliance project. The bulk upload feature handled it all in one go.",
    name: "Sneha Kapoor",
    designation: "Operations Manager",
    company: "Fintech Startup, Gurgaon",
  },
  {
    quote: "The email enrichment is surprisingly accurate. Got valid emails for about half the firms — that's gold for cold outreach.",
    name: "Karan Singh",
    designation: "Sales Lead",
    company: "SaaS Company, Hyderabad",
  },
  {
    quote: "Our recruitment team uses it to find accounting firms hiring in specific areas. The data quality is much better than JustDial.",
    name: "Meera Iyer",
    designation: "HR Manager",
    company: "Staffing Agency, Chennai",
  },
  {
    quote: "I'm a CA myself. I used the heatmap to check competition before opening my practice. Saved me from a saturated market.",
    name: "CA Deepak Agarwal",
    designation: "Practicing CA",
    company: "Noida",
  },
  {
    quote: "We serve clients in Dubai and India. Geonayan works for both markets. The Dubai locality scan was spot on.",
    name: "Faisal Khan",
    designation: "CFO Services",
    company: "Dubai",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-[#22c55e]" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="text-sm">★</span>
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar variant="dark" />

      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-3xl text-white mb-4 text-center">Testimonials</h1>
        <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
          What professionals are saying about Geonayan
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="glass-card p-6 animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <p className="text-slate-300 text-lg leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
              <Stars />
              <p className="font-semibold text-white mt-3">{t.name}</p>
              <p className="text-sm text-slate-500">{t.designation}, {t.company}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
