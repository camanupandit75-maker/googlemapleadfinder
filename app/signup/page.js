"use client";

import { useState } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase";

export default function SignupPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const supabase = createBrowserSupabase();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: fullName },
                },
            });
            if (error) throw error;
            setSuccess(true);
        } catch (err) {
            setError(err.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Success state
    if (success) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
                <div className="w-full max-w-sm text-center animate-fade-in-up">
                    <div className="text-6xl mb-6">✉️</div>
                    <h1 className="font-display font-bold text-2xl text-white mb-3">
                        Check your email
                    </h1>
                    <p className="text-slate-400 mb-2">
                        We&apos;ve sent a confirmation link to
                    </p>
                    <p className="text-brand-400 font-semibold mb-8">{email}</p>
                    <Link
                        href="/login"
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        ← Back to login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm animate-fade-in-up">
                {/* Logo & Heading */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
                        <div className="w-9 h-9 bg-brand-500 rounded-lg flex items-center justify-center">
<span className="text-white font-display font-bold text-sm">GN</span>
                            </div>
                        <span className="font-display font-bold text-xl text-white">Geonayan</span>
                    </Link>
                    <h1 className="font-display font-bold text-2xl text-white">
                        Create your account
                    </h1>
                    <p className="text-sm text-brand-400 mt-1.5">
                        Get 10 free search credits on signup
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-7">
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Full Name"
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password (min 6 characters)"
                                required
                                minLength={6}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors duration-150"
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>
                </div>

                {/* Login link */}
                <p className="text-center text-sm text-slate-400 mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
