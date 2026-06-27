
REVOKE SELECT ON public.companies FROM anon;
GRANT SELECT (
  id, slug, name, category_id, logo_url, cover_url,
  short_description, long_description, cta_title, cta_text,
  persuasion_text, rules, city, featured, access_count,
  created_at, updated_at, site_url, instagram, status,
  sort_order, discount_highlight, placements
) ON public.companies TO anon;

REVOKE SELECT ON public.promotions FROM anon;
GRANT SELECT (
  id, company_id, title, description, type,
  discount_percent, discount_value, rules, sort_order,
  active, featured, starts_at, expires_at, created_at
) ON public.promotions TO anon;
