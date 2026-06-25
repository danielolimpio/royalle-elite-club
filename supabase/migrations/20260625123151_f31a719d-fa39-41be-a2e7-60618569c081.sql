
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS site_url text,
  ADD COLUMN IF NOT EXISTS whatsapp text,
  ADD COLUMN IF NOT EXISTS instagram text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_highlight numeric;

ALTER TABLE public.promotions
  ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'cupom',
  ADD COLUMN IF NOT EXISTS discount_value numeric,
  ADD COLUMN IF NOT EXISTS starts_at date,
  ADD COLUMN IF NOT EXISTS expires_at date,
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.company_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.company_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.company_links TO authenticated;
GRANT ALL ON public.company_links TO service_role;

ALTER TABLE public.company_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company_links read all" ON public.company_links FOR SELECT TO public USING (true);
CREATE POLICY "company_links admin write" ON public.company_links FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS company_links_company_id_idx ON public.company_links(company_id);
