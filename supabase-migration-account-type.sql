-- Run in Supabase SQL Editor if profiles table does not have account_type yet.
-- Individual/business signup and profile pages use this column.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS account_type TEXT;

-- Optional: extend trigger to copy signup metadata when profile is created
-- (only if you want account_type, nationality, company_domicile set before first login)
/*
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, account_type, nationality, company_domicile)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        NEW.raw_user_meta_data->>'account_type',
        NEW.raw_user_meta_data->>'nationality',
        NEW.raw_user_meta_data->>'company_domicile'
    );
    INSERT INTO public.credit_transactions (user_id, amount, balance_after, type, description)
    SELECT id, 10, 10, 'bonus', 'Welcome bonus'
    FROM public.profiles WHERE id = NEW.id;
    RETURN NEW;
END;
$$;
*/
