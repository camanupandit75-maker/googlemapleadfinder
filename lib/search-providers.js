/**
 * Search providers: Google Places API (New) and SerpAPI.
 * Standard result shape: { place_id, name, category, rating, review_count, phone, address, website, latitude, longitude, hours, maps_url, raw_data }
 */

const PROVIDER_GOOGLE = "google_places";
const PROVIDER_SERPAPI = "serpapi";

const FIELDS =
  "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.googleMapsUri,places.location,places.primaryType,places.primaryTypeDisplayName,places.regularOpeningHours,nextPageToken";

function getActiveProvider(override) {
  if (override === PROVIDER_GOOGLE || override === "google") return PROVIDER_GOOGLE;
  if (override === PROVIDER_SERPAPI || override === "serpapi") return PROVIDER_SERPAPI;
  const env = (process.env.SEARCH_PROVIDER || "google_places").toLowerCase();
  return env === "serpapi" ? PROVIDER_SERPAPI : PROVIDER_GOOGLE;
}

/**
 * Map Google Places API (New) response to standard format.
 */
function mapGooglePlace(place) {
  const loc = place.location;
  const hours = place.regularOpeningHours?.weekdayDescriptions?.length
    ? place.regularOpeningHours.weekdayDescriptions.join("; ")
    : null;
  return {
    place_id: place.id?.replace("places/", "") || null,
    name: place.displayName?.text ?? null,
    category: place.primaryTypeDisplayName?.text ?? place.primaryType ?? null,
    rating: place.rating ?? null,
    review_count: place.userRatingCount ?? null,
    phone: place.nationalPhoneNumber ?? place.internationalPhoneNumber ?? null,
    address: place.formattedAddress ?? null,
    website: place.websiteUri ?? null,
    latitude: loc?.latitude ?? null,
    longitude: loc?.longitude ?? null,
    hours: hours || null,
    maps_url: place.googleMapsUri ?? null,
    raw_data: place,
  };
}

/**
 * Map SerpAPI local_results item to standard format.
 */
function mapSerpResult(item) {
  const gps = item.gps_coordinates || {};
  return {
    place_id: item.place_id ?? item.data_id ?? null,
    name: item.title ?? null,
    category: item.type ?? null,
    rating: item.rating != null ? Number(item.rating) : null,
    review_count: item.reviews != null ? Number(item.reviews) : null,
    phone: item.phone ?? null,
    address: item.address ?? null,
    website: item.website ?? null,
    latitude: gps.latitude ?? null,
    longitude: gps.longitude ?? null,
    hours: item.hours ? (Array.isArray(item.hours) ? item.hours.join("; ") : String(item.hours)) : null,
    maps_url: item.link ?? item.gps_coordinates?.link ?? null,
    raw_data: item,
  };
}

/**
 * Return an alternate query string to run a second search (for deep search when no nextPageToken).
 */
function getAlternateQuery(query) {
  const q = (query || "").trim().toLowerCase();
  const alternates = {
    "chartered accountants": "CA firms",
    "tax consultants": "Tax firms",
    "law firms": "Lawyers",
    "auditing firms": "Auditors",
    "ca firms": "Chartered Accountants",
  };
  for (const [key, alt] of Object.entries(alternates)) {
    if (q.includes(key)) return alt;
  }
  return null;
}

/**
 * Google Places API (New) - POST places:searchText
 * @param {string} query
 * @param {string} location
 * @param {{ deep?: boolean }} options - deep: fetch second page (up to 40 results) or run alternate query
 */
async function searchGooglePlaces(query, location, options = {}) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY is not set");

  const textQuery = [query, location].filter(Boolean).join(" in ");

  const doRequest = (pageToken = null) => {
    const body = {
      textQuery,
      maxResultCount: 20,
      languageCode: "en",
    };
    if (pageToken) body.pageToken = pageToken;
    return fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELDS,
      },
      body: JSON.stringify(body),
    });
  };

  const res = await doRequest();
  const rawText = await res.text();
  if (!res.ok) {
    const errMsg = rawText.trim().startsWith("<") ? `Google Places API error: ${res.status}` : `Google Places API error: ${res.status} — ${rawText.slice(0, 200)}`;
    throw new Error(errMsg);
  }

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error("Google Places API returned an invalid response. Please try again.");
  }

  // Debug: log FULL first response to verify nextPageToken
  console.log("[Google Places] Page 1 full response keys:", Object.keys(data));
  console.log("[Google Places] Page 1 nextPageToken:", data.nextPageToken ?? "(none)");
  console.log("[Google Places] Page 1 full response (JSON):", JSON.stringify(data, null, 2).slice(0, 2000) + (JSON.stringify(data).length > 2000 ? "..." : ""));

  let places = data.places || [];
  const seen = new Set((places || []).map((p) => (p.id || "").replace("places/", "")).filter(Boolean));

  console.log("[Google Places] Page 1:", places.length, "results");

  if (options.deep) {
    if (data.nextPageToken) {
      const page1Count = places.length;
      console.log("[Google Places] nextPageToken present, waiting 2s then fetching page 2...");
      await new Promise((r) => setTimeout(r, 2000));
      const res2 = await doRequest(data.nextPageToken);
      const rawText2 = await res2.text();
      if (res2.ok) {
        try {
          const data2 = JSON.parse(rawText2);
          const page2 = data2.places || [];
          console.log("[Google Places] Page 2:", page2.length, "results");
          for (const p of page2) {
            const id = (p.id || "").replace("places/", "");
            if (id && !seen.has(id)) {
              seen.add(id);
              places.push(p);
            }
          }
          console.log("[Google Places] Page 1:", page1Count, "results, Page 2:", page2.length, "results, Total:", places.length);
        } catch (e2) {
          console.error("[Google Places] Page 2 parse error:", e2);
        }
      } else {
        console.warn("[Google Places] Page 2 request failed:", res2.status, rawText2.slice(0, 200));
      }
    } else {
      // No nextPageToken: run a second search with alternate query and combine
      const altQuery = getAlternateQuery(query);
      if (altQuery) {
        const textQuery2 = [altQuery, location].filter(Boolean).join(" in ");
        console.log("[Google Places] No nextPageToken. Running alternate search:", JSON.stringify(textQuery2));
        await new Promise((r) => setTimeout(r, 2000));
        try {
          const res2 = await fetch("https://places.googleapis.com/v1/places:searchText", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": apiKey,
              "X-Goog-FieldMask": FIELDS,
            },
            body: JSON.stringify({
              textQuery: textQuery2,
              maxResultCount: 20,
              languageCode: "en",
            }),
          });
          const rawText2 = await res2.text();
          if (res2.ok) {
            const data2 = JSON.parse(rawText2);
            const page2 = data2.places || [];
            console.log("[Google Places] Alternate search:", page2.length, "results");
            for (const p of page2) {
              const id = (p.id || "").replace("places/", "");
              if (id && !seen.has(id)) {
                seen.add(id);
                places.push(p);
              }
            }
            console.log("[Google Places] Page 1: 20 results, Alternate:", page2.length, "results, Total:", places.length);
          }
        } catch (e2) {
          console.error("[Google Places] Alternate search error:", e2);
        }
      } else {
        console.log("[Google Places] No nextPageToken and no alternate query. Total:", places.length);
      }
    }
  }

  return places.map(mapGooglePlace);
}

/**
 * SerpAPI Google Maps search
 */
async function searchSerpApi(query, location) {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) throw new Error("SERPAPI_KEY is not set");

  const q = [query, location].filter(Boolean).join(" in ");
  const params = new URLSearchParams({
    engine: "google_maps",
    q,
    type: "search",
    api_key: apiKey,
  });
  const res = await fetch(`https://serpapi.com/search.json?${params}`);

  const rawText = await res.text();
  if (!res.ok) {
    const errMsg = rawText.trim().startsWith("<") ? `SerpAPI error: ${res.status}` : `SerpAPI error: ${res.status} — ${rawText.slice(0, 200)}`;
    throw new Error(errMsg);
  }

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error("SerpAPI returned an invalid response. Please try again.");
  }
  const list = data.local_results || [];
  return list.map(mapSerpResult);
}

/**
 * Search places. provider can be "google_places" | "serpapi" or from env SEARCH_PROVIDER.
 * @param {{ deep?: boolean }} options - deep: for Google only, fetch up to 40 results (2 pages)
 * @returns {Promise<Array<{ place_id, name, category, rating, review_count, phone, address, website, latitude, longitude, hours, maps_url, raw_data }>>}
 */
export async function searchPlaces(query, location, providerOverride, options = {}) {
  const provider = getActiveProvider(providerOverride);
  if (provider === PROVIDER_SERPAPI) {
    return searchSerpApi(query, location);
  }
  return searchGooglePlaces(query, location, options);
}

export { getActiveProvider };
