import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteShell } from "@/components/site/SiteLayout";
import { listCategoriesFn, listCompaniesFn } from "@/lib/companies.functions";
import { CATEGORIES, getCategoryMeta } from "@/lib/categories";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, LayoutGrid, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Royalle Club" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const listCats = useServerFn(listCategoriesFn);
  const listCompanies = useServerFn(listCompaniesFn);

  const cats = useQuery({ queryKey: ["categories"], queryFn: () => listCats() });
  const companies = useQuery({
    queryKey: ["dashboard-companies"],
    queryFn: () => listCompanies({ data: { limit: 24, orderBy: "created_at" } }),
  });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <SiteShell>
      <section className="bg-gradient-to-br from-[color:var(--midnight)] to-[color:var(--midnight-2)] py-12 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--gold)]">Painel do Membro</div>
            <h1 className="mt-2 font-display text-4xl">Bem-vindo ao seu Royalle</h1>
            <p className="mt-2 text-white/70">Acesse promoções exclusivas, organizadas por categoria.</p>
          </div>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm text-white hover:bg-white/10">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
            <LayoutGrid className="h-3.5 w-3.5" /> Categorias
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.slug}
                  to="/categoria/$slug"
                  params={{ slug: c.slug }}
                  className={`group flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-br ${c.gradient} p-5 text-white shadow-md transition hover:-translate-y-1 hover:shadow-xl`}
                >
                  <Icon className="h-8 w-8" strokeWidth={1.5} />
                  <div className="text-center text-sm font-semibold leading-tight">{c.name}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--muted)] py-12">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-6 font-display text-2xl text-[color:var(--midnight)]">Promoções liberadas</h2>
          {companies.isLoading ? (
            <div className="text-sm text-[color:var(--muted-foreground)]">Carregando…</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {(companies.data ?? []).map((c) => {
                const meta = getCategoryMeta((c as any).categories?.slug);
                const Icon = meta?.icon;
                return (
                  <Link
                    key={c.id}
                    to="/empresa/$slug"
                    params={{ slug: c.slug }}
                    className="group flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      {c.logo_url ? (
                        <img src={c.logo_url} alt={c.name} className="h-12 w-12 rounded-lg object-cover" />
                      ) : (
                        <div className={`grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br ${meta?.gradient ?? "from-slate-500 to-slate-700"} text-white`}>
                          {Icon && <Icon className="h-5 w-5" />}
                        </div>
                      )}
                      <div>
                        <div className="font-display text-base text-[color:var(--midnight)]">{c.name}</div>
                        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-[color:var(--accent)]">{(c as any).categories?.name}</div>
                      </div>
                    </div>
                    <p className="line-clamp-2 text-sm text-[color:var(--muted-foreground)]">{c.short_description ?? "Promoção exclusiva para membros."}</p>
                    <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--accent)]">
                      Ver promoção <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </Link>
                );
              })}
              {!companies.data?.length && (
                <div className="rounded-xl border border-dashed border-[color:var(--border)] bg-white p-8 text-center text-sm text-[color:var(--muted-foreground)]">
                  Nenhuma promoção cadastrada ainda. O administrador pode cadastrar empresas no painel admin.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
