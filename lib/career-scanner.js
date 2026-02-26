const CAREER_PATHS = [
  "/careers",
  "/career",
  "/jobs",
  "/hiring",
  "/work-with-us",
  "/join-us",
  "/join-our-team",
  "/opportunities",
  "/vacancies",
  "/openings",
  "/current-openings",
  "/life-at",
  "/people",
  "/about/careers",
  "/about/jobs",
  "/en/careers",
];

const HIRING_KEYWORDS = [
  "we are hiring",
  "we're hiring",
  "join our team",
  "open positions",
  "current openings",
  "job openings",
  "career opportunities",
  "apply now",
  "send your resume",
  "send your cv",
  "walk-in",
  "walk in interview",
  "vacancy",
  "vacancies",
  "looking for",
  "immediate joining",
  "urgent requirement",
  "freshers welcome",
  "experienced professionals",
  "hiring for",
  "positions available",
  "job description",
  "key responsibilities",
  "qualifications required",
  "apply here",
  "submit application",
  "recruitment",
  "talent acquisition",
  "work culture",
  "employee benefits",
  "why join us",
  "chartered accountant required",
  "ca required",
  "ca fresher",
  "article assistant",
  "articleship",
  "ca intern",
  "audit associate",
  "tax associate",
  "accounts executive",
  "senior accountant",
];

const JOB_TITLE_PATTERNS = [
  /(?:hiring|looking for|opening for|position:?|role:?|vacancy:?)\s*[:–-]?\s*(.+?)(?:\n|$)/gi,
  /(?:senior|junior|lead|associate|manager|head|director|intern|trainee|executive|analyst)\s+\w+(?:\s+\w+)?/gi,
  /(?:chartered accountant|ca |company secretary|cs |cma |cost accountant|tax consultant|auditor|accounts?\s+(?:executive|manager|officer))/gi,
];

const CSS_KEYWORDS = new Set([
  "position", "fixed", "relative", "absolute", "display", "margin", "padding",
  "width", "height", "border", "font", "color", "background", "dialog", "button",
  "aria", "overflow", "opacity",
]);

const HTML_CSS_CHARS = /[<>=;"'{}]/;

const NOISE_WORDS = ["px", "rem", "em", "auto", "none", "flex", "grid", "block", "inline"];

function stripHtmlAndCss(html) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/[=;"'<>{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isFalsePositive(match) {
  const lower = match.toLowerCase();
  if (match.length < 5) return true;
  if (/^[a-z]/.test(match.trim())) return true;
  if (HTML_CSS_CHARS.test(match)) return true;
  const words = lower.split(/\s+/);
  for (const word of words) {
    if (CSS_KEYWORDS.has(word)) return true;
  }
  for (const noise of NOISE_WORDS) {
    if (lower.includes(noise)) return true;
  }
  return false;
}

function normalizeJobTitle(match) {
  return match
    .replace(/<[^>]*>/g, "")
    .replace(/\b(?:hiring|looking for|opening for|position|role|vacancy)\b/gi, "")
    .replace(/[:–-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function scanWebsiteForCareers(websiteUrl) {
  if (!websiteUrl)
    return { is_hiring: false, career_url: null, job_titles: [], confidence: "none" };

  let baseUrl = websiteUrl;
  if (!baseUrl.startsWith("http")) baseUrl = "https://" + baseUrl;
  baseUrl = baseUrl.replace(/\/$/, "");

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(baseUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LeadFinder/1.0)" },
    });
    clearTimeout(timeout);

    if (!response.ok)
      return { is_hiring: false, career_url: null, job_titles: [], confidence: "none" };

    const html = (await response.text()).toLowerCase();
    let homepageHiring = false;
    let matchedKeywords = [];

    for (const keyword of HIRING_KEYWORDS) {
      if (html.includes(keyword.toLowerCase())) {
        homepageHiring = true;
        matchedKeywords.push(keyword);
      }
    }

    let careerUrl = null;
    for (const path of CAREER_PATHS) {
      if (
        html.includes(`href="${path}"`) ||
        html.includes(`href="${baseUrl}${path}"`) ||
        html.includes(`href=".${path}"`)
      ) {
        careerUrl = baseUrl + path;
        break;
      }
    }

    if (!careerUrl) {
      const careerLinkMatch = html.match(
        /href=["']([^"']*(?:career|job|hiring|work-with|join)[^"']*)["']/i
      );
      if (careerLinkMatch) {
        let foundUrl = careerLinkMatch[1];
        if (foundUrl.startsWith("/")) foundUrl = baseUrl + foundUrl;
        else if (!foundUrl.startsWith("http")) foundUrl = baseUrl + "/" + foundUrl;
        careerUrl = foundUrl;
      }
    }

    let careerPageHiring = false;
    let jobTitles = [];

    if (careerUrl) {
      try {
        const controller2 = new AbortController();
        const timeout2 = setTimeout(() => controller2.abort(), 10000);
        const careerResponse = await fetch(careerUrl, {
          signal: controller2.signal,
          headers: { "User-Agent": "Mozilla/5.0 (compatible; LeadFinder/1.0)" },
        });
        clearTimeout(timeout2);

        if (careerResponse.ok) {
          const careerHtml = await careerResponse.text();
          const careerText = careerHtml.toLowerCase();
          const cleanText = stripHtmlAndCss(careerHtml);

          for (const keyword of HIRING_KEYWORDS) {
            if (careerText.includes(keyword.toLowerCase())) {
              careerPageHiring = true;
              if (!matchedKeywords.includes(keyword)) matchedKeywords.push(keyword);
            }
          }

          for (const pattern of JOB_TITLE_PATTERNS) {
            const matches = cleanText.match(pattern);
            if (matches) {
              for (const match of matches) {
                const cleaned = normalizeJobTitle(match);
                if (
                  cleaned.length < 5 ||
                  cleaned.length >= 80 ||
                  isFalsePositive(cleaned) ||
                  jobTitles.includes(cleaned)
                ) {
                  continue;
                }
                jobTitles.push(cleaned);
              }
            }
          }
          jobTitles = jobTitles.filter((t) => {
            const lower = t.toLowerCase();
            return !NOISE_WORDS.some((w) => lower.includes(w));
          });
          jobTitles = [...new Set(jobTitles)].slice(0, 5);
        }
      } catch (e) {}
    }

    if (!careerUrl && !homepageHiring) {
      for (const path of CAREER_PATHS.slice(0, 5)) {
        try {
          const controller3 = new AbortController();
          const timeout3 = setTimeout(() => controller3.abort(), 5000);
          const tryUrl = baseUrl + path;
          const tryResponse = await fetch(tryUrl, {
            signal: controller3.signal,
            headers: { "User-Agent": "Mozilla/5.0 (compatible; LeadFinder/1.0)" },
          });
          clearTimeout(timeout3);
          if (tryResponse.ok && tryResponse.status === 200) {
            careerUrl = tryUrl;
            careerPageHiring = true;
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }

    const is_hiring = homepageHiring || careerPageHiring || !!careerUrl;
    let confidence = "none";
    if (careerPageHiring && jobTitles.length > 0) confidence = "high";
    else if (careerPageHiring || (homepageHiring && matchedKeywords.length >= 3))
      confidence = "high";
    else if (careerUrl || homepageHiring) confidence = "medium";
    else if (matchedKeywords.length > 0) confidence = "low";

    return {
      is_hiring,
      career_url: careerUrl,
      job_titles: jobTitles,
      matched_keywords: matchedKeywords.slice(0, 5),
      confidence,
    };
  } catch (error) {
    return { is_hiring: false, career_url: null, job_titles: [], confidence: "none" };
  }
}

async function batchScanCareers(businesses, concurrency = 3) {
  const results = [];
  for (let i = 0; i < businesses.length; i += concurrency) {
    const batch = businesses.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(async (biz) => {
        const result = await scanWebsiteForCareers(biz.website);
        return { ...biz, career_scan: result };
      })
    );
    results.push(...batchResults);
    if (i + concurrency < businesses.length)
      await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return results;
}

export { scanWebsiteForCareers, batchScanCareers };
