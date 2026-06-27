import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyProfileFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("profiles")
      .select("id, full_name, plan, plan_type, subscription_active, subscription_started_at")
      .eq("id", context.userId)
      .maybeSingle();
    return data;
  });

export const activateSubscriptionFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      plan: z.string().min(1),
      planType: z.enum(["individual", "white_label"]).default("individual"),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .upsert({
        id: context.userId,
        plan: data.plan,
        plan_type: data.planType,
        subscription_active: true,
        subscription_started_at: new Date().toISOString(),
      })
    if (error) throw error;
    return { ok: true };
  });