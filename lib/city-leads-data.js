/**
 * City-specific landing page data for SEO (find business leads in [city]).
 * Used by app/leads/[city]/page.js and sitemap.
 */

const ALL_TESTIMONIALS = [
  { quote: "We used to spend 2 days building a list of CAs in Mumbai for our audit panel. Geonayan did it in 5 minutes with emails included.", name: "Rohit Mehta", designation: "Partner", company: "Tax Advisory Firm, Mumbai" },
  { quote: "The market heatmap showed us exactly which areas in Delhi had fewer tax consultants. We opened our second branch in Dwarka based on that data.", name: "Priya Sharma", designation: "Founder", company: "Sharma Tax Consultants, Delhi" },
  { quote: "Exporting 200 leads with phone numbers and emails to Excel in one click? This saves our BD team hours every week.", name: "Amit Verma", designation: "Business Development Head", company: "Legal Services Firm, Bangalore" },
  { quote: "We needed CA firms across 30 PIN codes for a compliance project. The bulk upload feature handled it all in one go.", name: "Sneha Kapoor", designation: "Operations Manager", company: "Fintech Startup, Gurgaon" },
  { quote: "The email enrichment is surprisingly accurate. Got valid emails for about half the firms — that's gold for cold outreach.", name: "Karan Singh", designation: "Sales Lead", company: "SaaS Company, Hyderabad" },
  { quote: "Our recruitment team uses it to find accounting firms hiring in specific areas. The data quality is much better than JustDial.", name: "Meera Iyer", designation: "HR Manager", company: "Staffing Agency, Chennai" },
];

const LOCALITIES = {
  Mumbai: [
    "Andheri Mumbai", "Bandra Mumbai", "Dadar Mumbai", "Borivali Mumbai", "Thane Mumbai", "Malad Mumbai",
    "Goregaon Mumbai", "Powai Mumbai", "Lower Parel Mumbai", "Fort Mumbai", "Churchgate Mumbai", "Juhu Mumbai",
    "Kandivali Mumbai", "Mulund Mumbai", "Vikhroli Mumbai", "Chembur Mumbai", "Navi Mumbai", "Vashi Mumbai",
    "BKC Mumbai", "Worli Mumbai",
  ],
  Delhi: [
    "Connaught Place Delhi", "Dwarka Delhi", "Rohini Delhi", "Karol Bagh Delhi", "Laxmi Nagar Delhi", "Pitampura Delhi",
    "Janakpuri Delhi", "Saket Delhi", "Nehru Place Delhi", "Rajouri Garden Delhi", "Preet Vihar Delhi", "Mayur Vihar Delhi",
    "Vasant Kunj Delhi", "Greater Kailash Delhi", "Defence Colony Delhi", "Hauz Khas Delhi", "Chandni Chowk Delhi", "Patel Nagar Delhi",
    "Kalkaji Delhi", "Tilak Nagar Delhi",
  ],
  Bangalore: [
    "Koramangala Bangalore", "Indiranagar Bangalore", "HSR Layout Bangalore", "Whitefield Bangalore", "Electronic City Bangalore", "Jayanagar Bangalore",
    "JP Nagar Bangalore", "Marathahalli Bangalore", "BTM Layout Bangalore", "Malleshwaram Bangalore", "Rajajinagar Bangalore", "Hebbal Bangalore",
    "Yelahanka Bangalore", "Banashankari Bangalore", "MG Road Bangalore", "Sadashivanagar Bangalore", "RT Nagar Bangalore", "Basavanagudi Bangalore",
    "Vijayanagar Bangalore", "Bannerghatta Road Bangalore",
  ],
  Gurgaon: [
    "Sector 14 Gurgaon", "Sector 29 Gurgaon", "DLF Phase 1 Gurgaon", "DLF Phase 3 Gurgaon", "Sohna Road Gurgaon", "MG Road Gurgaon",
    "Golf Course Road Gurgaon", "Sector 56 Gurgaon", "Sector 49 Gurgaon", "Udyog Vihar Gurgaon", "Palam Vihar Gurgaon", "South City Gurgaon",
    "Sector 15 Gurgaon", "Sector 44 Gurgaon", "Cyber City Gurgaon",
  ],
  Chennai: [
    "T Nagar Chennai", "Anna Nagar Chennai", "Adyar Chennai", "Velachery Chennai", "Tambaram Chennai", "OMR Chennai",
    "Mylapore Chennai", "Nungambakkam Chennai", "Egmore Chennai", "Porur Chennai", "Guindy Chennai", "Chromepet Chennai",
    "Kilpauk Chennai", "Kodambakkam Chennai", "Thiruvanmiyur Chennai",
  ],
  Hyderabad: [
    "Ameerpet Hyderabad", "Madhapur Hyderabad", "HITEC City Hyderabad", "Banjara Hills Hyderabad", "Jubilee Hills Hyderabad", "Kukatpally Hyderabad",
    "Gachibowli Hyderabad", "Secunderabad", "Begumpet Hyderabad", "Dilsukhnagar Hyderabad", "LB Nagar Hyderabad", "Abids Hyderabad",
    "Kondapur Hyderabad", "Miyapur Hyderabad", "Uppal Hyderabad",
  ],
};

/** testimonial indices into ALL_TESTIMONIALS (0-based) — 3 per city */
const TESTIMONIAL_IDS_BY_CITY = {
  Mumbai: [0, 1, 2],
  Delhi: [1, 0, 2],
  Bangalore: [2, 0, 1],
  Gurgaon: [3, 2, 1],
  Chennai: [5, 2, 0],
  Hyderabad: [4, 2, 0],
};

const CITY_SLUG_TO_NAME = {
  mumbai: "Mumbai",
  delhi: "Delhi",
  bangalore: "Bangalore",
  gurgaon: "Gurgaon",
  chennai: "Chennai",
  hyderabad: "Hyderabad",
};

const CITY_CONTENT = {
  Mumbai: `Mumbai is India's financial capital and home to thousands of chartered accountants, law firms, tax consultants, and professional services. Whether you need audit panel firms in Bandra, CAs in Andheri, or legal practices in Lower Parel, finding the right business leads used to mean manual Google Maps searches and spreadsheets — no longer.

Geonayan lets you search Mumbai by PIN code or locality and get verified business data in minutes. Enter any area — from BKC and Worli to Thane, Navi Mumbai, and Vashi — and pull phone numbers, addresses, websites, and ratings for chartered accountants, law firms, auditors, and more. Every result can be exported to Excel or CSV with one click, so your BD or compliance team can start calling the same day.

Our market heatmap for Mumbai covers 20 localities including Andheri, Bandra, Dadar, Powai, Goregaon, Malad, Borivali, Mulund, Chembur, Fort, Churchgate, and Juhu. Use it to see where competition is dense and where there's room to grow. Email enrichment adds contact emails scraped from business websites, so you get more than just a listing.

Start with 10 free searches — no credit card required. Pay per search after that, with no subscription. Ideal for CAs building audit panels, law firms sourcing referrals, and sales teams building prospect lists across Mumbai.`,

  Delhi: `Delhi NCR has one of the highest concentrations of chartered accountants, law firms, and tax consultants in India. From Connaught Place to Dwarka, Rohini to Saket, finding business leads by locality used to mean hours of manual searching. Geonayan changes that: search by PIN code or area name and get phone numbers, emails, addresses, and ratings in one place, ready to export to Excel.

Whether you're building an audit panel of CAs in South Delhi, sourcing law firms in Karol Bagh, or mapping tax consultants across Laxmi Nagar and Preet Vihar, Geonayan pulls data from Google Maps and enriches it with emails where possible. Repeat searches use cached results at zero extra cost, so you can refine by locality without burning credits.

Our Delhi heatmap covers 20 localities including Connaught Place, Dwarka, Rohini, Karol Bagh, Laxmi Nagar, Pitampura, Janakpuri, Saket, Nehru Place, Rajouri Garden, Vasant Kunj, Greater Kailash, Hauz Khas, Chandni Chowk, and more. See which areas have the most firms and which are underserved — then run targeted searches and export leads in seconds.

Sign up for free and get 10 searches. No subscription, no commitment. Perfect for CAs, legal teams, and BD professionals who need Delhi NCR leads fast.`,

  Bangalore: `Bangalore's startup and corporate ecosystem runs on chartered accountants, law firms, and tax consultants. From Koramangala and Indiranagar to Whitefield and Electronic City, finding business leads by locality used to mean scattered Google searches and manual lists. Geonayan gives you one place to search by PIN or area, get phone numbers and emails, and export everything to Excel.

Search for CAs in HSR Layout, law firms in MG Road, or auditors in Marathahalli — you get up to 20 results per query with ratings, review counts, addresses, and websites. Our email enrichment pulls contact emails from business sites where available, so you get more than just a phone number. Cached results mean repeat searches in the same area cost nothing.

The Bangalore heatmap covers 20 localities: Koramangala, Indiranagar, HSR Layout, Whitefield, Electronic City, Jayanagar, JP Nagar, Marathahalli, BTM Layout, Malleshwaram, Rajajinagar, Hebbal, Yelahanka, Banashankari, and more. Use it to spot high-density and low-competition areas before you run targeted lead searches.

Start with 10 free searches. No credit card required. Pay per search after that — ideal for CAs, legal teams, and sales professionals building prospect lists in Bangalore.`,

  Gurgaon: `Gurgaon is a hub for corporates, CAs, law firms, and tax consultants. From Sector 14 and DLF phases to Golf Course Road and Udyog Vihar, finding business leads by locality used to mean manual Google Maps scrolling. Geonayan lets you search by PIN or area, get phone numbers and emails, and export to Excel in one click.

Whether you need CAs in Sector 29, law firms on MG Road, or auditors in Cyber City, one search returns names, ratings, addresses, websites, and phone numbers. Email enrichment adds contact emails from business websites where possible. Repeat searches in the same locality use cached data at zero cost.

Our Gurgaon heatmap covers 15 localities: Sector 14, Sector 29, DLF Phase 1, DLF Phase 3, Sohna Road, MG Road, Golf Course Road, Sector 56, Sector 49, Udyog Vihar, Palam Vihar, South City, Sector 15, Sector 44, and Cyber City. See where firms are concentrated and run targeted lead searches — then export to Excel for your BD or compliance team.

Get 10 free searches on signup. No subscription. Perfect for CAs, legal firms, and sales teams building prospect lists in Gurgaon.`,

  Chennai: `Chennai's professional services market — chartered accountants, law firms, tax consultants — is spread across T Nagar, Anna Nagar, Adyar, OMR, and beyond. Finding leads by locality used to mean manual Google Maps searches and copy-paste into spreadsheets. Geonayan lets you search by PIN code or area, get phone numbers and emails, and export to Excel in seconds.

Search for CAs in T Nagar, law firms in Nungambakkam, or auditors in Velachery; each query returns up to 20 results with ratings, addresses, websites, and phone numbers. Email enrichment pulls contact emails from business sites where available. Cached results mean you can re-run the same locality search at no extra cost.

Our Chennai heatmap covers 15 localities: T Nagar, Anna Nagar, Adyar, Velachery, Tambaram, OMR, Mylapore, Nungambakkam, Egmore, Porur, Guindy, Chromepet, Kilpauk, Kodambakkam, and Thiruvanmiyur. Use it to see business density and then run targeted lead searches for your team.

Start with 10 free searches — no credit card. Pay per search after that. Ideal for CAs, legal teams, and BD professionals building prospect lists in Chennai.`,

  Hyderabad: `Hyderabad's tech and business landscape is full of chartered accountants, law firms, and tax consultants. From HITEC City and Madhapur to Banjara Hills and Secunderabad, finding business leads by locality used to mean manual Google Maps searches. Geonayan lets you search by PIN or area, get phone numbers and emails, and export to Excel with one click.

Search for CAs in Gachibowli, law firms in Jubilee Hills, or auditors in Ameerpet — you get up to 20 results per query with ratings, addresses, websites, and phone numbers. Email enrichment adds contact emails from business websites where possible. Repeat searches use cached data at zero cost.

Our Hyderabad heatmap covers 15 localities: Ameerpet, Madhapur, HITEC City, Banjara Hills, Jubilee Hills, Kukatpally, Gachibowli, Secunderabad, Begumpet, Dilsukhnagar, LB Nagar, Abids, Kondapur, Miyapur, and Uppal. See where firms are concentrated and run targeted lead searches, then export for your BD or compliance team.

Sign up for free and get 10 searches. No subscription. Perfect for CAs, legal teams, and sales professionals building prospect lists in Hyderabad.`,
};

export function getCityBySlug(slug) {
  const name = CITY_SLUG_TO_NAME[slug?.toLowerCase()];
  if (!name) return null;
  return {
    slug: slug.toLowerCase(),
    name: name,
    localities: LOCALITIES[name] || [],
    testimonialIds: TESTIMONIAL_IDS_BY_CITY[name] || [0, 1, 2],
    content: CITY_CONTENT[name] || "",
    metaTitle: `Find Business Leads in ${name} | Geonayan`,
    metaDescription: `Search ${name} by PIN code or locality. Find chartered accountants, law firms, tax consultants with phone numbers, emails. Export to Excel. Free to start.`,
  };
}

export function getAllCitySlugs() {
  return Object.keys(CITY_SLUG_TO_NAME);
}

export function getTestimonialsForCity(cityName) {
  const ids = TESTIMONIAL_IDS_BY_CITY[cityName] || [0, 1, 2];
  return ids.map((i) => ALL_TESTIMONIALS[i]);
}
