import { NextResponse } from "next/server";

export async function GET(request) {
    // Placeholder: In production, this route exchanges the OAuth code for a session.
    // The Supabase library handles this automatically when properly configured.
    // For now, redirect to the dashboard.
    const url = new URL("/dashboard", request.url);
    return NextResponse.redirect(url);
}
