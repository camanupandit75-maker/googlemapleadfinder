import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FEATURES = [
  { emoji: "🔍", title: "Search Any Locality", desc: "Enter any PIN code, city, or area name to find businesses listed on Google Maps." },
  { emoji: "📊", title: "Rich Data Extraction", desc: "Get phone numbers, addresses, websites, ratings, and review counts for every result." },
  { emoji: "📥", title: "Excel Export", desc: "Download all results as a formatted Excel or CSV file with a single click." },
  { emoji: "💳", title: "Pay Per Search", desc: "No monthly subscriptions. Buy credits and use them whenever you want." },
  { emoji: "⚡", title: "Search once, access forever", desc: "Repeat searches pull cached data at zero cost — saving your credits." },
  { emoji: "🔗", title: "Maximum Coverage", desc: "Always up-to-date data from multiple sources so you never miss a lead." },
];

const DIFFERENT = [
  { emoji: "🗺️", title: "Market Heatmap", desc: "See business density across any city. Find underserved areas or competitive hotspots." },
  { emoji: "🏢", title: "Career Scanner", desc: "Find which businesses are actively hiring. Filter by job titles and confidence." },
  { emoji: "🔥", title: "AI Lead Scoring", desc: "Instantly know which leads to contact first. Prioritize by rating, reviews, and data quality." },
  { emoji: "📧", title: "Email Enrichment", desc: "Extract emails directly from business websites. No manual hunting." },
];

const TESTIMONIALS_HOME = [
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
];

const USE_CASES = [
  { title: "Chartered Accountants", desc: "Find potential clients or audit panel firms in any city in 5 minutes." },
  { title: "Sales & BD Teams", desc: "Build a 200-contact prospect list without manual searching." },
  { title: "Recruiters", desc: "Discover which firms are hiring in your target area." },
  { title: "Startups & SMBs", desc: "Research competitors and vendors by locality." },
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar variant="dark" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Geonayan",
            url: "https://www.geonayan.com",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description:
              "B2B lead generation tool for India. Search any PIN code or city to find business leads from Google Maps with phone numbers, emails, ratings. Export to Excel.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "INR",
              description: "10 free searches on signup",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "8",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is Geonayan?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Geonayan is a B2B lead generation tool that helps you find business leads from Google Maps. Search any PIN code or city to get phone numbers, emails, ratings and export to Excel.",
                },
              },
              {
                "@type": "Question",
                name: "Is Geonayan free to use?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, you get 10 free searches when you sign up. No credit card required. After that, credits start at just ₹499.",
                },
              },
              {
                "@type": "Question",
                name: "What data can I extract?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Business name, phone number, address, ratings, reviews, website, email, WhatsApp, LinkedIn, hiring status, and AI lead scoring.",
                },
              },
              {
                "@type": "Question",
                name: "Which cities does Geonayan cover?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Geonayan works globally using Google Maps data. Popular cities include Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Gurgaon, Dubai, and any city worldwide.",
                },
              },
              {
                "@type": "Question",
                name: "How is Geonayan different from JustDial?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "JustDial is passive — you pay to be listed. Geonayan is active — you search, find leads with emails and phone numbers, score them, and export to Excel. Starting at ₹499 vs ₹24,000/year.",
                },
              },
            ],
          }),
        }}
      />

      <main>
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center animate-fade-in-up">
        <h1 className="font-display font-extrabold text-5xl md:text-6xl leading-tight mb-4 tracking-tight">
          Find Business Leads from Google Maps — Any City, Any PIN Code
        </h1>
        <p className="text-lg text-brand-400 font-medium mb-4">
          Get 10 free searches — no credit card required
        </p>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Search any locality or PIN code across India and MENA. Get phone numbers, emails, ratings — exported to Excel in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/signup"
            className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors duration-150 shadow-lg shadow-brand-500/25"
          >
            Start Searching — It&apos;s Free
          </Link>
          <Link
            href="/pricing"
            className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium px-8 py-3.5 rounded-xl text-base transition-all duration-150"
          >
            View Pricing
          </Link>
          <Link
            href="/demo"
            className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium px-8 py-3.5 rounded-xl text-base transition-all duration-150"
          >
            Book a Demo
          </Link>
        </div>

        {/* Social proof stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
          <div>
            <p className="text-2xl md:text-3xl font-display font-bold text-white">35,000+</p>
            <p className="text-sm text-slate-400">Searches Powered</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-display font-bold text-white">800+</p>
            <p className="text-sm text-slate-400">Results Exported</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-display font-bold text-white">195+</p>
            <p className="text-sm text-slate-400">Works in 195+ Countries</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="font-display font-bold text-3xl text-center mb-8 animate-fade-in">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group glass-card p-6 transition-all duration-200 animate-fade-in-up hover:border-brand-500/50"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="text-2xl mb-3 block">{f.emoji}</span>
              <h3 className="font-display font-semibold text-base text-white mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How Geonayan Works */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="font-display font-bold text-3xl text-center mb-10 animate-fade-in">
          How Geonayan Works
        </h2>
        <div className="space-y-8">
          <div className="glass-card p-6 animate-fade-in-up">
            <h3 className="font-display font-semibold text-lg text-white mb-2">Step 1: Enter a business type and city</h3>
            <p className="text-slate-400 leading-relaxed">
              Type what you&apos;re looking for and where — for example &quot;CA firms in Mumbai&quot; or &quot;tax consultants in Connaught Place&quot;. You can use any city, PIN code, or locality name. Geonayan supports India, UAE, and 195+ countries, so you can search wherever your clients are.
            </p>
          </div>
          <div className="glass-card p-6 animate-fade-in-up">
            <h3 className="font-display font-semibold text-lg text-white mb-2">Step 2: Get 20+ results with phone, email, website, ratings</h3>
            <p className="text-slate-400 leading-relaxed">
              Each search returns up to 20 verified results from Google Maps. You get business name, phone number, address, website, Google rating, and review count. Our email enrichment pulls contact emails from business websites so you often get an email address too — not just a listing.
            </p>
          </div>
          <div className="glass-card p-6 animate-fade-in-up">
            <h3 className="font-display font-semibold text-lg text-white mb-2">Step 3: Score leads with AI — know who to contact first</h3>
            <p className="text-slate-400 leading-relaxed">
              Geonayan&apos;s lead scoring helps you prioritize. See which businesses have the best ratings, most reviews, and complete data (phone + email). Filter by &quot;has email&quot; or &quot;has phone&quot; so your sales team focuses on the leads most likely to respond.
            </p>
          </div>
          <div className="glass-card p-6 animate-fade-in-up">
            <h3 className="font-display font-semibold text-lg text-white mb-2">Step 4: Export to Excel and start outreach</h3>
            <p className="text-slate-400 leading-relaxed">
              Download all results to Excel or CSV with one click. No copy-paste — your list is ready for cold calling, email campaigns, or CRM import. Repeat searches in the same area use cached data at zero extra cost, so you can refine without burning credits.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing anchor */}
      <section className="max-w-2xl mx-auto px-6 pb-16 text-center">
        <h2 className="font-display font-bold text-3xl text-center mb-4">
          Pricing
        </h2>
        <p className="text-slate-400 text-lg mb-4">
          Credits start at just ₹10 per search. No subscription. No commitment.
        </p>
        <Link
          href="/pricing"
          className="text-brand-400 hover:text-brand-300 font-semibold inline-flex items-center gap-1"
        >
          View Pricing →
        </Link>
      </section>

      {/* What makes Geonayan different */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="font-display font-bold text-3xl text-center mb-10 animate-fade-in">
          What makes Geonayan different?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {DIFFERENT.map((d, i) => (
            <div
              key={d.title}
              className="group glass-card p-6 transition-all duration-200 animate-fade-in-up hover:border-brand-500/50"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="text-2xl mb-3 block">{d.emoji}</span>
              <h3 className="font-display font-semibold text-base text-white mb-2">
                {d.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Businesses Choose Geonayan */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <h2 className="font-display font-bold text-3xl text-center mb-10 animate-fade-in">
          Why Businesses Choose Geonayan
        </h2>
        <div className="space-y-6">
          <div className="glass-card p-5">
            <h3 className="font-display font-semibold text-white mb-2">No Chrome extension needed — works in any browser</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Geonayan runs in your browser. No plugins, no installs. Log in from any device, search from anywhere, and export to Excel. Perfect for teams that switch between laptops and shared workstations or work from multiple locations.
            </p>
          </div>
          <div className="glass-card p-5">
            <h3 className="font-display font-semibold text-white mb-2">Official Google Maps data — not scraped or outdated</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              We use the official Google Places API so the data you get is the same as what appears on Google Maps — verified, up to date, and compliant. No scraping, no risky workarounds. Your results are reliable and your workflow is above board.
            </p>
          </div>
          <div className="glass-card p-5">
            <h3 className="font-display font-semibold text-white mb-2">₹10 per search — cheaper than any competitor</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Credits start at just ₹10 per search. No monthly fees, no lock-in. You get 10 free searches on signup. Compare that to directory listings that cost ₹24,000 a year or per-lead tools that charge per contact. Geonayan is built for volume without the premium price.
            </p>
          </div>
          <div className="glass-card p-5">
            <h3 className="font-display font-semibold text-white mb-2">Works in 195+ countries — India, UAE, UK, USA, and more</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Search any city or locality worldwide. Popular coverage includes Mumbai, Delhi, Bangalore, Dubai, London, New York, Singapore, Sydney, and hundreds more. Whether you serve local clients or expand internationally, Geonayan scales with you.
            </p>
          </div>
          <div className="glass-card p-5">
            <h3 className="font-display font-semibold text-white mb-2">Your data is never shared or sold</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              We don&apos;t sell or share your search history, contact lists, or account data. Your leads are yours. We use industry-standard security and only process what&apos;s needed to run the product. Your trust and your data stay protected.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="font-display font-bold text-3xl text-center mb-10 animate-fade-in">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          <div>
            <h3 className="font-display font-semibold text-lg text-white mb-2">What is Geonayan?</h3>
            <p className="text-slate-400 leading-relaxed">
              Geonayan is a B2B lead generation tool that helps you find business leads from Google Maps. Search any PIN code or city to get phone numbers, emails, ratings and export to Excel.
            </p>
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-white mb-2">Is Geonayan free to use?</h3>
            <p className="text-slate-400 leading-relaxed">
              Yes, you get 10 free searches when you sign up. No credit card required. After that, credits start at just ₹499.
            </p>
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-white mb-2">What data can I extract?</h3>
            <p className="text-slate-400 leading-relaxed">
              Business name, phone number, address, ratings, reviews, website, email, WhatsApp, LinkedIn, hiring status, and AI lead scoring.
            </p>
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-white mb-2">Which cities does Geonayan cover?</h3>
            <p className="text-slate-400 leading-relaxed">
              Geonayan works globally using Google Maps data. Popular cities include Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Gurgaon, Dubai, and any city worldwide.
            </p>
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-white mb-2">How is Geonayan different from JustDial?</h3>
            <p className="text-slate-400 leading-relaxed">
              JustDial is passive — you pay to be listed. Geonayan is active — you search, find leads with emails and phone numbers, score them, and export to Excel. Starting at ₹499 vs ₹24,000/year.
            </p>
          </div>
        </div>
      </section>

      {/* Popular cities — internal linking */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <h2 className="font-display font-bold text-3xl mb-4">Find leads in your city</h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
          Search by locality or PIN code. Get phone numbers, emails, and ratings — export to Excel in seconds.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/leads/mumbai" className="text-brand-400 hover:text-brand-300 font-medium">Mumbai</Link>
          <span className="text-slate-600">|</span>
          <Link href="/leads/delhi" className="text-brand-400 hover:text-brand-300 font-medium">Delhi</Link>
          <span className="text-slate-600">|</span>
          <Link href="/leads/bangalore" className="text-brand-400 hover:text-brand-300 font-medium">Bangalore</Link>
          <span className="text-slate-600">|</span>
          <Link href="/leads/chennai" className="text-brand-400 hover:text-brand-300 font-medium">Chennai</Link>
          <span className="text-slate-600">|</span>
          <Link href="/leads/hyderabad" className="text-brand-400 hover:text-brand-300 font-medium">Hyderabad</Link>
          <span className="text-slate-600">|</span>
          <Link href="/leads/pune" className="text-brand-400 hover:text-brand-300 font-medium">Pune</Link>
          <span className="text-slate-600">|</span>
          <Link href="/leads/kolkata" className="text-brand-400 hover:text-brand-300 font-medium">Kolkata</Link>
          <span className="text-slate-600">|</span>
          <Link href="/leads/dubai" className="text-brand-400 hover:text-brand-300 font-medium">Dubai</Link>
          <span className="text-slate-600">|</span>
          <Link href="/leads/london" className="text-brand-400 hover:text-brand-300 font-medium">London</Link>
          <span className="text-slate-600">|</span>
          <Link href="/leads/singapore" className="text-brand-400 hover:text-brand-300 font-medium">Singapore</Link>
        </div>
      </section>

      {/* Testimonials (top 3) */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="font-display font-bold text-3xl text-center mb-4">Testimonials</h2>
        <p className="text-slate-400 text-center mb-10 max-w-xl mx-auto">
          Trusted by CAs, sales teams, and recruiters across India and UAE.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS_HOME.map((t, i) => (
            <div
              key={i}
              className="glass-card p-6 animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <p className="text-slate-300 text-base leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
              <Stars />
              <h3 className="font-semibold text-white mt-3 text-base">{t.name}</h3>
              <p className="text-sm text-slate-400">{t.designation}, {t.company}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-8">
          <Link href="/testimonials" className="text-brand-400 hover:text-brand-300 font-medium">
            Read more testimonials →
          </Link>
        </p>
      </section>

      {/* Use Cases */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <h2 className="font-display font-bold text-3xl text-center mb-10 animate-fade-in">
          Who is this for?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {USE_CASES.map((uc, i) => (
            <div
              key={uc.title}
              className="border-l-4 border-brand-500 glass-card rounded-r-2xl pl-5 pr-6 py-5 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <h3 className="font-display font-semibold text-lg text-white mb-1">
                {uc.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder / About */}
      <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
        <p className="font-display font-semibold text-white mb-2">Built by Manu Pandit, Chartered Accountant & Founder</p>
        <p className="text-slate-400 leading-relaxed mb-4">
          Geonayan was built to solve a real problem — finding quality B2B leads in India without expensive tools or manual searching. As a CA, I know how valuable the right business contacts are.
        </p>
        <Link href="/about" className="text-brand-400 hover:text-brand-300 font-medium">
          Read full bio →
        </Link>
      </section>
      </main>

      <Footer />
    </div>
  );
}
