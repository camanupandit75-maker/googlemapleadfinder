import { createAuthServerSupabase } from "./supabase";

/**
 * Extracts Bearer token from request and returns the authenticated user or null.
 * @param {Request} request - Next.js request (headers must contain Authorization: Bearer <token>)
 * @returns {Promise<{ id: string, email?: string } | null>}
 */
export async function getUser(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.slice(7);
  if (!token) return null;
  try {
    const supabase = createAuthServerSupabase(token);
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return null;
    return data.user;
  } catch {
    return null;
  }
}
