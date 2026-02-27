import { getAllCitySlugs } from "@/lib/city-leads-data";

export default function sitemap() {
  const baseUrl = "https://geonayan.com";
  const lastModified = new Date();

  const cityPages = getAllCitySlugs().map((slug) => ({
    url: `${baseUrl}/leads/${slug}`,
    lastModified,
    priority: 0.7,
  }));

  return [
    { url: baseUrl, lastModified, priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified, priority: 0.7 },
    { url: `${baseUrl}/testimonials`, lastModified, priority: 0.6 },
    { url: `${baseUrl}/disclaimer`, lastModified, priority: 0.3 },
    { url: `${baseUrl}/login`, lastModified, priority: 0.5 },
    { url: `${baseUrl}/signup`, lastModified, priority: 0.7 },
    ...cityPages,
  ];
}

