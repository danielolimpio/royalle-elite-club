import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Forbidden: admin role required");
}

const promotionSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  discount_percent: z.number().optional().nullable(),
  coupon_code: z.string().optional().nullable(),
  redirect_url: z.string().url(),
  rules: z.string().optional().nullable(),
  sort_order: z.number().int().optional(),
  active: z.boolean().optional(),
});

const companySchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  category_id: z.string().uuid(),
  logo_url: z.string().url().optional().nullable(),
  cover_url: z.string().url().optional().nullable(),
  short_description: z.string().optional().nullable(),
  long_description: z.string().optional().nullable(),
  cta_title: z.string().optional().nullable(),
  cta_text: z.string().optional().nullable(),
  persuasion_text: z.string().optional().nullable(),
  rules: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  featured: z.boolean().optional(),
  promotions: z.array(promotionSchema).default([]),
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
    const { data, error } = await context.supabase
      .from("companies")
      .select("id, slug, name, category_id, logo_url, featured, access_count, created_at, categories(slug, name)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const adminGetCompanyFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: company, error } = await context.supabase
      .from("companies")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    if (!company) return null;
    const { data: promotions } = await context.supabase
      .from("promotions")
      .select("*")
      .eq("company_id", company.id)
      .order("sort_order");
    return { ...company, promotions: promotions ?? [] };
  });

export const adminSaveCompanyFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => companySchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { promotions, id, ...payload } = data;
    let companyId = id;
    if (companyId) {
      const { error } = await context.supabase.from("companies").update(payload).eq("id", companyId);
      if (error) throw error;
    } else {
      const { data: ins, error } = await context.supabase
        .from("companies")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      companyId = ins.id;
    }
    // upsert promotions: simplest — delete all then re-insert
    await context.supabase.from("promotions").delete().eq("company_id", companyId);
    if (promotions.length) {
      const rows = promotions.map((p, idx) => ({
        company_id: companyId!,
        title: p.title,
        description: p.description ?? null,
        discount_percent: p.discount_percent ?? null,
        coupon_code: p.coupon_code ?? null,
        redirect_url: p.redirect_url,
        rules: p.rules ?? null,
        sort_order: p.sort_order ?? idx,
        active: p.active ?? true,
      }));
      const { error } = await context.supabase.from("promotions").insert(rows);
      if (error) throw error;
    }
    return { id: companyId };
  });

export const adminDeleteCompanyFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("companies").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const adminDuplicateCompanyFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: src } = await context.supabase
      .from("companies")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (!src) throw new Error("Empresa não encontrada");
    const { id, created_at, updated_at, access_count, slug, name, ...rest } = src as any;
    const newSlug = `${slug}-copia-${Date.now().toString(36)}`;
    const { data: ins, error } = await context.supabase
      .from("companies")
      .insert({ ...rest, slug: newSlug, name: `${name} (cópia)`, access_count: 0 })
      .select("id")
      .single();
    if (error) throw error;
    const { data: srcPromos } = await context.supabase
      .from("promotions")
      .select("title, description, discount_percent, coupon_code, redirect_url, rules, sort_order, active")
      .eq("company_id", data.id);
    if (srcPromos && srcPromos.length) {
      await context.supabase
        .from("promotions")
        .insert(srcPromos.map((p) => ({ ...p, company_id: ins.id })));
    }
    return { id: ins.id };
  });
