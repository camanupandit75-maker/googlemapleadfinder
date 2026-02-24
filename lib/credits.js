import { createServerSupabase } from "./supabase";
import crypto from "crypto";

const CACHE_TTL_HOURS = Number(process.env.CACHE_TTL_HOURS) || 24;

function cacheKey(query, location, provider) {
  const normalized = `${(query || "").toLowerCase().trim()}|${(location || "").toLowerCase().trim()}|${provider}`;
  return crypto.createHash("md5").update(normalized).digest("hex");
}

/**
 * @returns {Promise<number|null>} credits or null if profile not found
 */
export async function getUserCredits(userId) {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single();
  if (error || !data) return null;
  return data.credits;
}

/**
 * Deduct credits via RPC. Returns new balance or -1 if insufficient.
 */
export async function deductCredits(userId, amount, description) {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.rpc("deduct_credits", {
    p_user_id: userId,
    p_amount: amount,
    p_description: description || null,
  });
  if (error) throw error;
  return data;
}

/**
 * Add credits via RPC. Returns new balance.
 */
export async function addCredits(userId, amount, description, paymentId, orderId) {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.rpc("add_credits", {
    p_user_id: userId,
    p_amount: amount,
    p_description: description || null,
    p_razorpay_payment_id: paymentId || null,
    p_razorpay_order_id: orderId || null,
  });
  if (error) throw error;
  return data;
}

/**
 * Get cached results if key exists and not expired.
 * @returns {Promise<Array|null>} results or null
 */
export async function getCachedResults(query, location, provider) {
  const key = cacheKey(query, location, provider);
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("result_cache")
    .select("results, expires_at")
    .eq("cache_key", key)
    .single();
  if (error || !data) return null;
  if (new Date(data.expires_at) <= new Date()) return null;
  return data.results;
}

/**
 * Store results in cache with TTL.
 */
export async function setCachedResults(query, location, provider, results) {
  const key = cacheKey(query, location, provider);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + CACHE_TTL_HOURS);
  const supabase = createServerSupabase();
  await supabase.from("result_cache").upsert(
    {
      cache_key: key,
      query,
      provider,
      results,
      result_count: Array.isArray(results) ? results.length : 0,
      expires_at: expiresAt.toISOString(),
    },
    { onConflict: "cache_key" }
  );
}

/**
 * Save search and search_results; increment total_searches on profile.
 */
export async function saveSearch(userId, query, location, provider, results, creditsUsed = 1) {
  const supabase = createServerSupabase();
  const { data: searchRow, error: searchError } = await supabase
    .from("searches")
    .insert({
      user_id: userId,
      query,
      location: location || null,
      provider,
      result_count: Array.isArray(results) ? results.length : 0,
      credits_used: creditsUsed,
    })
    .select("id")
    .single();
  if (searchError) throw searchError;
  const searchId = searchRow.id;

  const rows = (Array.isArray(results) ? results : []).map((r) => ({
    search_id: searchId,
    place_id: r.place_id ?? null,
    name: r.name ?? null,
    category: r.category ?? null,
    rating: r.rating != null ? r.rating : null,
    review_count: r.review_count ?? r.reviews ?? null,
    phone: r.phone ?? null,
    address: r.address ?? null,
    website: r.website ?? null,
    latitude: r.latitude != null ? r.latitude : null,
    longitude: r.longitude != null ? r.longitude : null,
    hours: r.hours ?? null,
    maps_url: r.maps_url ?? r.mapUrl ?? null,
    raw_data: r.raw_data ?? null,
  }));

  if (rows.length > 0) {
    await supabase.from("search_results").insert(rows);
  }

  const { data: profile } = await supabase.from("profiles").select("total_searches").eq("id", userId).single();
  if (profile) {
    await supabase.from("profiles").update({ total_searches: (profile.total_searches || 0) + 1 }).eq("id", userId);
  }
}
