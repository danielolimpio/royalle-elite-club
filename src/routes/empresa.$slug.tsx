import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getCompanyBySlugFn, incrementAccessFn, getCompanySubscriberDetailsFn } from "@/lib/companies.functions";
import { getMyProfileFn } from "@/lib/account.functions";
import { useAuth } from "@/hooks/use-auth";
import { SiteShell } from "@/components/site/SiteLayout";
import { getCategoryMeta } from "@/lib/categories";
import {
  ArrowUpRight, Copy, Sparkles, ShieldCheck, Tag, Globe, Instagram, MessageCircle,
  Mail, Calendar, Crown, ExternalLink, Lock, Ticket, BadgePercent, Gift, Check,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/empresa/$slug")({
  head: () => ({ meta: [{ title: "Empresa — Royalle Club" }] }),
  component: CompanyPage,
});

const TYPE_LABEL: Record<string, string> = {
  cupom: "Cupom de desconto",
  cashback: "Cashback",
  frete_gratis: "Frete grátis",
  oferta: "Oferta especial",
  percentual: "Desconto percentual",
  fixo: "Desconto fixo",
};

function iconForLink(name: string) {
  const n = name.toLowerCase();
  if (n.includes("insta")) return Instagram;
  if (n.includes("whats")) return MessageCircle;
  if (n.includes("mail") || n.includes("email")) return Mail;
  return Globe;
}

type Coupon = { code: string; description?: string | null; value?: string | null; min_purchase?: string | null };

function CompanyPage() {
  const { slug } = useParams({ from: "/empresa/$slug" });
  const { user, loading: authLoading } = useAuth();
  const fn = useServerFn(getCompanyBySlugFn);
  const incFn = useServerFn(incrementAccessFn);
  const profileFn = useServerFn(getMyProfileFn);
  const subDetailsFn = useServerFn(getCompanySubscriberDetailsFn);

  const q = useQuery({ queryKey: ["company", slug], queryFn: () => fn({ data: { slug } }) });
  const profileQ = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: () => profileFn(),
    enabled: !!user,
  });
  const isSubscribed = !!profileQ.data?.subscription_active;
  const detailsQ = useQuery({
    queryKey: ["company-secrets", slug, user?.id],
    queryFn: () => subDetailsFn({ data: { slug } }),
    enabled: !!user && isSubscribed,
  });
  const inc = useMutation({ mutationFn: () => incFn({ data: { slug } }) });

  if (q.isLoading) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-6xl px-6 py-20 text-[color:var(--muted-foreground)]">Carregando…</div>
      </SiteShell>
    );
  }
  const c = q.data;
  if (!c) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          Empresa não encontrada. <Link to="/dashboard" className="underline">Voltar</Link>
        </div>
      </SiteShell>
    );
  }

  const showPaywall = !authLoading && (!user || (!profileQ.isLoading && !isSubscribed));

  const secretByPromoId = new Map<string, { coupon_code: string | null; redirect_url: string | null; coupons: Coupon[] }>(
    ((detailsQ.data as any)?.promotions ?? []).map((p: any) => [
      p.id,
      { coupon_code: p.coupon_code, redirect_url: p.redirect_url, coupons: (p.coupons ?? []) as Coupon[] },
    ]),
  );
  const withSecrets = (p: any) => {
    const s = secretByPromoId.get(p.id);
    return s ? { ...p, coupon_code: s.coupon_code, redirect_url: s.redirect_url, coupons: s.coupons } : { ...p, coupons: [] as Coupon[] };
  };

  const meta = getCategoryMeta((c as any).categories?.slug);
  const promos: any[] = ((c as any).promotions ?? []).map(withSecrets);
  const links: any[] = (c as any).links ?? [];
  const featured = promos.find((p) => p.featured) ?? promos[0];
  const others = promos.filter((p) => p !== featured);

  function copyCoupon(code: string) {
    navigator.clipboard.writeText(code).then(() => toast.success(`Cupom ${code} copiado!`));
  }
  function goPromo(url?: string | null) {
    if (!url) return;
    inc.mutate();
    window.open(url, "_blank", "noopener");
  }

  return (
    <SiteShell>
      {/* HERO */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${meta?.gradient ?? "from-slate-700 to-slate-900"} text-white`}>
        {c.cover_url && (
          <img src={c.cover_url} alt={c.name} className="absolute inset-0 h-full w-full object-cover opacity-25" />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 py-14 text-center sm:py-20">
          {(c as any).categories?.name && (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/85 backdrop-blur">
              <Crown className="h-3 w-3" /> {(c as any).categories.name}
            </div>
          )}
          {c.logo_url && (
            <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-3xl border-2 border-white/30 bg-white p-3 shadow-2xl sm:h-32 sm:w-32">
              <img src={c.logo_url} alt={c.name} className="h-full w-full object-contain" />
            </div>
          )}
          <h1 className="font-display text-4xl leading-tight drop-shadow sm:text-5xl md:text-6xl">{c.name}</h1>
          {c.short_description && (
            <p className="max-w-2xl text-sm text-white/85 sm:text-base">{c.short_description}</p>
          )}
          {(c as any).site_url && !showPaywall && (
            <button
              type="button"
              onClick={() => goPromo((c as any).site_url)}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[color:var(--midnight)] shadow-lg transition hover:scale-[1.02]"
            >
              Visitar site oficial <ArrowUpRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </section>

      {/* PAYWALL */}
      {showPaywall && (
        <section className="mx-auto -mt-10 max-w-3xl px-4 sm:px-6">
          <div className="rounded-3xl border border-[color:var(--accent)]/30 bg-white p-6 text-center shadow-2xl sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-display text-2xl text-[color:var(--midnight)] sm:text-3xl">
              Conteúdo exclusivo para membros Royalle
            </h2>
            <p className="mt-3 text-sm text-[color:var(--muted-foreground)] sm:text-base">
              Ative sua assinatura por R$ 9,90/mês e libere todos os cupons e ofertas exclusivas.
            </p>
            <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                to="/checkout/$plan"
                params={{ plan: "individual" }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-7 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition hover:scale-[1.02]"
              >
                Cadastrar por R$ 9,90 <ArrowUpRight className="h-4 w-4" />
              </Link>
              {!user ? (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--midnight)] px-7 py-3 text-sm font-bold uppercase tracking-wide text-[color:var(--midnight)] transition hover:bg-[color:var(--midnight)] hover:text-white"
                >
                  Já sou membro
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--midnight)] px-7 py-3 text-sm font-bold uppercase tracking-wide text-[color:var(--midnight)] transition hover:bg-[color:var(--midnight)] hover:text-white"
                >
                  Ir para minha área
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* PROMO PRINCIPAL */}
      {!showPaywall && featured && (
        <section className="mx-auto -mt-10 max-w-6xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-3xl border border-[color:var(--accent)]/30 bg-white shadow-2xl">
            <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
              <div className="p-6 sm:p-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)]/10 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[color:var(--accent)]">
                  <Crown className="h-3.5 w-3.5" /> Oferta exclusiva
                </div>
                <h2 className="mt-3 font-display text-2xl text-[color:var(--midnight)] sm:text-3xl md:text-4xl">{featured.title}</h2>
                {featured.description && (
                  <p className="mt-3 text-sm text-[color:var(--muted-foreground)] sm:text-base">{featured.description}</p>
                )}
                {featured.expires_at && (
                  <div className="mt-3 inline-flex items-center gap-2 text-xs text-[color:var(--muted-foreground)]">
                    <Calendar className="h-3.5 w-3.5" /> Válido até {new Date(featured.expires_at).toLocaleDateString("pt-BR")}
                  </div>
                )}
                {featured.redirect_url && (
                  <button
                    type="button"
                    onClick={() => goPromo(featured.redirect_url)}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-8 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition hover:scale-[1.02]"
                  >
                    Ativar desconto <ArrowUpRight className="h-5 w-5" />
                  </button>
                )}
              </div>
              <div className="flex flex-col justify-center bg-gradient-to-br from-[color:var(--midnight)] to-[color:var(--accent)] p-6 text-center text-white sm:p-10">
                {(typeof featured.discount_percent === "number" || (c as any).discount_highlight) && (
                  <div>
                    <div className="font-display text-6xl font-bold md:text-7xl">
                      {featured.discount_percent ?? (c as any).discount_highlight}
                      <span className="text-3xl">%</span>
                    </div>
                    <div className="mt-1 text-sm uppercase tracking-[0.3em] text-white/80">OFF</div>
                  </div>
                )}
                {typeof featured.discount_value === "number" && !featured.discount_percent && (
                  <div className="font-display text-5xl font-bold">R$ {featured.discount_value}</div>
                )}
                {featured.coupon_code && (
                  <div className="mt-6">
                    <div className="text-[0.7rem] uppercase tracking-[0.25em] text-white/70">Cupom em destaque</div>
                    <div className="mt-1 rounded-xl border border-dashed border-white/40 bg-white/10 px-4 py-3 font-mono text-xl font-bold tracking-widest">
                      {featured.coupon_code}
                    </div>
                    <button
                      type="button"
                      onClick={() => copyCoupon(featured.coupon_code)}
                      className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-[color:var(--midnight)]"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copiar cupom
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* CUPONS MÚLTIPLOS DA PROMO PRINCIPAL */}
            {(featured.coupons?.length ?? 0) > 0 && (
              <div className="border-t border-[color:var(--border)] bg-[color:var(--muted)]/40 p-6 sm:p-10">
                <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[color:var(--accent)]">
                  <Ticket className="h-4 w-4" /> Cupons disponíveis
                </div>
                <CouponsGrid coupons={featured.coupons as Coupon[]} onCopy={copyCoupon} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* OUTRAS PROMOÇÕES */}
      {!showPaywall && others.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[color:var(--accent)]">
            <BadgePercent className="h-4 w-4" /> Outras promoções
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {others.map((p) => (
              <article key={p.id} className="flex flex-col overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--accent)]/10 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[color:var(--accent)]">
                      <Tag className="h-3 w-3" /> {TYPE_LABEL[p.type] ?? "Promoção"}
                    </div>
                    {typeof p.discount_percent === "number" && (
                      <div className="rounded-full bg-[color:var(--midnight)] px-3 py-1 text-sm font-bold text-white">
                        {p.discount_percent}% OFF
                      </div>
                    )}
                  </div>
                  <h4 className="mt-3 font-display text-xl text-[color:var(--midnight)]">{p.title}</h4>
                  {p.description && (
                    <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">{p.description}</p>
                  )}
                  {p.expires_at && (
                    <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-[color:var(--muted-foreground)]">
                      <Calendar className="h-3 w-3" /> Até {new Date(p.expires_at).toLocaleDateString("pt-BR")}
                    </div>
                  )}
                </div>

                {(p.coupons?.length ?? 0) > 0 && (
                  <div className="border-t border-dashed border-[color:var(--border)] bg-[color:var(--muted)]/40 p-6">
                    <CouponsGrid coupons={p.coupons as Coupon[]} onCopy={copyCoupon} compact />
                  </div>
                )}

                {p.redirect_url && (
                  <div className="mt-auto border-t border-[color:var(--border)] p-4">
                    <button
                      type="button"
                      onClick={() => goPromo(p.redirect_url)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110"
                    >
                      Ativar oferta <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* SOBRE + LINKS */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            {c.long_description && (
              <div className="rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-sm sm:p-8">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[color:var(--accent)]">
                  <Sparkles className="h-3.5 w-3.5" /> Sobre a empresa
                </div>
                <h2 className="mt-2 font-display text-2xl text-[color:var(--midnight)]">Conheça a marca</h2>
                <p className="mt-3 whitespace-pre-line text-[color:var(--muted-foreground)]">{c.long_description}</p>
              </div>
            )}
            {c.persuasion_text && (
              <div className="rounded-2xl border border-[color:var(--accent)]/30 bg-gradient-to-br from-[color:var(--accent)]/5 to-white p-6 shadow-sm sm:p-8">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
                  <Gift className="h-3.5 w-3.5" /> Por que aproveitar
                </div>
                <p className="mt-3 whitespace-pre-line text-[color:var(--midnight)]">{c.persuasion_text}</p>
              </div>
            )}
            {c.rules && (
              <div className="rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-sm sm:p-8">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[color:var(--muted-foreground)]">
                  <ShieldCheck className="h-3.5 w-3.5" /> Regras gerais
                </div>
                <p className="mt-3 whitespace-pre-line text-sm text-[color:var(--muted-foreground)]">{c.rules}</p>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {links.length > 0 && (
              <div className="rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-sm">
                <h3 className="font-display text-xl text-[color:var(--midnight)]">Links úteis</h3>
                <div className="mt-4 space-y-2">
                  {links.map((l) => {
                    const Icon = iconForLink(l.name);
                    return (
                      <a
                        key={l.id}
                        href={l.url}
                        target="_blank"
                        rel="noopener"
                        className="flex items-center justify-between rounded-xl border border-[color:var(--border)] px-4 py-3 text-sm transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent)]/5"
                      >
                        <span className="inline-flex items-center gap-3 font-medium text-[color:var(--midnight)]">
                          <Icon className="h-4 w-4 text-[color:var(--accent)]" /> {l.name}
                        </span>
                        <ExternalLink className="h-4 w-4 text-[color:var(--muted-foreground)]" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
            {(c.cta_title || c.cta_text) && (
              <div className={`rounded-2xl bg-gradient-to-br ${meta?.gradient ?? "from-slate-700 to-slate-900"} p-6 text-white shadow-md sm:p-8`}>
                <h3 className="font-display text-2xl">{c.cta_title ?? "Aproveite agora"}</h3>
                <p className="mt-2 text-white/85">{c.cta_text}</p>
                {(c as any).site_url && !showPaywall && (
                  <button
                    onClick={() => goPromo((c as any).site_url)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[color:var(--midnight)]"
                  >
                    Acessar agora <ArrowUpRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}

function CouponsGrid({
  coupons,
  onCopy,
  compact,
}: {
  coupons: Coupon[];
  onCopy: (code: string) => void;
  compact?: boolean;
}) {
  return (
    <div className={`grid gap-3 ${compact ? "sm:grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-2"}`}>
      {coupons.map((cp, i) => (
        <div
          key={`${cp.code}-${i}`}
          className="group relative overflow-hidden rounded-2xl border border-[color:var(--accent)]/25 bg-white p-4 shadow-sm transition hover:border-[color:var(--accent)] hover:shadow-md"
        >
          {/* Ticket notches */}
          <span className="absolute left-[-10px] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[color:var(--muted)]" />
          <span className="absolute right-[-10px] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[color:var(--muted)]" />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--midnight)] to-[color:var(--accent)] text-white">
                <Ticket className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[color:var(--muted-foreground)]">Código</div>
                <div className="truncate font-mono text-lg font-black tracking-widest text-[color:var(--midnight)]">
                  {cp.code}
                </div>
              </div>
            </div>
            {cp.value && (
              <div className="rounded-xl bg-[color:var(--accent)]/10 px-3 py-2 text-right">
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[color:var(--accent)]">Desconto</div>
                <div className="font-display text-lg font-black leading-none text-[color:var(--accent)]">
                  R$ {cp.value}
                </div>
              </div>
            )}
          </div>

          {cp.description && (
            <p className="mt-3 text-sm text-[color:var(--midnight)]/85">{cp.description}</p>
          )}
          {cp.min_purchase && (
            <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--muted-foreground)]">
              <Check className="h-3 w-3 text-[color:var(--accent)]" /> Compras a partir de R$ {cp.min_purchase}
            </div>
          )}

          <button
            type="button"
            onClick={() => onCopy(cp.code)}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[color:var(--accent)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[color:var(--accent)] transition hover:bg-[color:var(--accent)] hover:text-white"
          >
            <Copy className="h-3.5 w-3.5" /> Copiar cupom
          </button>
        </div>
      ))}
    </div>
  );
}