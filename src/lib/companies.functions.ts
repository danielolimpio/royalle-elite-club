import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function getPublicClient() {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

const COMPANY_ASSETS_BUCKET = "company-assets";

function getCompanyAssetPath(value?: string | null) {
  if (!value) return null;
  if (value.startsWith(`${COMPANY_ASSETS_BUCKET}/`)) return value.slice(COMPANY_ASSETS_BUCKET.length + 1);
  const marker = `/storage/v1/object/public/${COMPANY_ASSETS_BUCKET}/`;
  const signedMarker = `/storage/v1/object/sign/${COMPANY_ASSETS_BUCKET}/`;
  const markerIndex = value.indexOf(marker);
  if (markerIndex >= 0) return decodeURIComponent(value.slice(markerIndex + marker.length).split("?")[0]);
  const signedIndex = value.indexOf(signedMarker);
  if (signedIndex >= 0) return decodeURIComponent(value.slice(signedIndex + signedMarker.length).split("?")[0]);
  return null;
}

async function resolveCompanyAssetUrl(sb: ReturnType<typeof getPublicClient>, value?: string | null) {
  const path = getCompanyAssetPath(value);
  if (!path) return value ?? null;
  const { data } = await sb.storage.from(COMPANY_ASSETS_BUCKET).createSignedUrl(path, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? value ?? null;
}

async function resolveCompanyAssets<T extends { logo_url?: string | null; cover_url?: string | null }>(
  sb: ReturnType<typeof getPublicClient>,
  row: T,
) {
  const [logo_url, cover_url] = await Promise.all([
    resolveCompanyAssetUrl(sb, row.logo_url),
    resolveCompanyAssetUrl(sb, row.cover_url),
  ]);
  return { ...row, logo_url, cover_url };
}

async function resolveCompaniesAssets<T extends { logo_url?: string | null; cover_url?: string | null }>(
  sb: ReturnType<typeof getPublicClient>,
  rows: T[] | null,
) {
  return Promise.all((rows ?? []).map((row) => resolveCompanyAssets(sb, row)));
}

const COMPANY_COLS =
  "id, slug, name, category_id, logo_url, cover_url, short_description, long_description, cta_title, cta_text, persuasion_text, rules, city, featured, access_count, created_at, site_url, instagram, status, sort_order, discount_highlight";

export const listCategoriesFn = createServerFn({ method: "GET" }).handler(async () => {
  const sb = getPublicClient();
  const { data, error } = await sb.from("categories").select("id, slug, name, sort_order").order("sort_order");
  if (error) throw error;
  return data ?? [];
});

export const listHeroBannersFn = createServerFn({ method: "GET" }).handler(async () => {
  const sb = getPublicClient();
  const { data, error } = await sb
    .from("hero_banners")
    .select("id, image_url, link_url, title, subtitle, alt, sort_order")
    .eq("active", true)
    .order("sort_order");
  if (error) throw error;
  return Promise.all((data ?? []).map(async (banner) => ({
    ...banner,
    image_url: await resolveCompanyAssetUrl(sb, banner.image_url),
  })));
});

export const listCompaniesByPlacementFn = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({
      placement: z.enum(["flash","destaque","familia","vibrar"]),
      limit: z.number().int().min(1).max(60).optional(),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const sb = getPublicClient();
    const { data: rows, error } = await sb
      .from("companies")
      .select(`${COMPANY_COLS}, placements, categories(slug, name)`)
      .contains("placements", [data.placement])
      .eq("status", "active")
      .order("sort_order")
      .limit(data.limit ?? 24);
    if (error) throw error;
    return resolveCompaniesAssets(sb, rows ?? []);
  });

export const listCompaniesFn = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z
      .object({
        categorySlug: z.string().optional(),
        city: z.string().optional(),
        limit: z.number().int().min(1).max(200).optional(),
        orderBy: z.enum(["created_at", "access_count", "featured"]).optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    const sb = getPublicClient();
    let q = sb.from("companies").select(`${COMPANY_COLS}, categories!inner(slug, name)`).eq("status", "active");
    if (data.categorySlug) q = q.eq("categories.slug", data.categorySlug);
    if (data.city && data.city !== "Todas") q = q.eq("city", data.city);
    const order = data.orderBy ?? "created_at";
    q = q.order(order, { ascending: false });
    if (data.limit) q = q.limit(data.limit);
    const { data: rows, error } = await q;
    if (error) throw error;
    return resolveCompaniesAssets(sb, rows ?? []);
  });

export const getCompanyBySlugFn = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const sb = getPublicClient();
    const { data: company, error } = await sb
      .from("companies")
      .select(`${COMPANY_COLS}, categories(slug, name)`)
      .eq("slug", data.slug)
      .eq("status", "active")
      .maybeSingle();
    if (error) throw error;
    if (!company) return null;
    const { data: promos } = await sb
      .from("promotions")
      .select("id, title, description, type, discount_percent, discount_value, rules, sort_order, active, featured, starts_at, expires_at, coupons")
      .eq("company_id", company.id)
      .eq("active", true)
      .order("sort_order");
    const { data: links } = await sb
      .from("company_links")
      .select("id, name, url, sort_order")
      .eq("company_id", company.id)
      .order("sort_order");
    const resolvedCompany = await resolveCompanyAssets(sb, company);
    return { ...resolvedCompany, promotions: promos ?? [], links: links ?? [] };
  });

export const getMostAccessedFn = createServerFn({ method: "GET" }).handler(async () => {
  const sb = getPublicClient();
  // top per category — fetch top 60 by access, dedupe by category client-side
  const { data, error } = await sb
    .from("companies")
    .select(`${COMPANY_COLS}, categories(slug, name)`)
    .eq("status", "active")
    .order("access_count", { ascending: false })
    .limit(60);
  if (error) throw error;
  const seen = new Set<string>();
  const out: typeof data = [];
  for (const row of data ?? []) {
    if (!row.category_id || seen.has(row.category_id)) continue;
    seen.add(row.category_id);
    out.push(row);
    if (out.length >= 12) break;
  }
  return resolveCompaniesAssets(sb, out);
});

export const getRecentFn = createServerFn({ method: "GET" }).handler(async () => {
  const sb = getPublicClient();
  const { data, error } = await sb
    .from("companies")
    .select(`${COMPANY_COLS}, categories(slug, name)`)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(12);
  if (error) throw error;
  // Re-rank to alternate categories
  const buckets = new Map<string, typeof data>();
  for (const r of data ?? []) {
    const k = r.category_id ?? "_";
    if (!buckets.has(k)) buckets.set(k, [] as never);
    buckets.get(k)!.push(r);
  }
  const out: NonNullable<typeof data> = [];
  let added = true;
  while (added && out.length < 12) {
    added = false;
    for (const arr of buckets.values()) {
      const v = arr.shift();
      if (v) {
        out.push(v);
        added = true;
        if (out.length >= 12) break;
      }
    }
  }
  return resolveCompaniesAssets(sb, out);
});

export const getSpecialMomentsFn = createServerFn({ method: "GET" }).handler(async () => {
  const sb = getPublicClient();
  const { data, error } = await sb
    .from("companies")
    .select(`${COMPANY_COLS}, categories(slug, name)`)
    .eq("featured", true)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(12);
  if (error) throw error;
  return resolveCompaniesAssets(sb, data ?? []);
});

export const incrementAccessFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: c } = await supabaseAdmin
      .from("companies")
      .select("id, access_count")
      .eq("slug", data.slug)
      .maybeSingle();
    if (!c) return { ok: false };
    await supabaseAdmin
      .from("companies")
      .update({ access_count: (c.access_count ?? 0) + 1 })
      .eq("id", c.id);
    return { ok: true };
  });

// Subscriber-only fetch: returns coupon codes, redirect URLs, and contact details
// for a single company. Requires an authenticated user with an active subscription.
export const getCompanySubscriberDetailsFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("subscription_active")
      .eq("id", context.userId)
      .maybeSingle();
    if (!profile?.subscription_active) {
      throw new Response("Subscription required", { status: 403 });
    }
    const { data: company, error } = await context.supabase
      .from("companies")
      .select("id, slug, email, whatsapp")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw error;
    if (!company) return null;
    const { data: promos } = await context.supabase
      .from("promotions")
      .select("id, coupon_code, redirect_url, coupons")
      .eq("company_id", company.id)
      .eq("active", true);
    return {
      email: company.email,
      whatsapp: company.whatsapp,
      promotions: promos ?? [],
    };
  });
