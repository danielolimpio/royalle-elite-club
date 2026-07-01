
UPDATE auth.users SET email_confirmed_at = now() WHERE email_confirmed_at IS NULL;
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS coupons jsonb NOT NULL DEFAULT '[]'::jsonb;
