import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getCompanyBySlugFn, incrementAccessFn } from "@/lib/companies.functions";
import { getMyProfileFn } from "@/lib/account.functions";
import { useAuth } from "@/hooks/use-auth";
import { SiteShell } from "@/components/site/SiteLayout";
import { getCategoryMeta } from "@/lib/categories";
import { ArrowUpRight, Copy, Sparkles, ShieldCheck, Tag, Globe, Instagram, MessageCircle, Mail, Calendar, Crown, ExternalLink, Lock } from "lucide-react";
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

function CompanyPage() {
  const { slug } = useParams({ from: "/empresa/$slug" });
  const { user, loading: authLoading } = useAuth();
  const fn = useServerFn(getCompanyBySlugFn);
  const incFn = useServerFn(incrementAccessFn);
  const profileFn = useServerFn(getMyProfileFn);
  const q = useQuery({ queryKey: ["company", slug], queryFn: () => fn({ data: { slug } }) });
  const profileQ = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: () => profileFn(),
    enabled: !!user,
  });
  const inc = useMutation({ mutationFn: () => incFn({ data: { slug } }) });

  if (q.isLoading)
    return <SiteShell><div className="mx-auto max-w-6xl px-6 py-20 text-[color:var(--muted-foreground)]">Carregando…</div></SiteShell>;
  const c = q.data;
  if (!c)
    return <SiteShell><div className="mx-auto max-w-6xl px-6 py-20 text-center">Empresa não encontrada. <Link to="/dashboard" className="underline">Voltar</Link></div></SiteShell>;

  const isSubscribed = !!profileQ.data?.subscription_active;
  const showPaywall = !authLoading && (!user || (!profileQ.isLoading && !isSubscribed));

  const meta = getCategoryMeta((c as any).categories?.slug);
  const promos: any[] = (c as any).promotions ?? [];
  const links: any[] = (c as any).links ?? [];
  const featured = promos.find((p) => p.featured) ?? promos[0];
  const others = promos.filter((p) => p !== featured);

  function copyCoupon(code: string) {
    navigator.clipboard.writeText(code).then(() => toast.success("Cupom copiado!"));
  }
  function goPromo(url: string) {
    inc.mutate();
    window.open(url, "_blank", "noopener");
  }

  return (
    <SiteShell>
      {/* HERO */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${meta?.gradient ?? "from-slate-700 to-slate-900"} text-white`}>
        {c.cover_url && <img src={c.cover_url} alt={c.name} className="absolute inset-0 h-full w-full object-cover opacity-30" />}
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 py-16 text-center">
          {c.logo_url && (
            <img src={c.logo_url} alt={c.name} className="h-28 w-28 rounded-2xl border-4 border-white/40 bg-white object-cover shadow-xl" />
          )}
          <div className="text-xs uppercase tracking-[0.3em] text-white/80">{(c as any).categories?.name}</div>
          <h1 className="font-display text-5xl drop-shadow">{c.name}</h1>
          {c.short_description && <p className="max-w-2xl text-white/80">{c.short_description}</p>}
          {(c as any).site_url && (
            <button
              type="button"
              onClick={() => goPromo((c as any).site_url)}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[color:var(--midnight)] shadow-lg hover:scale-[1.02] transition"
            >
              Visitar site oficial <ArrowUpRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </section>

      {/* PROMO PRINCIPAL */}
      {showPaywall ? (
        <section className="mx-auto -mt-10 max-w-3xl px-6">
          <div className="rounded-3xl border border-[color:var(--accent)]/30 bg-white p-10 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-display text-3xl text-[color:var(--midnight)]">
              Conteúdo exclusivo para membros Royalle
            </h2>
            <p className="mt-3 text-[color:var(--muted-foreground)]">
              Para ativar este desconto, você precisa de uma assinatura ativa. Conheça os planos a partir de R$ 9,90/mês e libere todos os benefícios.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link to="/planos" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-7 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg hover:scale-[1.02] transition">
                Ver planos <ArrowUpRight className="h-4 w-4" />
              </Link>
              {!user ? (
                <Link to="/login" className="inline-flex items-center gap-2 rounded-full border border-[color:var(--midnight)] px-7 py-3 text-sm font-bold uppercase tracking-wide text-[color:var(--midnight)] hover:bg-[color:var(--midnight)] hover:text-white transition">
                  Já sou membro
                </Link>
              ) : (
                <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-[color:var(--midnight)] px-7 py-3 text-sm font-bold uppercase tracking-wide text-[color:var(--midnight)] hover:bg-[color:var(--midnight)] hover:text-white transition">
                  Ir para minha área
                </Link>
              )}
            </div>
          </div>
        </section>
      ) : featured && (
        <section className="mx-auto -mt-10 max-w-5xl px-6">
          <div className="rounded-3xl border border-[color:var(--accent)]/30 bg-white p-8 shadow-2xl md:p-12">
            <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)]/10 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[color:var(--accent)]">
                  <Crown className="h-3.5 w-3.5" /> Oferta exclusiva
                </div>
                <h2 className="mt-3 font-display text-3xl text-[color:var(--midnight)] md:text-4xl">{featured.title}</h2>
                {featured.description && (
                  <p className="mt-3 text-[color:var(--muted-foreground)]">{featured.description}</p>
                )}
                {featured.expires_at && (
                  <div className="mt-3 inline-flex items-center gap-2 text-xs text-[color:var(--muted-foreground)]">
                    <Calendar className="h-3.5 w-3.5" /> Válido até {new Date(featured.expires_at).toLocaleDateString("pt-BR")}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => goPromo(featured.redirect_url)}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-8 py-4 text-base font-bold uppercase tracking-wide text-white shadow-lg hover:scale-[1.02] transition"
                >
                  Ativar desconto <ArrowUpRight className="h-5 w-5" />
                </button>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[color:var(--midnight)] to-[color:var(--accent)] p-8 text-white text-center">
                {(typeof featured.discount_percent === "number" || (c as any).discount_highlight) && (
                  <div>
                    <div className="font-display text-6xl font-bold md:text-7xl">
                      {featured.discount_percent ?? (c as any).discount_highlight}<span className="text-3xl">%</span>
                    </div>
                    <div className="mt-1 text-sm uppercase tracking-[0.3em] text-white/80">OFF</div>
                  </div>
                )}
                {typeof featured.discount_value === "number" && !featured.discount_percent && (
                  <div className="font-display text-5xl font-bold">R$ {featured.discount_value}</div>
                )}
                {featured.coupon_code && (
                  <div className="mt-5">
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
          </div>
        </section>
      )}

      {/* OUTRAS PROMOÇÕES */}
      {others.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-3xl text-[color:var(--midnight)]">Outras promoções</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <div key={p.id} className="flex flex-col rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.25em] text-[color:var(--accent)]">
                    <Tag className="h-3 w-3" /> {TYPE_LABEL[p.type] ?? "Promoção"}
                  </div>
                  {typeof p.discount_percent === "number" && (
                    <div className="rounded-full bg-[color:var(--accent)]/10 px-3 py-1 text-sm font-bold text-[color:var(--accent)]">
                      {p.discount_percent}% OFF
                    </div>
                  )}
                </div>
                <h4 className="mt-2 font-display text-lg text-[color:var(--midnight)]">{p.title}</h4>
                {p.description && <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">{p.description}</p>}
                {p.coupon_code && (
                  <button
                    type="button"
                    onClick={() => copyCoupon(p.coupon_code)}
                    className="mt-3 flex items-center justify-between rounded-lg border border-dashed border-[color:var(--accent)]/40 bg-[color:var(--accent)]/5 px-4 py-2 text-sm font-mono text-[color:var(--midnight)] hover:bg-[color:var(--accent)]/10"
                  >
                    <span>{p.coupon_code}</span>
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                )}
                {p.expires_at && (
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-[color:var(--muted-foreground)]">
                    <Calendar className="h-3 w-3" /> Até {new Date(p.expires_at).toLocaleDateString("pt-BR")}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => goPromo(p.redirect_url)}
                  className="mt-auto pt-4"
                >
                  <span className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[color:var(--accent)] px-4 py-2.5 text-sm font-semibold text-[color:var(--accent)] hover:bg-[color:var(--accent)]/5">
                    Ver oferta <ArrowUpRight className="h-4 w-4" />
                  </span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SOBRE + LINKS */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            {c.long_description && (
              <div className="rounded-2xl border border-[color:var(--border)] bg-white p-8 shadow-sm">
                <h2 className="font-display text-2xl text-[color:var(--midnight)]">Sobre a empresa</h2>
                <p className="mt-3 whitespace-pre-line text-[color:var(--muted-foreground)]">{c.long_description}</p>
              </div>
            )}
            {c.persuasion_text && (
              <div className="rounded-2xl border border-[color:var(--accent)]/30 bg-gradient-to-br from-[color:var(--accent)]/5 to-white p-8 shadow-sm">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
                  <Sparkles className="h-3.5 w-3.5" /> Por que aproveitar
                </div>
                <p className="mt-3 whitespace-pre-line text-[color:var(--midnight)]">{c.persuasion_text}</p>
              </div>
            )}
            {c.rules && (
              <div className="rounded-2xl border border-[color:var(--border)] bg-white p-8 shadow-sm">
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
                        className="flex items-center justify-between rounded-xl border border-[color:var(--border)] px-4 py-3 text-sm hover:border-[color:var(--accent)] hover:bg-[color:var(--accent)]/5"
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
              <div className={`rounded-2xl bg-gradient-to-br ${meta?.gradient ?? "from-slate-700 to-slate-900"} p-8 text-white shadow-md`}>
                <h3 className="font-display text-2xl">{c.cta_title ?? "Aproveite agora"}</h3>
                <p className="mt-2 text-white/85">{c.cta_text}</p>
                {(c as any).site_url && (
                  <button onClick={() => goPromo((c as any).site_url)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[color:var(--midnight)]">
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
