/**
 * Contact extraction from website HTML.
 * Fetches a URL, extracts emails (mailto + regex), phones (tel:), WhatsApp, social links.
 * Tries /contact or /about if no emails on homepage. Filters junk emails.
 */

const FETCH_TIMEOUT_MS = 10000;
const USER_AGENT = "LeadFinder/1.0 (Contact enrichment; +https://leadfinder.app)";

const JUNK_EMAIL_PATTERNS = [
  /noreply/i,
  /no-reply/i,
  /donotreply/i,
  /sentry/i,
  /webpack/i,
  /example\.com/i,
  /@.*\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf)/i,
  /wix\.com/i,
  /sentry\.io/i,
  /github\.com/i,
  /facebook\.com/i,
  /twitter\.com/i,
  /linkedin\.com/i,
  /schema\.org/i,
  /placeholder/i,
  /test@/i,
  /admin@localhost/i,
];

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const MAILTO_REGEX = /mailto:([^"'\s>]+)/gi;
const TEL_REGEX = /tel:([^"'\s>]+)/gi;
const WA_REGEX = /wa\.me\/(\d+)/gi;
const LINKEDIN_REGEX = /https?:\/\/(www\.)?linkedin\.com\/[^\s"'>]+/gi;
const TWITTER_REGEX = /https?:\/\/(www\.)?(twitter|x)\.com\/[^\s"'>]+/gi;
const FACEBOOK_REGEX = /https?:\/\/(www\.)?(facebook|fb)\.com\/[^\s"'>]+/gi;
const INSTAGRAM_REGEX = /https?:\/\/(www\.)?instagram\.com\/[^\s"'>]+/gi;

function isJunkEmail(email) {
  if (!email || email.length > 80) return true;
  return JUNK_EMAIL_PATTERNS.some((re) => re.test(email));
}

function normalizePhone(phone) {
  if (!phone) return "";
  return String(phone).replace(/\D/g, "").trim();
}

function normalizeWaNumber(wa) {
  const n = String(wa).replace(/\D/g, "").trim();
  if (n.startsWith("0")) return n.slice(1);
  return n;
}

function unique(arr) {
  return [...new Set(arr)];
}

function extractFromHtml(html) {
  const emails = [];
  const phones = [];
  const whatsapp = [];
  const linkedin = [];
  const twitter = [];
  const facebook = [];
  const instagram = [];

  let m;
  while ((m = MAILTO_REGEX.exec(html)) !== null) {
    const e = (m[1] || "").trim().toLowerCase();
    if (e && !isJunkEmail(e)) emails.push(e);
  }
  if (emails.length === 0) {
    const regex = new RegExp(EMAIL_REGEX.source, "g");
    while ((m = regex.exec(html)) !== null) {
      const e = (m[0] || "").trim().toLowerCase();
      if (e && !isJunkEmail(e)) emails.push(e);
    }
  }

  const telRegex = new RegExp(TEL_REGEX.source, "gi");
  while ((m = telRegex.exec(html)) !== null) {
    const p = normalizePhone(m[1]);
    if (p && p.length >= 8) phones.push(p);
  }

  const waRegex = new RegExp(WA_REGEX.source, "gi");
  while ((m = waRegex.exec(html)) !== null) {
    const w = normalizeWaNumber(m[1]);
    if (w) whatsapp.push(w);
  }

  const liRegex = new RegExp(LINKEDIN_REGEX.source, "gi");
  while ((m = liRegex.exec(html)) !== null) {
    const u = (m[0] || "").trim();
    if (u && !u.includes("/shareArticle") && !u.includes("/post")) linkedin.push(u);
  }
  const twRegex = new RegExp(TWITTER_REGEX.source, "gi");
  while ((m = twRegex.exec(html)) !== null) {
    const u = (m[0] || "").trim();
    if (u) twitter.push(u);
  }
  const fbRegex = new RegExp(FACEBOOK_REGEX.source, "gi");
  while ((m = fbRegex.exec(html)) !== null) {
    const u = (m[0] || "").trim();
    if (u) facebook.push(u);
  }
  const igRegex = new RegExp(INSTAGRAM_REGEX.source, "gi");
  while ((m = igRegex.exec(html)) !== null) {
    const u = (m[0] || "").trim();
    if (u) instagram.push(u);
  }

  return {
    emails: unique(emails),
    phones: unique(phones),
    whatsapp: unique(whatsapp),
    linkedin: unique(linkedin),
    twitter: unique(twitter),
    facebook: unique(facebook),
    instagram: unique(instagram),
  };
}

async function fetchWithTimeout(url, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT },
      redirect: "follow",
    });
    clearTimeout(id);
    if (!res.ok) return null;
    const text = await res.text();
    return text;
  } catch {
    clearTimeout(id);
    return null;
  }
}

function resolveUrl(base, path) {
  try {
    if (path.startsWith("http")) return path;
    const u = new URL(base);
    const p = path.startsWith("/") ? path : `/${path}`;
    return new URL(p, u.origin).href;
  } catch {
    return null;
  }
}

/**
 * Extract contacts from a single website URL.
 * Tries homepage first; if no emails, tries /contact and /about.
 * @param {string} websiteUrl - Full URL (e.g. https://example.com)
 * @returns {Promise<{ emails, phones, whatsapp, linkedin, twitter, facebook, instagram, has_data }>}
 */
export async function extractContacts(websiteUrl) {
  const empty = {
    emails: [],
    phones: [],
    whatsapp: [],
    linkedin: [],
    twitter: [],
    facebook: [],
    instagram: [],
    has_data: false,
  };

  if (!websiteUrl || typeof websiteUrl !== "string") return empty;
  let url = websiteUrl.trim();
  if (!url.startsWith("http")) url = `https://${url}`;

  let html = await fetchWithTimeout(url);
  let data = html ? extractFromHtml(html) : { emails: [], phones: [], whatsapp: [], linkedin: [], twitter: [], facebook: [], instagram: [] };

  if (data.emails.length === 0) {
    for (const path of ["/contact", "/contact-us", "/about", "/about-us"]) {
      const contactUrl = resolveUrl(url, path);
      if (!contactUrl) continue;
      const contactHtml = await fetchWithTimeout(contactUrl);
      if (contactHtml) {
        const contactData = extractFromHtml(contactHtml);
        data = {
          emails: unique([...data.emails, ...contactData.emails]),
          phones: unique([...data.phones, ...contactData.phones]),
          whatsapp: unique([...data.whatsapp, ...contactData.whatsapp]),
          linkedin: unique([...data.linkedin, ...contactData.linkedin]),
          twitter: unique([...data.twitter, ...contactData.twitter]),
          facebook: unique([...data.facebook, ...contactData.facebook]),
          instagram: unique([...data.instagram, ...contactData.instagram]),
        };
        if (data.emails.length > 0) break;
      }
    }
  }

  const has_data =
    data.emails.length > 0 ||
    data.phones.length > 0 ||
    data.whatsapp.length > 0 ||
    data.linkedin.length > 0 ||
    data.twitter.length > 0 ||
    data.facebook.length > 0 ||
    data.instagram.length > 0;

  return {
    emails: data.emails,
    phones: data.phones,
    whatsapp: data.whatsapp,
    linkedin: data.linkedin,
    twitter: data.twitter,
    facebook: data.facebook,
    instagram: data.instagram,
    has_data,
  };
}

/**
 * Process multiple URLs with limited concurrency.
 * @param {string[]} websites - Array of website URLs
 * @param {number} concurrency - Max concurrent fetches (default 3)
 * @returns {Promise<Array<{ url, ...extractContactsResult }>>}
 */
export async function batchExtractContacts(websites, concurrency = 3) {
  const urls = [...new Set((websites || []).filter(Boolean))];
  const results = [];
  let index = 0;

  async function run() {
    while (index < urls.length) {
      const i = index++;
      const url = urls[i];
      try {
        const data = await extractContacts(url);
        results[i] = { url, ...data };
      } catch (err) {
        results[i] = {
          url,
          emails: [],
          phones: [],
          whatsapp: [],
          linkedin: [],
          twitter: [],
          facebook: [],
          instagram: [],
          has_data: false,
          error: err.message,
        };
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, urls.length) }, () => run());
  await Promise.all(workers);
  return results.filter(Boolean);
}
