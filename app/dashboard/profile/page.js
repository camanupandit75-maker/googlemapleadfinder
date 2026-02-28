"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase";
import CreditBadge from "@/components/CreditBadge";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const NATIONALITY_OPTIONS = ["Indian", "UAE", "Singapore", "Malaysia", "Saudi Arabia", "Other"];
const DOMICILE_OPTIONS = ["India", "UAE", "Saudi Arabia", "Singapore", "Malaysia", "UK", "USA", "Other"];

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createBrowserSupabase();
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    account_type: "individual",
    org_name: "",
    designation: "",
    phone: "",
    city: "",
    pan_number: "",
    gst_number: "",
    nationality: "Indian",
    company_domicile: "India",
    purpose: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session: s },
      } = await supabase.auth.getSession();
      if (!s) {
        router.push("/login");
        return;
      }
      setSession(s);
      try {
        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${s.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setForm({
            full_name: data.full_name ?? "",
            account_type: data.account_type === "business" ? "business" : "individual",
            org_name: data.org_name ?? "",
            designation: data.designation ?? "",
            phone: data.phone ?? "",
            city: data.city ?? "",
            pan_number: data.pan_number ?? "",
            gst_number: data.gst_number ?? "",
            nationality: data.nationality ?? "Indian",
            company_domicile: data.company_domicile ?? "India",
            purpose: data.purpose ?? "",
          });
        }
      } catch (e) {
        console.error("Failed to load profile", e);
        setError("Failed to load profile");
      }
      setAuthLoading(false);
    };
    checkAuth();
  }, [router, supabase.auth]);

  const handleSave = async () => {
    const pan = (form.pan_number ?? "").trim().toUpperCase();
    const gst = (form.gst_number ?? "").trim().toUpperCase();
    if (pan && !PAN_REGEX.test(pan)) {
      setError("Invalid PAN format (e.g. ABCDE1234F)");
      return;
    }
    if (gst && !GST_REGEX.test(gst)) {
      setError("Invalid GST format (e.g. 27ABCDE1234F1Z5)");
      return;
    }
    setError(null);
    setSaved(false);
    setSaving(true);
    try {
      const {
        data: { session: s },
      } = await supabase.auth.getSession();
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${s?.access_token}`,
        },
        body: JSON.stringify({
          full_name: form.full_name || null,
          account_type: form.account_type || null,
          org_name: form.org_name || null,
          designation: form.designation || null,
          phone: form.phone || null,
          city: form.city || null,
          pan_number: pan || null,
          gst_number: gst || null,
          nationality: form.nationality || null,
          company_domicile: form.company_domicile || null,
          purpose: form.purpose || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error || "Failed to save");
        return;
      }
      setProfile(await res.json());
      setSaved(true);
    } catch (e) {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white dashboard-dark">
      <header className="sticky top-0 z-40 bg-[#020617]/95 border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">GN</span>
              </div>
              <span className="font-display font-bold text-lg text-white">Geonayan</span>
            </Link>
            <nav className="flex items-center gap-1">
              <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
                Search
              </Link>
              <Link href="/dashboard/bulk" className="text-slate-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
                Bulk Search
              </Link>
              <Link href="/dashboard/map" className="text-slate-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
                Market Map
              </Link>
              <Link href="/dashboard/profile" className="bg-white/10 text-white text-sm font-medium px-3 py-1.5 rounded-lg">
                Profile
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <CreditBadge credits={profile?.credits ?? 0} variant="dark" />
            <Link href="/dashboard" className="bg-[#22c55e] hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
              Buy Credits
            </Link>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white transition-colors" title="Log out">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="font-display font-bold text-2xl text-white mb-2">Profile</h1>
        <p className="text-slate-400 text-sm mb-8">Manage your account details. All fields below are optional.</p>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-900/20 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
        {saved && (
          <div className="mb-6 rounded-lg border border-[#22c55e]/30 bg-[#22c55e]/10 px-4 py-3 text-sm text-[#22c55e]">
            Profile saved.
          </div>
        )}

        <div className="glass-card p-6 space-y-6">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Email</label>
            <input
              type="email"
              value={profile?.email ?? ""}
              readOnly
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-slate-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Credits balance</label>
            <div className="px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-slate-300">
              {profile?.credits ?? 0} credits
            </div>
          </div>

          <hr className="border-white/10" />

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {form.account_type === "business" ? "Business / Organization Name" : "Full Name"}
            </label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              placeholder={form.account_type === "business" ? "Your business name" : "Your name"}
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.account_type === "business"}
              onChange={(e) => setForm((f) => ({ ...f, account_type: e.target.checked ? "business" : "individual" }))}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#22c55e] focus:ring-[#22c55e]"
            />
            <span className="text-sm text-slate-300">I&apos;m registering as a business</span>
          </label>
          {form.account_type === "individual" && (
            <div>
              <label className="block text-xs text-slate-500 mb-1">Nationality</label>
              <select
                value={form.nationality}
                onChange={(e) => setForm((f) => ({ ...f, nationality: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
              >
                {NATIONALITY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )}
          {form.account_type === "business" && (
            <div>
              <label className="block text-xs text-slate-500 mb-1">Country of Domicile</label>
              <select
                value={form.company_domicile}
                onChange={(e) => setForm((f) => ({ ...f, company_domicile: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
              >
                {DOMICILE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs text-slate-500 mb-1">Organization Name</label>
            <input
              type="text"
              value={form.org_name}
              onChange={(e) => setForm((f) => ({ ...f, org_name: e.target.value }))}
              placeholder="e.g. Sharma & Associates"
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Designation</label>
            <input
              type="text"
              value={form.designation}
              onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
              placeholder="e.g. Partner, CA, Manager"
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              placeholder="e.g. Mumbai"
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">PAN Number</label>
            <input
              type="text"
              value={form.pan_number}
              onChange={(e) => setForm((f) => ({ ...f, pan_number: e.target.value.toUpperCase() }))}
              placeholder="e.g. ABCDE1234F"
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">GST Number</label>
            <input
              type="text"
              value={form.gst_number}
              onChange={(e) => setForm((f) => ({ ...f, gst_number: e.target.value.toUpperCase() }))}
              placeholder="e.g. 27ABCDE1234F1Z5"
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Purpose</label>
            <select
              value={form.purpose}
              onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
            >
              <option value="">Select...</option>
              <option value="Lead Generation">Lead Generation</option>
              <option value="Market Research">Market Research</option>
              <option value="Recruitment">Recruitment</option>
              <option value="Competitor Analysis">Competitor Analysis</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#22c55e] hover:bg-brand-600 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
