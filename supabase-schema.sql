-- LeadFinder Supabase Schema
-- Run this in Supabase SQL Editor

-- ── Extensions ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── profiles (extends auth.users) ──────────────────────────────────────────
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    company_name TEXT,
    credits INTEGER NOT NULL DEFAULT 10,
    total_searches INTEGER NOT NULL DEFAULT 0,
    total_results_exported INTEGER NOT NULL DEFAULT 0,
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile (e.g. on signup via trigger)"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ── credit_transactions ────────────────────────────────────────────────────
CREATE TABLE public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    balance_after INTEGER,
    type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'bonus', 'refund')),
    description TEXT,
    razorpay_payment_id TEXT,
    razorpay_order_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credit_transactions"
    ON public.credit_transactions FOR SELECT
    USING (auth.uid() = user_id);

-- ── searches ──────────────────────────────────────────────────────────────
CREATE TABLE public.searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    location TEXT,
    provider TEXT NOT NULL CHECK (provider IN ('google_places', 'serpapi')),
    result_count INTEGER NOT NULL DEFAULT 0,
    credits_used INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own searches"
    ON public.searches FOR SELECT
    USING (auth.uid() = user_id);

-- ── search_results ────────────────────────────────────────────────────────
CREATE TABLE public.search_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    search_id UUID NOT NULL REFERENCES public.searches(id) ON DELETE CASCADE,
    place_id TEXT,
    name TEXT,
    category TEXT,
    rating NUMERIC(2,1),
    review_count INTEGER,
    phone TEXT,
    address TEXT,
    website TEXT,
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    hours TEXT,
    maps_url TEXT,
    raw_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.search_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view search_results from own searches"
    ON public.search_results FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.searches s
            WHERE s.id = search_results.search_id AND s.user_id = auth.uid()
        )
    );

-- ── credit_packages ───────────────────────────────────────────────────────
CREATE TABLE public.credit_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    credits INTEGER NOT NULL,
    price_inr INTEGER NOT NULL,
    price_usd INTEGER,
    is_popular BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.credit_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active credit_packages"
    ON public.credit_packages FOR SELECT
    USING (is_active = TRUE);

-- ── result_cache (service role only) ──────────────────────────────────────
CREATE TABLE public.result_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cache_key TEXT NOT NULL UNIQUE,
    query TEXT NOT NULL,
    provider TEXT NOT NULL,
    results JSONB NOT NULL,
    result_count INTEGER NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.result_cache ENABLE ROW LEVEL SECURITY;

-- No SELECT/INSERT/UPDATE policy for regular users; service role bypasses RLS
CREATE POLICY "Service role only - no access for anon/authenticated"
    ON public.result_cache FOR ALL
    USING (FALSE)
    WITH CHECK (FALSE);

-- ── Trigger: auto-create profile on signup ─────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
    );
    -- Log bonus credits
    INSERT INTO public.credit_transactions (user_id, amount, balance_after, type, description)
    SELECT id, 10, 10, 'bonus', 'Welcome bonus'
    FROM public.profiles WHERE id = NEW.id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ── Function: deduct_credits ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.deduct_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_description TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_balance INTEGER;
    v_new_balance INTEGER;
BEGIN
    IF p_amount <= 0 THEN
        RETURN -1;
    END IF;
    -- Lock row and get current credits
    SELECT credits INTO v_balance
    FROM public.profiles
    WHERE id = p_user_id
    FOR UPDATE;
    IF NOT FOUND OR v_balance IS NULL THEN
        RETURN -1;
    END IF;
    v_new_balance := v_balance - p_amount;
    IF v_new_balance < 0 THEN
        RETURN -1;
    END IF;
    UPDATE public.profiles
    SET credits = v_new_balance, updated_at = NOW()
    WHERE id = p_user_id;
    INSERT INTO public.credit_transactions (user_id, amount, balance_after, type, description)
    VALUES (p_user_id, -p_amount, v_new_balance, 'usage', COALESCE(p_description, 'Search'));
    RETURN v_new_balance;
END;
$$;

-- ── Function: add_credits ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.add_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_description TEXT DEFAULT NULL,
    p_razorpay_payment_id TEXT DEFAULT NULL,
    p_razorpay_order_id TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_new_balance INTEGER;
BEGIN
    IF p_amount <= 0 THEN
        RETURN -1;
    END IF;
    UPDATE public.profiles
    SET credits = credits + p_amount, updated_at = NOW()
    WHERE id = p_user_id
    RETURNING credits INTO v_new_balance;
    IF NOT FOUND THEN
        RETURN -1;
    END IF;
    INSERT INTO public.credit_transactions (
        user_id, amount, balance_after, type, description,
        razorpay_payment_id, razorpay_order_id
    )
    VALUES (
        p_user_id, p_amount, v_new_balance, 'purchase',
        COALESCE(p_description, 'Credit purchase'),
        p_razorpay_payment_id, p_razorpay_order_id
    );
    RETURN v_new_balance;
END;
$$;

-- ── Seed credit_packages ────────────────────────────────────────────────────
INSERT INTO public.credit_packages (name, credits, price_inr, is_popular, sort_order)
VALUES
    ('Starter', 50, 49900, FALSE, 1),
    ('Growth', 200, 149900, TRUE, 2),
    ('Pro', 500, 299900, FALSE, 3),
    ('Enterprise', 2000, 999900, FALSE, 4);

-- ── Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_razorpay_payment_id ON public.credit_transactions(razorpay_payment_id);
CREATE INDEX idx_searches_user_id ON public.searches(user_id);
CREATE INDEX idx_searches_created_at ON public.searches(created_at DESC);
CREATE INDEX idx_search_results_search_id ON public.search_results(search_id);
CREATE INDEX idx_result_cache_cache_key ON public.result_cache(cache_key);
CREATE INDEX idx_result_cache_expires_at ON public.result_cache(expires_at);
