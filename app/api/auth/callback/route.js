import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.redirect(new URL("/login?error=config", requestUrl.origin));
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll can be called from Server Component; ignore in route handler
          }
        },
      },
    });

    let lastError = null;
    const maxRetries = 2;
    const retryDelayMs = 750;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await supabase.auth.exchangeCodeForSession(code);
        lastError = null;
        break;
      } catch (err) {
        lastError = err;
        console.error(`[auth/callback] exchangeCodeForSession attempt ${attempt + 1} failed`, err);
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        }
      }
    }

    if (lastError) {
      console.error("[auth/callback] exchangeCodeForSession failed after retries", lastError);
      const loginUrl = new URL("/login", requestUrl.origin);
      loginUrl.searchParams.set("error", "oauth_timeout");
      if (next && next !== "/dashboard") {
        loginUrl.searchParams.set("redirect", next);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
