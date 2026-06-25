import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Upload, Save, GripVertical } from "lucide-react";
import { adminListBannersFn, adminSaveBannerFn, adminDeleteBannerFn } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/banners")({
  component: AdminBanners,
});

type Banner = {
  id?: string;
  image_url: string;
  link_url?: string | null;
  title?: string | null;
  subtitle?: string | null;
  alt?: string | null;
  sort_order?: number;
  active?: boolean;
};

function AdminBanners() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListBannersFn);
  const saveFn = useServerFn(adminSaveBannerFn);
  const delFn = useServerFn(adminDeleteBannerFn);
  const q = useQuery({ queryKey: ["admin-banners"], queryFn: () => listFn() });
  const [draft, setDraft] = useState<Banner>({ image_url: "", link_url: "", title: "", subtitle: "", active: true, sort_order: 0 });

  const save = useMutation({
    mutationFn: (b: Banner) => saveFn({ data: b as any }),
    onSuccess: () => { toast.success("Banner salvo"); qc.invalidateQueries({ queryKey: ["admin-banners"] }); setDraft({ image_url: "", link_url: "", title: "", subtitle: "", active: true, sort_order: 0 }); },
    onError: (e: any) => toast.error(e.message ?? "Erro ao salvar"),
  });
  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => { toast.success("Banner removido"); qc.invalidateQueries({ queryKey: ["admin-banners"] }); },
  });

  async function uploadImage(file: File, onUrl: (u: string) => void) {
    const ext = file.name.split(".").pop();
    const path = `banners/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("company-assets").upload(path, file, { upsert: false });
    if (error) { toast.error(error.message); return; }
    const { data: pub } = supabase.storage.from("company-assets").getPublicUrl(path);
    onUrl(pub.publicUrl);
    toast.success("Imagem enviada");
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-[color:var(--midnight)]">Banners do carrossel</h1>
          <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">Dimensão recomendada: <strong>1300 × 300 px</strong>. Cada banner pode ter um link próprio.</p>
        </div>
      </header>

      <section className="rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl text-[color:var(--midnight)]">Novo banner</h2>
        <BannerForm
          value={draft}
          onChange={setDraft}
          onUpload={(f) => uploadImage(f, (u) => setDraft((d) => ({ ...d, image_url: u })))}
          submitting={save.isPending}
          onSubmit={() => { if (!draft.image_url) return toast.error("Envie uma imagem"); save.mutate(draft); }}
        />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-[color:var(--midnight)]">Banners ativos ({q.data?.length ?? 0})</h2>
        {q.isLoading && <p className="text-sm text-[color:var(--muted-foreground)]">Carregando…</p>}
        {q.data?.length === 0 && <p className="text-sm text-[color:var(--muted-foreground)]">Nenhum banner cadastrado.</p>}
        <div className="space-y-4">
          {(q.data ?? []).map((b: any) => (
            <BannerRow key={b.id} initial={b} onSave={(v) => save.mutate({ ...v, id: b.id })} onDelete={() => del.mutate(b.id)} onUpload={(f, set) => uploadImage(f, set)} saving={save.isPending} />
          ))}
        </div>
      </section>

      <style>{`
        .input { width: 100%; border-radius: 0.75rem; border: 1px solid var(--border); background: white; padding: 0.6rem 0.8rem; font-size: 0.9rem; outline: none; }
        .input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 25%, transparent); }
      `}</style>
    </div>
  );
}

function BannerForm({ value, onChange, onUpload, onSubmit, submitting }: {
  value: Banner; onChange: (b: Banner) => void; onUpload: (f: File) => void; onSubmit: () => void; submitting: boolean;
}) {
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-[260px_1fr]">
      <div>
        <div className="aspect-[1300/300] w-full overflow-hidden rounded-xl border border-dashed border-[color:var(--border)] bg-[color:var(--muted)]">
          {value.image_url ? <img src={value.image_url} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-xs text-[color:var(--muted-foreground)]">1300 × 300</div>}
        </div>
        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-xs font-semibold hover:bg-[color:var(--muted)]">
          <Upload className="h-3.5 w-3.5" /> Enviar imagem
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
        </label>
      </div>
      <div className="grid gap-3">
        <Labeled label="Link de redirecionamento (ao clicar)">
          <input className="input" placeholder="https://… ou /categoria/moda" value={value.link_url ?? ""} onChange={(e) => onChange({ ...value, link_url: e.target.value })} />
        </Labeled>
        <div className="grid gap-3 md:grid-cols-2">
          <Labeled label="Título (opcional)">
            <input className="input" value={value.title ?? ""} onChange={(e) => onChange({ ...value, title: e.target.value })} />
          </Labeled>
          <Labeled label="Subtítulo (opcional)">
            <input className="input" value={value.subtitle ?? ""} onChange={(e) => onChange({ ...value, subtitle: e.target.value })} />
          </Labeled>
          <Labeled label="Texto alternativo (acessibilidade)">
            <input className="input" value={value.alt ?? ""} onChange={(e) => onChange({ ...value, alt: e.target.value })} />
          </Labeled>
          <Labeled label="Ordem">
            <input type="number" className="input" value={value.sort_order ?? 0} onChange={(e) => onChange({ ...value, sort_order: Number(e.target.value) })} />
          </Labeled>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={value.active !== false} onChange={(e) => onChange({ ...value, active: e.target.checked })} />
          Ativo (exibir no carrossel)
        </label>
        <div>
          <button type="button" onClick={onSubmit} disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            <Save className="h-4 w-4" /> {submitting ? "Salvando…" : "Salvar banner"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BannerRow({ initial, onSave, onDelete, onUpload, saving }: {
  initial: Banner; onSave: (b: Banner) => void; onDelete: () => void; onUpload: (f: File, set: (u: string) => void) => void; saving: boolean;
}) {
  const [v, setV] = useState<Banner>(initial);
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[color:var(--accent)]">
        <GripVertical className="h-4 w-4" /> Banner #{v.sort_order ?? 0}
        <button type="button" onClick={onDelete} className="ml-auto inline-flex items-center gap-1 rounded-lg border border-red-200 px-2 py-1 text-red-600 hover:bg-red-50">
          <Trash2 className="h-3.5 w-3.5" /> Remover
        </button>
      </div>
      <div className="mt-3">
        <BannerForm value={v} onChange={setV} onUpload={(f) => onUpload(f, (u) => setV((d) => ({ ...d, image_url: u })))} submitting={saving} onSubmit={() => onSave(v)} />
      </div>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--muted-foreground)]">{label}</div>
      {children}
    </label>
  );
}