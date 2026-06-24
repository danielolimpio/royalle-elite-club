import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getCompanyBySlugFn, incrementAccessFn } from "@/lib/companies.functions";
import { SiteShell } from "@/components/site/SiteLayout";
import { getCategoryMeta } from "@/lib/categories";
import { ArrowUpRight, Copy, Sparkles, ShieldCheck, Tag } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/empresa/$slug")({
  head: () => ({ meta: [{ title: "Empresa — Royalle Club" }] }),
  component: CompanyPage,
});

function CompanyPage() {
  const { slug } = useParams({ from: "/empresa/$slug" });
  const fn = useServerFn(getCompanyBySlugFn);
  const incFn = useServerFn(incrementAccessFn);
  const q = useQuery({ queryKey: ["company", slug], queryFn: () => fn({ data: { slug } }) });
  const inc = useMutation({ mutationFn: () => incFn({ data: { slug } }) });

  if (q.isLoading)
    return <SiteShell><div className="mx-auto max-w-6xl px-6 py-20 text-[color:var(--muted-foreground)]">Carregando…</div></SiteShell>;
  const c = q.data;
  if (!c)
    return <SiteShell><div className="mx-auto max-w-6xl px-6 py-20 text-center">Empresa não encontrada. <Link to="/dashboard" className="underline">Voltar</Link></div></SiteShell>;

  const meta = getCategoryMeta((c as any).categories?.slug);

  function copyCoupon(code: string) {
    navigator.clipboard.writeText(code).then(() => toast.success("Cupom copiado!"));
  }
  function goPromo(url: string) {
    inc.mutate();
    window.open(url, "_blank", "noopener");
  }

  return (
    <SiteShell>
      <section className={`relative bg-gradient-to-br ${meta?.gradient ?? "from-slate-700 to-slate-900"} text-white`}>
        {c.cover_url && <img src={c.cover_url} alt={c.name} className="absolute inset-0 h-full w-full object-cover opacity-30" />}
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center">
          {c.logo_url && (
            <img src={c.logo_url} alt={c.name} className="h-24 w-24 rounded-2xl border-4 border-white/40 bg-white object-cover shadow-xl" />
          )}
          <div className="text-xs uppercase tracking-[0.3em] text-white/80">{(c as any).categories?.name}</div>
          <h1 className="font-display text-5xl">{c.name}</h1>
          {c.short_description && <p className="max-w-2xl text-white/80">{c.short_description}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
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
            {(c.cta_title || c.cta_text) && (
              <div className={`rounded-2xl bg-gradient-to-br ${meta?.gradient ?? "from-slate-700 to-slate-900"} p-8 text-white shadow-md`}>
                <h3 className="font-display text-2xl">{c.cta_title ?? "Aproveite agora"}</h3>
                <p className="mt-2 text-white/85">{c.cta_text}</p>
              </div>
            )}
            <div className="space-y-4">
              {(c.promotions ?? []).map((p: any) => (
                <div key={p.id} className="rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.25em] text-[color:var(--accent)]">
                        <Tag className="h-3 w-3" /> Promoção
                      </div>
                      <h4 className="mt-1 font-display text-lg text-[color:var(--midnight)]">{p.title}</h4>
                    </div>
                    {typeof p.discount_percent === "number" && (
                      <div className="rounded-full bg-[color:var(--accent)]/10 px-3 py-1 text-sm font-bold text-[color:var(--accent)]">
                        {p.discount_percent}% OFF
                      </div>
                    )}
                  </div>
                  {p.description && <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">{p.description}</p>}
                  {p.coupon_code && (
                    <button
                      type="button"
                      onClick={() => copyCoupon(p.coupon_code)}
                      className="mt-3 flex w-full items-center justify-between rounded-lg border border-dashed border-[color:var(--accent)]/40 bg-[color:var(--accent)]/5 px-4 py-2 text-sm font-mono text-[color:var(--midnight)] hover:bg-[color:var(--accent)]/10"
                    >
                      <span>{p.coupon_code}</span>
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {p.rules && <p className="mt-2 text-xs text-[color:var(--muted-foreground)]">{p.rules}</p>}
                  <button
                    type="button"
                    onClick={() => goPromo(p.redirect_url)}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110"
                  >
                    Ir para o site <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {!c.promotions?.length && (
                <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-white p-6 text-center text-sm text-[color:var(--muted-foreground)]">
                  Nenhuma promoção ativa no momento.
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
