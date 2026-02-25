"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SECTIONS = [
  { title: "Data Source", body: "LeadFinder retrieves publicly available business information from Google Maps via the official Google Places API. We do not scrape, hack, or access any private databases." },
  { title: "Email Extraction", body: "Emails and contact information are extracted from publicly accessible business websites. We only read information that businesses have published on their own websites for public contact." },
  { title: "Accuracy", body: "While we strive for accuracy, business information changes frequently. We cannot guarantee that all phone numbers, emails, or addresses are current. Users should verify critical information independently." },
  { title: "No Legal/Financial Advice", body: "LeadFinder is a data tool, not a legal or financial advisory service. We do not provide recommendations on contacting businesses or compliance with telemarketing/spam laws." },
  { title: "User Responsibility", body: "Users are responsible for complying with applicable laws including India's IT Act, TRAI DND regulations, GDPR (for EU contacts), and any local anti-spam laws when using extracted contact information for outreach." },
  { title: "Refund Policy", body: "Credits are non-refundable once purchased. Cached searches (repeat queries within 24 hours) do not consume credits." },
  { title: "Data Retention", body: "Search results are cached for 24 hours for performance. We do not sell or share user data with third parties." },
];

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar variant="dark" />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-3xl text-white mb-12 text-center">Disclaimer</h1>
        <div className="space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="font-display font-semibold text-lg text-white mb-2">{s.title}</h2>
              <p className="text-slate-400 leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
        <section className="mt-12 pt-8 border-t border-white/10">
          <p className="text-slate-400 leading-relaxed">
            <span className="text-white font-medium">Contact:</span> For questions, reach us at{" "}
            <a href="mailto:camanupandit75@gmail.com" className="text-[#22c55e] hover:underline">camanupandit75@gmail.com</a>
          </p>
          <p className="text-slate-500 text-sm mt-4">Last updated: February 2026</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
