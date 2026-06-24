import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminGetCompanyFn } from "@/lib/admin.functions";
import { CompanyForm } from "@/components/admin/CompanyForm";

export const Route = createFileRoute("/_authenticated/admin/empresas/$id")({
  component: EditCompanyPage,
});

function EditCompanyPage() {
  const { id } = Route.useParams();
  const fn = useServerFn(adminGetCompanyFn);
  const q = useQuery({ queryKey: ["admin-company", id], queryFn: () => fn({ data: { id } }) });
  if (q.isLoading) return <div className="text-[color:var(--muted-foreground)]">Carregando…</div>;
  if (!q.data) return <div>Empresa não encontrada.</div>;
  return <CompanyForm initial={q.data as any} />;
}
