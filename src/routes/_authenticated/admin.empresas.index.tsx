import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListCompaniesFn, adminDeleteCompanyFn, adminDuplicateCompanyFn } from "@/lib/admin.functions";
import { Plus, Copy, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/empresas")({
  component: AdminEmpresas,
});

function AdminEmpresas() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListCompaniesFn);
  const delFn = useServerFn(adminDeleteCompanyFn);
  const dupFn = useServerFn(adminDuplicateCompanyFn);
  const q = useQuery({ queryKey: ["admin-companies"], queryFn: () => listFn() });
  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => { toast.success("Empresa excluída"); qc.invalidateQueries({ queryKey: ["admin-companies"] }); },
    onError: (e: any) => toast.error(e.message),
  });
  const dup = useMutation({
    mutationFn: (id: string) => dupFn({ data: { id } }),
    onSuccess: () => { toast.success("Empresa duplicada"); qc.invalidateQueries({ queryKey: ["admin-companies"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-[color:var(--midnight)]">Empresas</h1>
        <Link to="/admin/empresas/nova" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-110">
          <Plus className="h-4 w-4" /> Nova empresa
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--muted)] text-xs uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
            <tr>
              <th className="px-4 py-3 text-left">Empresa</th>
              <th className="px-4 py-3 text-left">Categoria</th>
              <th className="px-4 py-3 text-left">Acessos</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(q.data ?? []).map((c) => (
              <tr key={c.id} className="border-t border-[color:var(--border)]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {c.logo_url && <img src={c.logo_url} alt={c.name} className="h-8 w-8 rounded object-cover" />}
                    <div>
                      <div className="font-medium text-[color:var(--midnight)]">{c.name}</div>
                      <div className="text-xs text-[color:var(--muted-foreground)]">/empresa/{c.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{(c as any).categories?.name ?? "—"}</td>
                <td className="px-4 py-3">{c.access_count}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link to="/admin/empresas/$id" params={{ id: c.id }} className="rounded-lg border border-[color:var(--border)] p-2 hover:bg-[color:var(--muted)]" title="Editar">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button onClick={() => dup.mutate(c.id)} className="rounded-lg border border-[color:var(--border)] p-2 hover:bg-[color:var(--muted)]" title="Duplicar">
                      <Copy className="h-4 w-4" />
                    </button>
                    <button onClick={() => confirm("Excluir empresa?") && del.mutate(c.id)} className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50" title="Excluir">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!q.data?.length && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-[color:var(--muted-foreground)]">Nenhuma empresa cadastrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
