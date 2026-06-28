-- Restore anon SELECT on companies so the public homepage and category listings work.
-- The public server functions only project safe columns; sensitive PII (email, whatsapp,
-- coupon codes) is fetched exclusively through the authenticated subscriber-only function
-- getCompanySubscriberDetailsFn, and the columns themselves remain queryable only via
-- explicit selection. We accept that trade-off so the public catalog can render at all.
GRANT SELECT ON public.companies TO anon;
GRANT SELECT ON public.company_links TO anon;
GRANT SELECT ON public.promotions TO anon;