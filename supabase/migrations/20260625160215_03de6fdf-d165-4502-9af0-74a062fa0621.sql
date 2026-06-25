
-- Hero banners (carousel)
CREATE TABLE public.hero_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  link_url TEXT,
  title TEXT,
  subtitle TEXT,
  alt TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.hero_banners TO anon, authenticated;
GRANT ALL ON public.hero_banners TO authenticated;
GRANT ALL ON public.hero_banners TO service_role;

ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hero_banners read all" ON public.hero_banners FOR SELECT USING (true);
CREATE POLICY "hero_banners admin write" ON public.hero_banners
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER hero_banners_updated_at BEFORE UPDATE ON public.hero_banners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Placements column on companies for marketing groups
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS placements TEXT[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN public.companies.placements IS
  'Lista de locais onde a empresa/oferta aparece: flash, destaque, familia, vibrar';
