import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListCompaniesFn } from "@/lib/admin.functions";
import { CATEGORIES } from "@/lib/categories";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const fn = useServerFn(adminListCompaniesFn);
  const q = useQuery({ queryKey: ["admin-companies"], queryFn: () => fn() });
  const total = q.data?.length ?? 0;
  return (
    <div>
      <h1 className="font-display text-3xl text-[color:var(--midnight)]">Visão geral</h1>
      <p className="mt-2 text-[color:var(--muted-foreground)]">Resumo do clube Royalle.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card label="Empresas" value={total} />
        <Card label="Categorias" value={CATEGORIES.length} />
        <Card label="Em destaque" value={q.data?.filter((c) => c.featured).length ?? 0} />
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-sm">
      <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">{label}</div>
      <div className="mt-2 font-display text-4xl text-[color:var(--midnight)]">{value}</div>
    </div>
  );
}
