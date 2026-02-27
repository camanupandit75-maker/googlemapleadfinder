import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Geonayan — B2B Lead Generation Tool for India | Find Business Leads from Google Maps",
  description:
    "Search any PIN code or city to find chartered accountants, law firms, restaurants and more. Get phone numbers, emails, ratings and export to Excel. 10 free searches on signup.",
  keywords: "lead generation India, Google Maps leads, find CA firms, business data extraction, B2B leads India, geonayan",
  openGraph: {
    title: "Geonayan — Find Business Leads from Google Maps",
    description: "Search any PIN code or city. Get phone, email, ratings. Export to Excel. 10 free searches.",
    url: "https://geonayan.com",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${dmSans.variable}`}>
      <head>
        <link rel="canonical" href="https://geonayan.com" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
