import { createFileRoute, Link, useParams, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listCompaniesFn } from "@/lib/companies.functions";
import { SiteShell } from "@/components/site/SiteLayout";
import { CATEGORY_BY_SLUG } from "@/lib/categories";
import { ArrowUpRight, MapPin } from "lucide-react";

export const Route = createFileRoute("/categoria/$slug")({
  head: ({ params }) => {
    const meta = CATEGORY_BY_SLUG[params.slug];
    return { meta: [{ title: `${meta?.name ?? "Categoria"} — Royalle Club` }] };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = useParams({ from: "/categoria/$slug" });
  const meta = CATEGORY_BY_SLUG[slug];
  if (!meta) throw notFound();
  const Icon = meta.icon;
  const fn = useServerFn(listCompaniesFn);
  const q = useQuery({
    queryKey: ["companies", slug],
    queryFn: () => fn({ data: { categorySlug: slug, limit: 60, orderBy: "created_at" } }),
  });

  return (
    <SiteShell>
      <section className={`bg-gradient-to-br ${meta.gradient} py-14 text-white`}>
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white/15 backdrop-blur">
            <Icon className="h-10 w-10" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/80">Categoria Royalle</div>
            <h1 className="mt-1 font-display text-5xl">{meta.name}</h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {q.isLoading ? (
          <div className="text-[color:var(--muted-foreground)]">Carregando…</div>
        ) : !q.data?.length ? (
          <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-white p-12 text-center">
            <p className="text-[color:var(--muted-foreground)]">Ainda não há empresas nesta categoria.</p>
            <Link to="/dashboard" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-semibold text-white">Ver todas</Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {q.data.map((c) => (
              <Link key={c.id} to="/login" className="group flex flex-col gap-3 rounded-2xl border border-[color:var(--border)] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center gap-3">
                  {c.logo_url ? (
                    <img src={c.logo_url} alt={c.name} className="h-12 w-12 rounded-lg object-cover" />
                  ) : (
                    <div className={`grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br ${meta.gradient} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-display text-base text-[color:var(--midnight)]">{c.name}</div>
                    {c.city && (
                      <div className="inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
                        <MapPin className="h-3 w-3" /> {c.city}
                      </div>
                    )}
                  </div>
                </div>
                <p className="line-clamp-2 text-sm text-[color:var(--muted-foreground)]">{c.short_description ?? "Aproveite o benefício exclusivo Royalle."}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--accent)]">
                  Ver promoção <ArrowUpRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
