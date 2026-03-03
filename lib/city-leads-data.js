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
  Jaipur: ["Malviya Nagar Jaipur", "C-Scheme Jaipur", "Vaishali Nagar Jaipur", "Pink Square Jaipur", "Raja Park Jaipur", "Bani Park Jaipur", "Mansarovar Jaipur", "Sodala Jaipur", "Tonk Road Jaipur", "Ajmer Road Jaipur"],
  Indore: ["Vijay Nagar Indore", "Scheme 54 Indore", "Palasia Indore", "MG Road Indore", "Bhawarkua Indore", "Rau Indore", "Super Corridor Indore", "Rajendra Nagar Indore", "Sapna Sangeeta Indore", "Nipania Indore"],
  Pune: ["Koregaon Park Pune", "Camp Pune", "Hinjewadi Pune", "Viman Nagar Pune", "Kothrud Pune", "Aundh Pune", "Baner Pune", "Shivajinagar Pune", "FC Road Pune", "Deccan Pune", "Hadapsar Pune", "Pimpri Pune"],
  Ahmedabad: ["Satellite Ahmedabad", "SG Highway Ahmedabad", "Bodakdev Ahmedabad", "Navrangpura Ahmedabad", "Vastrapur Ahmedabad", "Prajapati Nagar Ahmedabad", "Maninagar Ahmedabad", "Naroda Ahmedabad", "Thaltej Ahmedabad", "Gota Ahmedabad"],
  Kolkata: ["Park Street Kolkata", "Salt Lake Kolkata", "New Town Kolkata", "Ballygunge Kolkata", "Camac Street Kolkata", "Howrah Kolkata", "Dum Dum Kolkata", "Jadavpur Kolkata", "Rashbehari Kolkata", "Gariahat Kolkata"],
  Lucknow: ["Gomti Nagar Lucknow", "Hazratganj Lucknow", "Aliganj Lucknow", "Indira Nagar Lucknow", "Alambagh Lucknow", "Aminabad Lucknow", "Chowk Lucknow", "Rajajipuram Lucknow", "Vibhuti Khand Lucknow", "Mahanagar Lucknow"],
  Chandigarh: ["Sector 17 Chandigarh", "Sector 35 Chandigarh", "Sector 22 Chandigarh", "Mohali", "Panchkula", "Sector 34 Chandigarh", "Sector 43 Chandigarh", "Zirakpur", "Manimajra Chandigarh", "Industrial Area Chandigarh"],
  Noida: ["Sector 18 Noida", "Sector 62 Noida", "Sector 50 Noida", "Greater Noida", "Sector 15 Noida", "Sector 44 Noida", "Sector 137 Noida", "Sector 76 Noida", "Sector 122 Noida", "Noida Extension"],
  Kochi: ["Marine Drive Kochi", "MG Road Kochi", "Edappally Kochi", "Kakkanad Kochi", "Fort Kochi", "Ernakulam", "Palarivattom Kochi", "Kaloor Kochi", "Tripunithura", "Aluva Kochi"],
  Coimbatore: ["RS Puram Coimbatore", "Gandhipuram Coimbatore", "Sitra Coimbatore", "Peelamedu Coimbatore", "Saibaba Colony Coimbatore", "Avinashi Road Coimbatore", "Trichy Road Coimbatore", "Saravanampatti Coimbatore", "Ukkadam Coimbatore", "Race Course Coimbatore"],
  Nagpur: ["Sitabuldi Nagpur", "Civil Lines Nagpur", "Dharampeth Nagpur", "Wardha Road Nagpur", "Sadar Nagpur", "Ambazari Nagpur", "Koradi Road Nagpur", "Besa Nagpur", "Hingna Nagpur", "Kamptee Road Nagpur"],
  Surat: ["Vesu Surat", "Adajan Surat", "Athwa Surat", "Piplod Surat", "Varachha Surat", "Katargam Surat", "City Light Surat", "Pal Surat", "Sarthana Surat", "Udhna Surat"],
  Vadodara: ["Alkapuri Vadodara", "Race Course Vadodara", "Gotri Vadodara", "Manjalpur Vadodara", "Akota Vadodara", "Waghodia Road Vadodara", "Sayajigunj Vadodara", "Nizampura Vadodara", "Karelibaug Vadodara", "Makarpura Vadodara"],
  Bhopal: ["MP Nagar Bhopal", "New Market Bhopal", "Arera Colony Bhopal", "Shahpura Bhopal", "Kolar Road Bhopal", "Berasia Road Bhopal", "Hoshangabad Road Bhopal", "Lalghati Bhopal", "Bairagarh Bhopal", "Habibganj Bhopal"],
  Visakhapatnam: ["Dwaraka Nagar Vizag", "MVP Colony Vizag", "Seethammadhara Vizag", "Jagadamba Vizag", "Siripuram Vizag", "Gajuwaka Vizag", "Madhurawada Vizag", "Rushikonda Vizag", "Waltair Vizag", "Dabagardens Vizag"],
  Dubai: ["Business Bay Dubai", "DIFC Dubai", "Deira Dubai", "Bur Dubai", "JLT Dubai", "Downtown Dubai", "Dubai Marina", "Al Barsha Dubai", "Karama Dubai", "International City Dubai", "Silicon Oasis Dubai", "JBR Dubai"],
  "Abu Dhabi": ["Al Reem Island Abu Dhabi", "Khalifa City Abu Dhabi", "Al Zahiyah Abu Dhabi", "Corniche Abu Dhabi", "Al Maryah Island Abu Dhabi", "Al Khalidiyah Abu Dhabi", "Mussafah Abu Dhabi", "Yas Island Abu Dhabi", "Saadiyat Island Abu Dhabi", "Al Nahyan Abu Dhabi"],
  Sharjah: ["Al Nahda Sharjah", "Al Majaz Sharjah", "Al Khan Sharjah", "University City Sharjah", "Industrial Area Sharjah", "Al Taawun Sharjah", "Muwaileh Sharjah", "Al Qasimia Sharjah", "Al Majarah Sharjah", "Wasit Sharjah"],
  Johannesburg: ["Sandton Johannesburg", "Rosebank Johannesburg", "Melrose Johannesburg", "Hyde Park Johannesburg", "Fourways Johannesburg", "Randburg Johannesburg", "Midrand Johannesburg", "Centurion", "Pretoria CBD", "Houghton Johannesburg"],
  "Cape Town": ["Cape Town CBD", "Sea Point Cape Town", "Claremont Cape Town", "Constantia Cape Town", "Camps Bay Cape Town", "Stellenbosch", "Somerset West", "Durbanville Cape Town", "Bellville Cape Town", "Observatory Cape Town"],
  Durban: ["Umhlanga Durban", "Durban CBD", "Berea Durban", "Morningside Durban", "Westville Durban", "Ballito", "Pinetown Durban", "Glenwood Durban", "Florida Road Durban", "La Lucia Durban"],
  "New York": ["Manhattan New York", "Brooklyn New York", "Queens New York", "Bronx New York", "Staten Island", "Midtown Manhattan", "Financial District NYC", "Upper East Side", "Williamsburg Brooklyn", "Long Island City"],
  "Los Angeles": ["Downtown LA", "Santa Monica", "Beverly Hills", "Hollywood", "Pasadena", "West Hollywood", "Culver City", "Glendale", "Burbank", "Long Beach", "Torrance", "Irvine"],
  Chicago: ["Downtown Chicago", "The Loop Chicago", "River North Chicago", "Lincoln Park Chicago", "Wicker Park Chicago", "Evanston", "Oak Park", "Naperville", "Schaumburg", "Skokie"],
  Houston: ["Downtown Houston", "Midtown Houston", "The Woodlands", "Sugar Land", "Katy", "Galleria Houston", "Rice Village Houston", "Montrose Houston", "Heights Houston", "Memorial Houston"],
  Miami: ["Downtown Miami", "Miami Beach", "Brickell Miami", "Wynwood Miami", "Coral Gables", "Coconut Grove", "Doral", "Fort Lauderdale", "Boca Raton", "Key Biscayne"],
  Tokyo: ["Shibuya Tokyo", "Shinjuku Tokyo", "Ginza Tokyo", "Roppongi Tokyo", "Shinagawa Tokyo", "Marunouchi Tokyo", "Akihabara Tokyo", "Ebisu Tokyo", "Meguro Tokyo", "Odaiba Tokyo"],
  Osaka: ["Namba Osaka", "Umeda Osaka", "Shinsaibashi Osaka", "Tennoji Osaka", "Shin-Osaka", "Dotonbori Osaka", "Amerika-mura Osaka", "Kyobashi Osaka", "Tanimachi Osaka", "Fukushima Osaka"],
  London: ["City of London", "Westminster London", "Canary Wharf London", "Shoreditch London", "Camden London", "Kensington London", "Chelsea London", "Stratford London", "Greenwich London", "Croydon London"],
  Manchester: ["Manchester City Centre", "Salford", "MediaCityUK", "Northern Quarter Manchester", "Spinningfields Manchester", "Didsbury Manchester", "Chorlton Manchester", "Trafford Park", "Ancoats Manchester", "Deansgate Manchester"],
  Birmingham: ["Birmingham City Centre", "Jewellery Quarter Birmingham", "Edgbaston Birmingham", "Digbeth Birmingham", "Solihull", "Sutton Coldfield", "Harborne Birmingham", "Moseley Birmingham", "Erdington Birmingham", "New Street Birmingham"],
  Berlin: ["Mitte Berlin", "Kreuzberg Berlin", "Prenzlauer Berg Berlin", "Charlottenburg Berlin", "Friedrichshain Berlin", "Alexanderplatz Berlin", "Potsdamer Platz Berlin", "Schöneberg Berlin", "Neukölln Berlin", "Tiergarten Berlin"],
  Munich: ["Marienplatz Munich", "Schwabing Munich", "Maxvorstadt Munich", "Bogenhausen Munich", "Sendling Munich", "Haidhausen Munich", "Westend Munich", "Pasing Munich", "Garching Munich", "Freising"],
  Frankfurt: ["Frankfurt am Main Zentrum", "Sachsenhausen Frankfurt", "Westend Frankfurt", "Bornheim Frankfurt", "Ostend Frankfurt", "Bockenheim Frankfurt", "Nordend Frankfurt", "Eckenheim Frankfurt", "Airport Frankfurt", "Messe Frankfurt"],
  Paris: ["1er Arrondissement Paris", "Le Marais Paris", "Saint-Germain Paris", "Champs-Élysées Paris", "La Défense Paris", "Montmartre Paris", "Bastille Paris", "Opéra Paris", "Latin Quarter Paris", "Belleville Paris"],
  Lyon: ["Presqu'île Lyon", "Part-Dieu Lyon", "Confluence Lyon", "Vieux Lyon", "Croix-Rousse Lyon", "Gerland Lyon", "Villeurbanne", "Caluire Lyon", "Tête d'Or Lyon", "Brotteaux Lyon"],
  Singapore: ["CBD Singapore", "Orchard Road Singapore", "Marina Bay Singapore", "Raffles Place Singapore", "Bugis Singapore", "Tiong Bahru Singapore", "Sentosa Singapore", "Jurong East Singapore", "Changi Singapore", "Clarke Quay Singapore"],
  Sydney: ["Sydney CBD", "North Sydney", "Parramatta Sydney", "Chatswood Sydney", "Bondi Sydney", "Manly Sydney", "Surry Hills Sydney", "Darling Harbour Sydney", "Macquarie Park Sydney", "Ryde Sydney"],
  Melbourne: ["Melbourne CBD", "Southbank Melbourne", "Docklands Melbourne", "St Kilda Melbourne", "Carlton Melbourne", "Richmond Melbourne", "Fitzroy Melbourne", "South Yarra Melbourne", "Box Hill Melbourne", "Hawthorn Melbourne"],
  Toronto: ["Downtown Toronto", "Financial District Toronto", "Yorkville Toronto", "Liberty Village Toronto", "Leslieville Toronto", "Scarborough Toronto", "Mississauga", "North York Toronto", "Etobicoke Toronto", "Markham"],
  Vancouver: ["Downtown Vancouver", "Gastown Vancouver", "Yaletown Vancouver", "Kitsilano Vancouver", "West End Vancouver", "Burnaby", "Richmond BC", "Surrey", "North Vancouver", "Coquitlam"],
  Riyadh: ["King Fahd Road Riyadh", "Olaya Riyadh", "Al Malaz Riyadh", "Al Murjan Riyadh", "Al Nakheel Riyadh", "Granada Riyadh", "Al Rawdah Riyadh", "Al Sulimaniyah Riyadh", "Al Yasmin Riyadh", "Digital City Riyadh"],
  Jeddah: ["Al Hamra Jeddah", "Al Rawdah Jeddah", "Al Shati Jeddah", "Obhur Jeddah", "Al Andalus Jeddah", "Al Naeem Jeddah", "Prince Mohammed bin Abdulaziz Road Jeddah", "Corniche Jeddah", "Al Faisaliah Jeddah", "Al Mohammadiyah Jeddah"],
};

/** testimonial indices into ALL_TESTIMONIALS (0-based) — 3 per city */
const TESTIMONIAL_IDS_BY_CITY = {
  Mumbai: [0, 1, 2],
  Delhi: [1, 0, 2],
  Bangalore: [2, 0, 1],
  Gurgaon: [3, 2, 1],
  Chennai: [5, 2, 0],
  Hyderabad: [4, 2, 0],
  Jaipur: [0, 2, 1],
  Indore: [1, 0, 2],
  Pune: [2, 0, 1],
  Ahmedabad: [0, 1, 2],
  Kolkata: [1, 2, 0],
  Lucknow: [0, 2, 1],
  Chandigarh: [2, 1, 0],
  Noida: [3, 0, 2],
  Kochi: [0, 1, 2],
  Coimbatore: [1, 0, 2],
  Nagpur: [0, 2, 1],
  Surat: [2, 0, 1],
  Vadodara: [0, 1, 2],
  Bhopal: [1, 0, 2],
  Visakhapatnam: [0, 2, 1],
  Dubai: [0, 1, 2],
  "Abu Dhabi": [1, 0, 2],
  Sharjah: [0, 2, 1],
  Johannesburg: [2, 0, 1],
  "Cape Town": [0, 1, 2],
  Durban: [1, 0, 2],
  "New York": [2, 0, 1],
  "Los Angeles": [0, 1, 2],
  Chicago: [1, 2, 0],
  Houston: [0, 2, 1],
  Miami: [2, 0, 1],
  Tokyo: [0, 1, 2],
  Osaka: [1, 0, 2],
  London: [2, 0, 1],
  Manchester: [0, 1, 2],
  Birmingham: [1, 0, 2],
  Berlin: [0, 2, 1],
  Munich: [1, 0, 2],
  Frankfurt: [2, 0, 1],
  Paris: [0, 1, 2],
  Lyon: [1, 0, 2],
  Singapore: [2, 0, 1],
  Sydney: [0, 1, 2],
  Melbourne: [1, 2, 0],
  Toronto: [0, 2, 1],
  Vancouver: [2, 0, 1],
  Riyadh: [0, 1, 2],
  Jeddah: [1, 0, 2],
};

const CITY_SLUG_TO_NAME = {
  mumbai: "Mumbai",
  delhi: "Delhi",
  bangalore: "Bangalore",
  gurgaon: "Gurgaon",
  chennai: "Chennai",
  hyderabad: "Hyderabad",
  jaipur: "Jaipur",
  indore: "Indore",
  pune: "Pune",
  ahmedabad: "Ahmedabad",
  kolkata: "Kolkata",
  lucknow: "Lucknow",
  chandigarh: "Chandigarh",
  noida: "Noida",
  kochi: "Kochi",
  coimbatore: "Coimbatore",
  nagpur: "Nagpur",
  surat: "Surat",
  vadodara: "Vadodara",
  bhopal: "Bhopal",
  visakhapatnam: "Visakhapatnam",
  dubai: "Dubai",
  "abu-dhabi": "Abu Dhabi",
  sharjah: "Sharjah",
  johannesburg: "Johannesburg",
  "cape-town": "Cape Town",
  durban: "Durban",
  "new-york": "New York",
  "los-angeles": "Los Angeles",
  chicago: "Chicago",
  houston: "Houston",
  miami: "Miami",
  tokyo: "Tokyo",
  osaka: "Osaka",
  london: "London",
  manchester: "Manchester",
  "birmingham-uk": "Birmingham",
  berlin: "Berlin",
  munich: "Munich",
  frankfurt: "Frankfurt",
  paris: "Paris",
  lyon: "Lyon",
  singapore: "Singapore",
  sydney: "Sydney",
  melbourne: "Melbourne",
  toronto: "Toronto",
  vancouver: "Vancouver",
  riyadh: "Riyadh",
  jeddah: "Jeddah",
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

  Jaipur: `Jaipur is a major hub for chartered accountants, law firms, tax consultants, and professional services across Rajasthan. From Malviya Nagar and C-Scheme to Vaishali Nagar and Bani Park, finding business leads by locality used to mean manual Google Maps searches. Geonayan lets you search Jaipur by PIN code or area, get phone numbers and emails, and export to Excel in seconds.

Search for CAs in Raja Park, law firms in Tonk Road, or auditors in Mansarovar; each query returns results with ratings, addresses, websites, and phone numbers. Email enrichment adds contact emails from business sites where available. Our Jaipur heatmap covers key localities including Malviya Nagar, C-Scheme, Vaishali Nagar, Pink Square, Bani Park, Mansarovar, Sodala, and Ajmer Road so you can see where firms are concentrated.

Start with 10 free searches — no credit card required. Pay per search after that. Ideal for CAs, legal teams, and BD professionals building prospect lists in Jaipur and Rajasthan.`,

  Indore: `Indore's growing corporate and SME base drives demand for chartered accountants, law firms, and tax consultants. From Vijay Nagar and Palasia to MG Road and Super Corridor, finding business leads by locality used to mean scattered searches. Geonayan gives you one place to search by PIN or area, get phone numbers and emails, and export everything to Excel.

Search for CAs in Scheme 54, law firms in Bhawarkua, or auditors in Rau — you get up to 20 results per query with ratings, addresses, and websites. Our Indore heatmap covers Vijay Nagar, Palasia, MG Road, Bhawarkua, Rau, Super Corridor, Sapna Sangeeta, and Nipania. Use it to spot high-density and opportunity areas before running targeted lead searches.

Get 10 free searches on signup. No subscription. Perfect for CAs, legal firms, and sales teams building prospect lists in Indore.`,

  Pune: `Pune's IT and manufacturing ecosystem relies on chartered accountants, law firms, and tax consultants. From Koregaon Park and Hinjewadi to Kothrud and Baner, finding business leads by locality used to mean manual lists. Geonayan lets you search Pune by PIN code or area, get phone numbers and emails, and export to Excel with one click.

Search for CAs in Viman Nagar, law firms in FC Road, or auditors in Hadapsar; each query returns names, ratings, addresses, websites, and phone numbers. Our Pune heatmap covers Koregaon Park, Camp, Hinjewadi, Viman Nagar, Kothrud, Aundh, Baner, Shivajinagar, Deccan, Hadapsar, and Pimpri. Cached results mean repeat searches in the same area cost nothing.

Sign up for free and get 10 searches. No subscription. Ideal for CAs, legal teams, and sales professionals building prospect lists in Pune.`,

  Ahmedabad: `Ahmedabad is a key market for chartered accountants, law firms, and tax consultants in Gujarat. From Satellite and SG Highway to Bodakdev and Navrangpura, finding business leads by locality used to mean hours of manual searching. Geonayan changes that: search by PIN code or area name and get phone numbers, emails, addresses, and ratings in one place, ready to export to Excel.

Whether you're building an audit panel of CAs in Vastrapur, sourcing law firms in Prajapati Nagar, or mapping tax consultants across Thaltej and Gota, Geonayan pulls data from Google Maps and enriches it with emails where possible. Our Ahmedabad heatmap covers Satellite, SG Highway, Bodakdev, Navrangpura, Vastrapur, Maninagar, Naroda, Thaltej, and Gota.

Start with 10 free searches. No credit card required. Perfect for CAs, legal teams, and BD professionals who need Ahmedabad leads fast.`,

  Kolkata: `Kolkata's professional services market — chartered accountants, law firms, tax consultants — is spread across Park Street, Salt Lake, New Town, Ballygunge, and beyond. Finding leads by locality used to mean manual Google Maps searches and copy-paste into spreadsheets. Geonayan lets you search by PIN code or area, get phone numbers and emails, and export to Excel in seconds.

Search for CAs in Salt Lake, law firms in Camac Street, or auditors in New Town; each query returns up to 20 results with ratings, addresses, websites, and phone numbers. Our Kolkata heatmap covers Park Street, Salt Lake, New Town, Ballygunge, Camac Street, Howrah, Dum Dum, Jadavpur, Rashbehari, and Gariahat. Use it to see business density and run targeted lead searches.

Get 10 free searches on signup. No subscription. Ideal for CAs, legal teams, and BD professionals building prospect lists in Kolkata.`,

  Lucknow: `Lucknow has a growing base of chartered accountants, law firms, and tax consultants serving Uttar Pradesh. From Gomti Nagar and Hazratganj to Aliganj and Indira Nagar, finding business leads by locality used to mean manual scrolling. Geonayan lets you search Lucknow by PIN or area, get phone numbers and emails, and export to Excel with one click.

Search for CAs in Gomti Nagar, law firms in Hazratganj, or auditors in Vibhuti Khand — you get results with ratings, addresses, websites, and phone numbers. Email enrichment adds contact emails from business websites where possible. Our Lucknow heatmap covers Gomti Nagar, Hazratganj, Aliganj, Indira Nagar, Alambagh, Aminabad, Chowk, Rajajipuram, Vibhuti Khand, and Mahanagar.

Start with 10 free searches. No credit card. Perfect for CAs, legal firms, and sales teams building prospect lists in Lucknow.`,

  Chandigarh: `Chandigarh and the Tricity (Chandigarh, Mohali, Panchkula) host thousands of chartered accountants, law firms, and tax consultants. From Sector 17 and Sector 35 to Zirakpur and Manimajra, finding business leads by locality used to mean manual Google Maps searches. Geonayan lets you search by PIN or area, get phone numbers and emails, and export to Excel in one click.

Search for CAs in Sector 22, law firms in Mohali, or auditors in Panchkula; each query returns up to 20 results with ratings, addresses, websites, and phone numbers. Our heatmap covers Sector 17, Sector 35, Sector 22, Mohali, Panchkula, Sector 34, Sector 43, Zirakpur, Manimajra, and Industrial Area. Cached results mean repeat searches cost nothing.

Sign up for free and get 10 searches. No subscription. Ideal for CAs, legal teams, and sales professionals building prospect lists in Chandigarh Tricity.`,

  Noida: `Noida and Greater Noida are major hubs for corporates, CAs, law firms, and tax consultants in NCR. From Sector 18 and Sector 62 to Greater Noida and Noida Extension, finding business leads by locality used to mean manual lists. Geonayan gives you one place to search by PIN or area, get phone numbers and emails, and export to Excel.

Search for CAs in Sector 50, law firms in Sector 44, or auditors in Sector 137 — you get names, ratings, addresses, websites, and phone numbers. Our Noida heatmap covers Sector 18, Sector 62, Sector 50, Greater Noida, Sector 15, Sector 44, Sector 137, Sector 76, Sector 122, and Noida Extension. See where firms are concentrated and run targeted lead searches.

Get 10 free searches on signup. No subscription. Perfect for CAs, legal firms, and sales teams building prospect lists in Noida.`,

  Kochi: `Kochi's business and port economy supports a strong network of chartered accountants, law firms, and tax consultants. From Marine Drive and MG Road to Kakkanad and Edappally, finding business leads by locality used to mean scattered Google searches. Geonayan lets you search Kochi by PIN code or area, get phone numbers and emails, and export to Excel in seconds.

Search for CAs in Kakkanad, law firms in MG Road, or auditors in Ernakulam; each query returns results with ratings, addresses, websites, and phone numbers. Our Kochi heatmap covers Marine Drive, MG Road, Edappally, Kakkanad, Fort Kochi, Ernakulam, Palarivattom, Kaloor, Tripunithura, and Aluva. Repeat searches in the same locality use cached data at zero cost.

Start with 10 free searches — no credit card. Pay per search after that. Ideal for CAs, legal teams, and BD professionals building prospect lists in Kochi.`,

  Coimbatore: `Coimbatore's industrial and SME base drives demand for chartered accountants, law firms, and tax consultants. From RS Puram and Gandhipuram to Sitra and Peelamedu, finding business leads by locality used to mean manual Google Maps scrolling. Geonayan lets you search by PIN or area, get phone numbers and emails, and export to Excel with one click.

Search for CAs in RS Puram, law firms in Gandhipuram, or auditors in Avinashi Road — you get up to 20 results per query with ratings, addresses, websites, and phone numbers. Our Coimbatore heatmap covers RS Puram, Gandhipuram, Sitra, Peelamedu, Saibaba Colony, Avinashi Road, Trichy Road, Saravanampatti, Ukkadam, and Race Course. Use it to see business density and run targeted lead searches.

Sign up for free and get 10 searches. No subscription. Perfect for CAs, legal teams, and sales professionals building prospect lists in Coimbatore.`,

  Nagpur: `Nagpur is a key centre for chartered accountants, law firms, and tax consultants in central India. From Sitabuldi and Civil Lines to Dharampeth and Wardha Road, finding business leads by locality used to mean manual lists. Geonayan gives you one place to search by PIN or area, get phone numbers and emails, and export to Excel.

Search for CAs in Sitabuldi, law firms in Civil Lines, or auditors in Ambazari; each query returns names, ratings, addresses, websites, and phone numbers. Our Nagpur heatmap covers Sitabuldi, Civil Lines, Dharampeth, Wardha Road, Sadar, Ambazari, Koradi Road, Besa, Hingna, and Kamptee Road. Cached results mean you can re-run the same locality search at no extra cost.

Get 10 free searches on signup. No credit card required. Ideal for CAs, legal firms, and sales teams building prospect lists in Nagpur.`,

  Surat: `Surat's diamond and textile economy relies on chartered accountants, law firms, and tax consultants. From Vesu and Adajan to Varachha and Piplod, finding business leads by locality used to mean manual Google Maps searches. Geonayan lets you search Surat by PIN code or area, get phone numbers and emails, and export to Excel in seconds.

Search for CAs in Vesu, law firms in Athwa, or auditors in City Light; each query returns up to 20 results with ratings, addresses, websites, and phone numbers. Email enrichment adds contact emails from business websites where possible. Our Surat heatmap covers Vesu, Adajan, Athwa, Piplod, Varachha, Katargam, City Light, Pal, Sarthana, and Udhna.

Start with 10 free searches. No subscription. Perfect for CAs, legal teams, and BD professionals building prospect lists in Surat.`,

  Vadodara: `Vadodara hosts a strong professional services sector — chartered accountants, law firms, tax consultants — across Alkapuri, Race Course, Gotri, and beyond. Finding leads by locality used to mean manual Google Maps searches and copy-paste into spreadsheets. Geonayan lets you search by PIN code or area, get phone numbers and emails, and export to Excel with one click.

Search for CAs in Alkapuri, law firms in Race Course, or auditors in Waghodia Road; you get results with ratings, addresses, websites, and phone numbers. Our Vadodara heatmap covers Alkapuri, Race Course, Gotri, Manjalpur, Akota, Waghodia Road, Sayajigunj, Nizampura, Karelibaug, and Makarpura. Repeat searches use cached data at zero cost.

Get 10 free searches on signup. No credit card. Ideal for CAs, legal teams, and sales professionals building prospect lists in Vadodara.`,

  Bhopal: `Bhopal's government and private sector base supports chartered accountants, law firms, and tax consultants. From MP Nagar and New Market to Arera Colony and Kolar Road, finding business leads by locality used to mean hours of manual searching. Geonayan changes that: search by PIN code or area name and get phone numbers, emails, addresses, and ratings in one place, ready to export to Excel.

Whether you're building an audit panel of CAs in MP Nagar, sourcing law firms in New Market, or mapping tax consultants across Arera Colony and Shahpura, Geonayan pulls data from Google Maps and enriches it with emails where possible. Our Bhopal heatmap covers MP Nagar, New Market, Arera Colony, Shahpura, Kolar Road, Berasia Road, Hoshangabad Road, Lalghati, Bairagarh, and Habibganj.

Start with 10 free searches. No credit card required. Perfect for CAs, legal teams, and BD professionals who need Bhopal leads fast.`,

  Visakhapatnam: `Visakhapatnam's port and industrial economy drives demand for chartered accountants, law firms, and tax consultants. From Dwaraka Nagar and MVP Colony to Seethammadhara and Madhurawada, finding business leads by locality used to mean manual Google Maps scrolling. Geonayan lets you search Vizag by PIN or area, get phone numbers and emails, and export to Excel with one click.

Search for CAs in Dwaraka Nagar, law firms in Jagadamba, or auditors in Gajuwaka — you get up to 20 results per query with ratings, addresses, websites, and phone numbers. Our Visakhapatnam heatmap covers Dwaraka Nagar, MVP Colony, Seethammadhara, Jagadamba, Siripuram, Gajuwaka, Madhurawada, Rushikonda, Waltair, and Dabagardens.

Sign up for free and get 10 searches. No subscription. Ideal for CAs, legal teams, and sales professionals building prospect lists in Visakhapatnam.`,

  Dubai: `Dubai is a global hub for professional services — chartered accountants, law firms, tax consultants, and advisory firms. From Business Bay and DIFC to Deira, JLT, and Dubai Marina, finding business leads by locality used to mean manual searches. Geonayan lets you search Dubai by area, get phone numbers and emails, and export to Excel in seconds.

Search for CAs in DIFC, law firms in Business Bay, or auditors in JLT; each query returns results with ratings, addresses, websites, and phone numbers. Our Dubai heatmap covers Business Bay, DIFC, Deira, Bur Dubai, JLT, Downtown Dubai, Dubai Marina, Al Barsha, Karama, International City, Silicon Oasis, and JBR. Use it to see where firms are concentrated and run targeted lead searches.

Start with 10 free searches — no credit card required. Pay per search after that. Perfect for CAs, legal teams, and BD professionals building prospect lists in Dubai.`,

  "Abu Dhabi": `Abu Dhabi's capital status and diversified economy support a large professional services sector — chartered accountants, law firms, tax consultants. From Al Reem Island and Khalifa City to Al Zahiyah and Corniche, finding business leads by locality used to mean manual lists. Geonayan gives you one place to search by area, get phone numbers and emails, and export to Excel.

Search for CAs in Al Maryah Island, law firms in Al Khalidiyah, or auditors in Mussafah; each query returns names, ratings, addresses, websites, and phone numbers. Our Abu Dhabi heatmap covers Al Reem Island, Khalifa City, Al Zahiyah, Corniche, Al Maryah Island, Al Khalidiyah, Mussafah, Yas Island, Saadiyat Island, and Al Nahyan. Cached results mean repeat searches cost nothing.

Get 10 free searches on signup. No subscription. Ideal for CAs, legal teams, and sales professionals building prospect lists in Abu Dhabi.`,

  Sharjah: `Sharjah's business and industrial zones host chartered accountants, law firms, and tax consultants serving the UAE. From Al Nahda and Al Majaz to Al Khan and University City, finding business leads by locality used to mean scattered Google searches. Geonayan lets you search Sharjah by area, get phone numbers and emails, and export to Excel with one click.

Search for CAs in Al Majaz, law firms in Al Taawun, or auditors in Industrial Area — you get results with ratings, addresses, websites, and phone numbers. Our Sharjah heatmap covers Al Nahda, Al Majaz, Al Khan, University City, Industrial Area, Al Taawun, Muwaileh, Al Qasimia, Al Majarah, and Wasit.

Start with 10 free searches. No credit card. Perfect for CAs, legal firms, and sales teams building prospect lists in Sharjah.`,

  Johannesburg: `Johannesburg is South Africa's economic centre and home to thousands of chartered accountants, law firms, tax consultants, and professional services. From Sandton and Rosebank to Melrose and Fourways, finding business leads by locality used to mean manual Google Maps searches. Geonayan lets you search by area, get phone numbers and emails, and export to Excel in seconds.

Search for CAs in Sandton, law firms in Rosebank, or auditors in Midrand; each query returns up to 20 results with ratings, addresses, websites, and phone numbers. Our Johannesburg heatmap covers Sandton, Rosebank, Melrose, Hyde Park, Fourways, Randburg, Midrand, Centurion, Pretoria CBD, and Houghton. Use it to see business density and run targeted lead searches.

Sign up for free and get 10 searches. No subscription. Ideal for CAs, legal teams, and BD professionals building prospect lists in Johannesburg.`,

  "Cape Town": `Cape Town's finance and business sector relies on chartered accountants, law firms, and tax consultants. From Cape Town CBD and Sea Point to Claremont and Constantia, finding business leads by locality used to mean manual lists. Geonayan gives you one place to search by area, get phone numbers and emails, and export to Excel.

Search for CAs in Cape Town CBD, law firms in Sea Point, or auditors in Stellenbosch; you get names, ratings, addresses, websites, and phone numbers. Our Cape Town heatmap covers Cape Town CBD, Sea Point, Claremont, Constantia, Camps Bay, Stellenbosch, Somerset West, Durbanville, Bellville, and Observatory.

Get 10 free searches on signup. No credit card required. Perfect for CAs, legal teams, and sales professionals building prospect lists in Cape Town.`,

  Durban: `Durban's port and business economy supports chartered accountants, law firms, and tax consultants. From Umhlanga and Durban CBD to Berea and Morningside, finding business leads by locality used to mean manual Google Maps scrolling. Geonayan lets you search Durban by area, get phone numbers and emails, and export to Excel with one click.

Search for CAs in Umhlanga, law firms in Durban CBD, or auditors in Westville; each query returns results with ratings, addresses, websites, and phone numbers. Our Durban heatmap covers Umhlanga, Durban CBD, Berea, Morningside, Westville, Ballito, Pinetown, Glenwood, Florida Road, and La Lucia.

Start with 10 free searches. No subscription. Ideal for CAs, legal firms, and sales teams building prospect lists in Durban.`,

  "New York": `New York City is a global hub for accounting firms, law firms, tax consultants, and professional services. From Manhattan and Brooklyn to Queens and the Bronx, finding business leads by locality used to mean manual searches. Geonayan lets you search NYC by area, get phone numbers and emails, and export to Excel in seconds.

Search for accountants in Midtown Manhattan, law firms in Financial District, or tax consultants in Williamsburg; each query returns results with ratings, addresses, websites, and phone numbers. Our New York heatmap covers Manhattan, Brooklyn, Queens, Bronx, Staten Island, Midtown Manhattan, Financial District, Upper East Side, Williamsburg, and Long Island City.

Sign up for free and get 10 searches. No credit card required. Perfect for BD teams and professionals building prospect lists in New York.`,

  "Los Angeles": `Los Angeles hosts a vast professional services sector — accountants, law firms, tax consultants — across Downtown LA, Santa Monica, Beverly Hills, and beyond. Finding business leads by locality used to mean manual Google Maps searches. Geonayan lets you search LA by area, get phone numbers and emails, and export to Excel with one click.

Search for accountants in Downtown LA, law firms in Beverly Hills, or tax consultants in Pasadena; you get up to 20 results per query with ratings, addresses, websites, and phone numbers. Our LA heatmap covers Downtown LA, Santa Monica, Beverly Hills, Hollywood, Pasadena, West Hollywood, Culver City, Glendale, Burbank, Long Beach, Torrance, and Irvine.

Get 10 free searches on signup. No subscription. Ideal for CAs, legal teams, and sales professionals building prospect lists in Los Angeles.`,

  Chicago: `Chicago's business and legal community includes thousands of accountants, law firms, and tax consultants. From Downtown Chicago and The Loop to River North and Lincoln Park, finding business leads by locality used to mean manual lists. Geonayan gives you one place to search by area, get phone numbers and emails, and export to Excel.

Search for accountants in The Loop, law firms in River North, or tax consultants in Evanston; each query returns names, ratings, addresses, websites, and phone numbers. Our Chicago heatmap covers Downtown Chicago, The Loop, River North, Lincoln Park, Wicker Park, Evanston, Oak Park, Naperville, Schaumburg, and Skokie.

Start with 10 free searches. No credit card. Perfect for CAs, legal teams, and BD professionals building prospect lists in Chicago.`,

  Houston: `Houston's energy and corporate base drives demand for accountants, law firms, and tax consultants. From Downtown Houston and Midtown to The Woodlands and Sugar Land, finding business leads by locality used to mean scattered Google searches. Geonayan lets you search Houston by area, get phone numbers and emails, and export to Excel in seconds.

Search for accountants in Downtown Houston, law firms in Galleria, or tax consultants in The Woodlands; you get results with ratings, addresses, websites, and phone numbers. Our Houston heatmap covers Downtown Houston, Midtown Houston, The Woodlands, Sugar Land, Katy, Galleria, Rice Village, Montrose, Heights, and Memorial.

Sign up for free and get 10 searches. No subscription. Ideal for CAs, legal teams, and sales professionals building prospect lists in Houston.`,

  Miami: `Miami's finance and real estate sector relies on accountants, law firms, and tax consultants. From Downtown Miami and Miami Beach to Brickell and Wynwood, finding business leads by locality used to mean manual Google Maps scrolling. Geonayan lets you search Miami by area, get phone numbers and emails, and export to Excel with one click.

Search for accountants in Brickell, law firms in Downtown Miami, or tax consultants in Coral Gables; each query returns up to 20 results with ratings, addresses, websites, and phone numbers. Our Miami heatmap covers Downtown Miami, Miami Beach, Brickell, Wynwood, Coral Gables, Coconut Grove, Doral, Fort Lauderdale, Boca Raton, and Key Biscayne.

Get 10 free searches on signup. No credit card required. Perfect for CAs, legal firms, and sales teams building prospect lists in Miami.`,

  Tokyo: `Tokyo is a global centre for professional services — accountants, law firms, tax consultants, and advisory firms. From Shibuya and Shinjuku to Ginza and Roppongi, finding business leads by locality used to mean manual searches. Geonayan lets you search Tokyo by area, get phone numbers and emails, and export to Excel in seconds.

Search for accountants in Marunouchi, law firms in Shibuya, or tax consultants in Shinagawa; each query returns results with ratings, addresses, websites, and phone numbers. Our Tokyo heatmap covers Shibuya, Shinjuku, Ginza, Roppongi, Shinagawa, Marunouchi, Akihabara, Ebisu, Meguro, and Odaiba.

Start with 10 free searches. No credit card. Ideal for CAs, legal teams, and BD professionals building prospect lists in Tokyo.`,

  Osaka: `Osaka's business and commercial sector supports accountants, law firms, and tax consultants across Namba, Umeda, Shinsaibashi, and beyond. Finding leads by locality used to mean manual Google Maps searches. Geonayan lets you search Osaka by area, get phone numbers and emails, and export to Excel with one click.

Search for accountants in Umeda, law firms in Namba, or tax consultants in Tennoji; you get up to 20 results per query with ratings, addresses, websites, and phone numbers. Our Osaka heatmap covers Namba, Umeda, Shinsaibashi, Tennoji, Shin-Osaka, Dotonbori, Amerika-mura, Kyobashi, Tanimachi, and Fukushima.

Sign up for free and get 10 searches. No subscription. Perfect for CAs, legal teams, and sales professionals building prospect lists in Osaka.`,

  London: `London is a global hub for chartered accountants, law firms, tax consultants, and professional services. From the City of London and Westminster to Canary Wharf and Shoreditch, finding business leads by locality used to mean manual lists. Geonayan gives you one place to search by area, get phone numbers and emails, and export to Excel.

Search for accountants in the City of London, law firms in Canary Wharf, or tax consultants in Westminster; each query returns names, ratings, addresses, websites, and phone numbers. Our London heatmap covers City of London, Westminster, Canary Wharf, Shoreditch, Camden, Kensington, Chelsea, Stratford, Greenwich, and Croydon.

Get 10 free searches on signup. No credit card required. Ideal for CAs, legal teams, and BD professionals building prospect lists in London.`,

  Manchester: `Manchester's business and legal sector includes accountants, law firms, and tax consultants across the city centre, Salford, MediaCityUK, and beyond. Finding business leads by locality used to mean scattered Google searches. Geonayan lets you search Manchester by area, get phone numbers and emails, and export to Excel in seconds.

Search for accountants in Manchester City Centre, law firms in Spinningfields, or tax consultants in Didsbury; you get results with ratings, addresses, websites, and phone numbers. Our Manchester heatmap covers Manchester City Centre, Salford, MediaCityUK, Northern Quarter, Spinningfields, Didsbury, Chorlton, Trafford Park, Ancoats, and Deansgate.

Start with 10 free searches. No subscription. Perfect for CAs, legal teams, and sales professionals building prospect lists in Manchester.`,

  Birmingham: `Birmingham is a major UK centre for chartered accountants, law firms, and tax consultants. From Birmingham City Centre and the Jewellery Quarter to Edgbaston and Solihull, finding business leads by locality used to mean manual Google Maps scrolling. Geonayan lets you search Birmingham by area, get phone numbers and emails, and export to Excel with one click.

Search for accountants in Birmingham City Centre, law firms in the Jewellery Quarter, or tax consultants in Edgbaston; each query returns up to 20 results with ratings, addresses, websites, and phone numbers. Our Birmingham heatmap covers Birmingham City Centre, Jewellery Quarter, Edgbaston, Digbeth, Solihull, Sutton Coldfield, Harborne, Moseley, Erdington, and New Street.

Sign up for free and get 10 searches. No credit card. Ideal for CAs, legal firms, and sales teams building prospect lists in Birmingham.`,

  Berlin: `Berlin's startup and corporate ecosystem relies on accountants, law firms, tax consultants, and advisory firms. From Mitte and Kreuzberg to Prenzlauer Berg and Charlottenburg, finding business leads by locality used to mean manual searches. Geonayan lets you search Berlin by area, get phone numbers and emails, and export to Excel in seconds.

Search for accountants in Mitte, law firms in Friedrichshain, or tax consultants in Charlottenburg; each query returns results with ratings, addresses, websites, and phone numbers. Our Berlin heatmap covers Mitte, Kreuzberg, Prenzlauer Berg, Charlottenburg, Friedrichshain, Alexanderplatz, Potsdamer Platz, Schöneberg, Neukölln, and Tiergarten.

Get 10 free searches on signup. No subscription. Perfect for CAs, legal teams, and BD professionals building prospect lists in Berlin.`,

  Munich: `Munich's finance and corporate sector supports accountants, law firms, and tax consultants across Marienplatz, Schwabing, Maxvorstadt, and beyond. Finding leads by locality used to mean manual Google Maps searches. Geonayan gives you one place to search by area, get phone numbers and emails, and export to Excel.

Search for accountants in Marienplatz, law firms in Schwabing, or tax consultants in Maxvorstadt; you get names, ratings, addresses, websites, and phone numbers. Our Munich heatmap covers Marienplatz, Schwabing, Maxvorstadt, Bogenhausen, Sendling, Haidhausen, Westend, Pasing, Garching, and Freising.

Start with 10 free searches. No credit card required. Ideal for CAs, legal teams, and sales professionals building prospect lists in Munich.`,

  Frankfurt: `Frankfurt is Germany's financial centre and home to thousands of accountants, law firms, and tax consultants. From Frankfurt am Main Zentrum and Sachsenhausen to Westend and Bornheim, finding business leads by locality used to mean manual lists. Geonayan lets you search Frankfurt by area, get phone numbers and emails, and export to Excel with one click.

Search for accountants in Frankfurt Zentrum, law firms in Westend, or tax consultants near the Airport; each query returns up to 20 results with ratings, addresses, websites, and phone numbers. Our Frankfurt heatmap covers Frankfurt am Main Zentrum, Sachsenhausen, Westend, Bornheim, Ostend, Bockenheim, Nordend, Eckenheim, Airport, and Messe.

Sign up for free and get 10 searches. No subscription. Perfect for CAs, legal firms, and sales teams building prospect lists in Frankfurt.`,

  Paris: `Paris is a global hub for chartered accountants, law firms, tax consultants, and professional services. From the 1er Arrondissement and Le Marais to La Défense and Saint-Germain, finding business leads by locality used to mean scattered Google searches. Geonayan lets you search Paris by area, get phone numbers and emails, and export to Excel in seconds.

Search for accountants in La Défense, law firms in Le Marais, or tax consultants in Champs-Élysées; you get results with ratings, addresses, websites, and phone numbers. Our Paris heatmap covers 1er Arrondissement, Le Marais, Saint-Germain, Champs-Élysées, La Défense, Montmartre, Bastille, Opéra, Latin Quarter, and Belleville.

Get 10 free searches on signup. No credit card. Ideal for CAs, legal teams, and BD professionals building prospect lists in Paris.`,

  Lyon: `Lyon's business and legal sector includes accountants, law firms, and tax consultants across Presqu'île, Part-Dieu, Confluence, and Vieux Lyon. Finding business leads by locality used to mean manual Google Maps scrolling. Geonayan lets you search Lyon by area, get phone numbers and emails, and export to Excel with one click.

Search for accountants in Part-Dieu, law firms in Presqu'île, or tax consultants in Confluence; each query returns names, ratings, addresses, websites, and phone numbers. Our Lyon heatmap covers Presqu'île, Part-Dieu, Confluence, Vieux Lyon, Croix-Rousse, Gerland, Villeurbanne, Caluire, Tête d'Or, and Brotteaux.

Start with 10 free searches. No subscription. Perfect for CAs, legal teams, and sales professionals building prospect lists in Lyon.`,

  Singapore: `Singapore is a global financial centre and home to thousands of accountants, law firms, tax consultants, and professional services. From CBD and Orchard Road to Marina Bay and Raffles Place, finding business leads by locality used to mean manual searches. Geonayan lets you search Singapore by area, get phone numbers and emails, and export to Excel in seconds.

Search for accountants in CBD Singapore, law firms in Raffles Place, or tax consultants in Marina Bay; each query returns up to 20 results with ratings, addresses, websites, and phone numbers. Our Singapore heatmap covers CBD, Orchard Road, Marina Bay, Raffles Place, Bugis, Tiong Bahru, Sentosa, Jurong East, Changi, and Clarke Quay.

Sign up for free and get 10 searches. No credit card required. Ideal for CAs, legal teams, and BD professionals building prospect lists in Singapore.`,

  Sydney: `Sydney's finance and business sector relies on accountants, law firms, and tax consultants across the CBD, North Sydney, Parramatta, and beyond. Finding business leads by locality used to mean manual lists. Geonayan gives you one place to search by area, get phone numbers and emails, and export to Excel.

Search for accountants in Sydney CBD, law firms in North Sydney, or tax consultants in Chatswood; you get names, ratings, addresses, websites, and phone numbers. Our Sydney heatmap covers Sydney CBD, North Sydney, Parramatta, Chatswood, Bondi, Manly, Surry Hills, Darling Harbour, Macquarie Park, and Ryde.

Get 10 free searches on signup. No subscription. Perfect for CAs, legal teams, and sales professionals building prospect lists in Sydney.`,

  Melbourne: `Melbourne hosts a strong professional services sector — chartered accountants, law firms, tax consultants — across the CBD, Southbank, Docklands, and beyond. Finding leads by locality used to mean manual Google Maps searches. Geonayan lets you search Melbourne by area, get phone numbers and emails, and export to Excel with one click.

Search for accountants in Melbourne CBD, law firms in Southbank, or tax consultants in St Kilda; each query returns results with ratings, addresses, websites, and phone numbers. Our Melbourne heatmap covers Melbourne CBD, Southbank, Docklands, St Kilda, Carlton, Richmond, Fitzroy, South Yarra, Box Hill, and Hawthorn.

Start with 10 free searches. No credit card. Ideal for CAs, legal firms, and sales teams building prospect lists in Melbourne.`,

  Toronto: `Toronto is Canada's business and financial centre, with thousands of accountants, law firms, and tax consultants. From Downtown Toronto and the Financial District to Yorkville and Liberty Village, finding business leads by locality used to mean scattered Google searches. Geonayan lets you search Toronto by area, get phone numbers and emails, and export to Excel in seconds.

Search for accountants in Financial District Toronto, law firms in Yorkville, or tax consultants in North York; you get up to 20 results per query with ratings, addresses, websites, and phone numbers. Our Toronto heatmap covers Downtown Toronto, Financial District, Yorkville, Liberty Village, Leslieville, Scarborough, Mississauga, North York, Etobicoke, and Markham.

Sign up for free and get 10 searches. No credit card required. Perfect for CAs, legal teams, and BD professionals building prospect lists in Toronto.`,

  Vancouver: `Vancouver's business and legal community includes accountants, law firms, and tax consultants across Downtown, Gastown, Yaletown, and Kitsilano. Finding business leads by locality used to mean manual Google Maps scrolling. Geonayan lets you search Vancouver by area, get phone numbers and emails, and export to Excel with one click.

Search for accountants in Downtown Vancouver, law firms in Yaletown, or tax consultants in Burnaby; each query returns names, ratings, addresses, websites, and phone numbers. Our Vancouver heatmap covers Downtown Vancouver, Gastown, Yaletown, Kitsilano, West End, Burnaby, Richmond BC, Surrey, North Vancouver, and Coquitlam.

Get 10 free searches on signup. No subscription. Ideal for CAs, legal teams, and sales professionals building prospect lists in Vancouver.`,

  Riyadh: `Riyadh is Saudi Arabia's capital and a major centre for accountants, law firms, tax consultants, and professional services. From King Fahd Road and Olaya to Al Malaz and Al Nakheel, finding business leads by locality used to mean manual searches. Geonayan lets you search Riyadh by area, get phone numbers and emails, and export to Excel in seconds.

Search for accountants in Olaya, law firms in King Fahd Road, or tax consultants in Al Rawdah; each query returns results with ratings, addresses, websites, and phone numbers. Our Riyadh heatmap covers King Fahd Road, Olaya, Al Malaz, Al Murjan, Al Nakheel, Granada, Al Rawdah, Al Sulimaniyah, Al Yasmin, and Digital City.

Start with 10 free searches. No credit card. Perfect for CAs, legal teams, and BD professionals building prospect lists in Riyadh.`,

  Jeddah: `Jeddah's commercial and port economy supports accountants, law firms, and tax consultants across Al Hamra, Al Rawdah, Obhur, and beyond. Finding business leads by locality used to mean manual lists. Geonayan gives you one place to search Jeddah by area, get phone numbers and emails, and export to Excel.

Search for accountants in Al Rawdah, law firms in Al Hamra, or tax consultants in Corniche Jeddah; you get names, ratings, addresses, websites, and phone numbers. Our Jeddah heatmap covers Al Hamra, Al Rawdah, Al Shati, Obhur, Al Andalus, Al Naeem, Prince Mohammed bin Abdulaziz Road, Corniche, Al Faisaliah, and Al Mohammadiyah.

Sign up for free and get 10 searches. No subscription. Ideal for CAs, legal teams, and sales professionals building prospect lists in Jeddah.`,
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

/** For Market Map: localities by city display name (e.g. "Delhi", "Dubai"). */
export function getLocalitiesByCity() {
  return LOCALITIES;
}

/** For Market Map: city display names that have locality data, in stable order. */
export function getMapCityNames() {
  return Object.keys(LOCALITIES);
}
