import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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

async function resolveCompanyAssetUrl(supabase: any, value?: string | null) {
  const path = getCompanyAssetPath(value);
  if (!path) return value ?? null;
  const { data } = await supabase.storage.from(COMPANY_ASSETS_BUCKET).createSignedUrl(path, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? value ?? null;
}

async function resolveAdminCompanyAssets<T extends { logo_url?: string | null; cover_url?: string | null }>(supabase: any, row: T) {
  const [logo_url, cover_url] = await Promise.all([
    resolveCompanyAssetUrl(supabase, row.logo_url),
    resolveCompanyAssetUrl(supabase, row.cover_url),
  ]);
  return { ...row, logo_url, cover_url };
}

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Forbidden: admin role required");
}

async function getAdminDb() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

const promotionSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  type: z.enum(["cupom","cashback","frete_gratis","oferta","percentual","fixo"]).optional(),
  discount_percent: z.number().optional().nullable(),
  discount_value: z.number().optional().nullable(),
  coupon_code: z.string().optional().nullable(),
  redirect_url: z.string().min(1),
  rules: z.string().optional().nullable(),
  sort_order: z.number().int().optional(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  starts_at: z.string().optional().nullable(),
  expires_at: z.string().optional().nullable(),
  coupons: z.array(z.object({
    code: z.string().min(1),
    description: z.string().optional().nullable(),
    value: z.string().optional().nullable(),
    min_purchase: z.string().optional().nullable(),
  })).optional().default([]),
});

const linkSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  url: z.string().min(1),
});

const companySchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  category_id: z.string().uuid(),
  logo_url: z.string().optional().nullable(),
  cover_url: z.string().optional().nullable(),
  short_description: z.string().optional().nullable(),
  long_description: z.string().optional().nullable(),
  cta_title: z.string().optional().nullable(),
  cta_text: z.string().optional().nullable(),
  persuasion_text: z.string().optional().nullable(),
  rules: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  featured: z.boolean().optional(),
  site_url: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  status: z.enum(["active","inactive"]).optional(),
  sort_order: z.number().int().optional(),
  discount_highlight: z.number().optional().nullable(),
  placements: z.array(z.enum(["flash","destaque","familia","vibrar"])).default([]),
  promotions: z.array(promotionSchema).default([]),
  links: z.array(linkSchema).default([]),
});

export const isAdminFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: Boolean(data) };
  });

export const adminListCompaniesFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const db = await getAdminDb();
    const { data, error } = await db
      .from("companies")
      .select("id, slug, name, category_id, logo_url, featured, access_count, created_at, categories(slug, name)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return Promise.all((data ?? []).map((row: any) => resolveAdminCompanyAssets(db, row)));
  });

export const adminGetCompanyFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const db = await getAdminDb();
    const { data: company, error } = await db
      .from("companies")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    if (!company) return null;
    const { data: promotions } = await db
      .from("promotions")
      .select("*")
      .eq("company_id", company.id)
      .order("sort_order");
    const { data: links } = await db
      .from("company_links")
      .select("*")
      .eq("company_id", company.id)
      .order("sort_order");
    const resolvedCompany = await resolveAdminCompanyAssets(db, company);
    return { ...resolvedCompany, promotions: promotions ?? [], links: links ?? [] };
  });

export const adminSaveCompanyFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => companySchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const db = await getAdminDb();
    const { promotions, links, id, ...rawPayload } = data;
    const payload: any = { ...rawPayload };
    // Normalize empty strings
    for (const k of ["site_url","email","logo_url","cover_url"]) {
      if (payload[k] === "") payload[k] = null;
    }
    for (const k of ["logo_url","cover_url"]) {
      const path = getCompanyAssetPath(payload[k]);
      if (path) payload[k] = `${COMPANY_ASSETS_BUCKET}/${path}`;
    }
    let companyId = id;
    if (companyId) {
      const { error } = await db.from("companies").update(payload).eq("id", companyId);
      if (error) throw error;
    } else {
      const { data: ins, error } = await db
        .from("companies")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      companyId = ins.id;
    }
    // upsert promotions: simplest — delete all then re-insert
    const { error: deletePromotionsError } = await db.from("promotions").delete().eq("company_id", companyId);
    if (deletePromotionsError) throw deletePromotionsError;
    if (promotions.length) {
      const rows = promotions.map((p, idx) => ({
        company_id: companyId!,
        title: p.title,
        description: p.description ?? null,
        type: p.type ?? "cupom",
        discount_percent: p.discount_percent ?? null,
        discount_value: p.discount_value ?? null,
        coupon_code: p.coupon_code ?? null,
        redirect_url: p.redirect_url,
        rules: p.rules ?? null,
        sort_order: p.sort_order ?? idx,
        active: p.active ?? true,
        featured: p.featured ?? false,
        starts_at: p.starts_at || null,
        expires_at: p.expires_at || null,
        coupons: p.coupons ?? [],
      }));
      const { error } = await db.from("promotions").insert(rows);
      if (error) throw error;
    }
    const { error: deleteLinksError } = await db.from("company_links").delete().eq("company_id", companyId);
    if (deleteLinksError) throw deleteLinksError;
    if (links.length) {
      const linkRows = links.map((l, idx) => ({
        company_id: companyId!,
        name: l.name,
        url: l.url,
        sort_order: idx,
      }));
      const { error } = await db.from("company_links").insert(linkRows);
      if (error) throw error;
    }
    return { id: companyId };
  });

export const adminDeleteCompanyFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const db = await getAdminDb();
    const { error } = await db.from("companies").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const adminDuplicateCompanyFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const db = await getAdminDb();
    const { data: src } = await db
      .from("companies")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (!src) throw new Error("Empresa não encontrada");
    const { id, created_at, updated_at, access_count, slug, name, ...rest } = src as any;
    const newSlug = `${slug}-copia-${Date.now().toString(36)}`;
    const { data: ins, error } = await db
      .from("companies")
      .insert({ ...rest, slug: newSlug, name: `${name} (cópia)`, access_count: 0 })
      .select("id")
      .single();
    if (error) throw error;
    const { data: srcPromos } = await db
      .from("promotions")
      .select("title, description, discount_percent, coupon_code, redirect_url, rules, sort_order, active")
      .eq("company_id", data.id);
    if (srcPromos && srcPromos.length) {
      await db
        .from("promotions")
        .insert(srcPromos.map((p) => ({ ...p, company_id: ins.id })));
    }
    return { id: ins.id };
  });

// ============ Hero banners (carousel) ============

const bannerSchema = z.object({
  id: z.string().uuid().optional(),
  image_url: z.string().min(1),
  link_url: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  alt: z.string().optional().nullable(),
  sort_order: z.number().int().optional(),
  active: z.boolean().optional(),
});

export const adminListBannersFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("hero_banners")
      .select("*")
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const adminSaveBannerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => bannerSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { id, ...payload } = data;
    const row: any = { ...payload };
    for (const k of ["link_url","title","subtitle","alt"]) {
      if (row[k] === "") row[k] = null;
    }
    const imagePath = getCompanyAssetPath(row.image_url);
    if (imagePath) row.image_url = `${COMPANY_ASSETS_BUCKET}/${imagePath}`;
    if (id) {
      const { error } = await context.supabase.from("hero_banners").update(row).eq("id", id);
      if (error) throw error;
      return { id };
    }
    const { data: ins, error } = await context.supabase
      .from("hero_banners").insert(row).select("id").single();
    if (error) throw error;
    return { id: ins.id };
  });

export const adminDeleteBannerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("hero_banners").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
