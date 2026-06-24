import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminSaveCompanyFn } from "@/lib/admin.functions";
import { listCategoriesFn } from "@/lib/companies.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Upload, Copy } from "lucide-react";

type Promotion = {
  id?: string;
  title: string;
  description?: string | null;
  discount_percent?: number | null;
  coupon_code?: string | null;
  redirect_url: string;
  rules?: string | null;
  active?: boolean;
};

type CompanyData = {
  id?: string;
  slug: string;
  name: string;
  category_id: string;
  logo_url?: string | null;
  cover_url?: string | null;
  short_description?: string | null;
  long_description?: string | null;
  cta_title?: string | null;
  cta_text?: string | null;
  persuasion_text?: string | null;
  rules?: string | null;
  city?: string | null;
  featured?: boolean;
  promotions: Promotion[];
};

const empty: CompanyData = {
  slug: "",
  name: "",
  category_id: "",
  logo_url: "",
  cover_url: "",
  short_description: "",
  long_description: "",
  cta_title: "Aproveite agora",
  cta_text: "Use seu benefício exclusivo Royalle.",
  persuasion_text: "",
  rules: "",
  city: "",
  featured: false,
  promotions: [{ title: "", redirect_url: "", active: true }],
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CompanyForm({ initial }: { initial?: CompanyData }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [data, setData] = useState<CompanyData>(() => ({ ...empty, ...(initial ?? {}) }));
  const catsFn = useServerFn(listCategoriesFn);
  const saveFn = useServerFn(adminSaveCompanyFn);
  const cats = useQuery({ queryKey: ["categories"], queryFn: () => catsFn() });

  const save = useMutation({
    mutationFn: () => saveFn({ data }),
    onSuccess: () => {
      toast.success("Empresa salva com sucesso");
      qc.invalidateQueries({ queryKey: ["admin-companies"] });
      navigate({ to: "/admin/empresas" });
    },
    onError: (e: any) => toast.error(e.message ?? "Erro ao salvar"),
  });

  function set<K extends keyof CompanyData>(k: K, v: CompanyData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function updatePromo(idx: number, patch: Partial<Promotion>) {
    setData((d) => ({
      ...d,
      promotions: d.promotions.map((p, i) => (i === idx ? { ...p, ...patch } : p)),
    }));
  }

  function addPromo() {
    setData((d) => ({ ...d, promotions: [...d.promotions, { title: "", redirect_url: "", active: true }] }));
  }

  function duplicatePromo(idx: number) {
    setData((d) => {
      const clone = { ...d.promotions[idx], id: undefined, title: `${d.promotions[idx].title} (cópia)` };
      const next = [...d.promotions];
      next.splice(idx + 1, 0, clone);
      return { ...d, promotions: next };
    });
  }

  function removePromo(idx: number) {
    setData((d) => ({ ...d, promotions: d.promotions.filter((_, i) => i !== idx) }));
  }

  async function uploadFile(file: File, prefix: "logo" | "cover") {
    const ext = file.name.split(".").pop();
    const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("company-assets").upload(path, file, { upsert: false });
    if (error) { toast.error(error.message); return; }
    const { data: pub } = supabase.storage.from("company-assets").getPublicUrl(path);
    set(prefix === "logo" ? "logo_url" : "cover_url", pub.publicUrl);
    toast.success("Imagem enviada");
  }

  const canSave = useMemo(
    () => data.name && data.slug && data.category_id && data.promotions.every((p) => p.title && p.redirect_url),
    [data],
  );

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (canSave) save.mutate(); }}
      className="space-y-8"
    >
      <header className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-[color:var(--midnight)]">
          {initial?.id ? "Editar empresa" : "Nova empresa"}
        </h1>
        <button
          type="submit"
          disabled={!canSave || save.isPending}
          className="rounded-full bg-[color:var(--accent)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
        >
          {save.isPending ? "Salvando…" : "Salvar empresa"}
        </button>
      </header>

      <Section title="Identificação">
        <Field label="Nome">
          <input
            className="input"
            value={data.name}
            onChange={(e) => { const v = e.target.value; set("name", v); if (!initial?.id) set("slug", slugify(v)); }}
          />
        </Field>
        <Field label="Slug (URL)">
          <input className="input" value={data.slug} onChange={(e) => set("slug", slugify(e.target.value))} />
        </Field>
        <Field label="Categoria">
          <select className="input" value={data.category_id} onChange={(e) => set("category_id", e.target.value)}>
            <option value="">Selecione…</option>
            {(cats.data ?? []).map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Cidade (opcional)">
          <input className="input" value={data.city ?? ""} onChange={(e) => set("city", e.target.value)} />
        </Field>
        <Field label="Destaque?">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!data.featured} onChange={(e) => set("featured", e.target.checked)} />
            Exibir em destaques
          </label>
        </Field>
      </Section>

      <Section title="Imagens">
        <ImageField label="Logomarca" url={data.logo_url} onUpload={(f) => uploadFile(f, "logo")} onClear={() => set("logo_url", "")} />
        <ImageField label="Capa" url={data.cover_url} onUpload={(f) => uploadFile(f, "cover")} onClear={() => set("cover_url", "")} />
      </Section>

      <Section title="Descrição e copy">
        <Field label="Descrição curta" full>
          <textarea className="input min-h-[64px]" value={data.short_description ?? ""} onChange={(e) => set("short_description", e.target.value)} />
        </Field>
        <Field label="Descrição completa" full>
          <textarea className="input min-h-[120px]" value={data.long_description ?? ""} onChange={(e) => set("long_description", e.target.value)} />
        </Field>
        <Field label="Título da chamada (CTA)">
          <input className="input" value={data.cta_title ?? ""} onChange={(e) => set("cta_title", e.target.value)} />
        </Field>
        <Field label="Texto da chamada (CTA)">
          <input className="input" value={data.cta_text ?? ""} onChange={(e) => set("cta_text", e.target.value)} />
        </Field>
        <Field label="Texto de persuasão" full>
          <textarea className="input min-h-[80px]" value={data.persuasion_text ?? ""} onChange={(e) => set("persuasion_text", e.target.value)} />
        </Field>
        <Field label="Regras gerais" full>
          <textarea className="input min-h-[80px]" value={data.rules ?? ""} onChange={(e) => set("rules", e.target.value)} />
        </Field>
      </Section>

      <Section title="Promoções" actions={
        <button type="button" onClick={addPromo} className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--accent)] hover:bg-[color:var(--accent)]/5">
          <Plus className="h-4 w-4" /> Adicionar promoção
        </button>
      }>
        <div className="col-span-full space-y-4">
          {data.promotions.map((p, idx) => (
            <div key={idx} className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)]/40 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--accent)]">Promoção {idx + 1}</div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => duplicatePromo(idx)} className="rounded-lg border border-[color:var(--border)] bg-white p-1.5 hover:bg-[color:var(--muted)]" title="Duplicar"><Copy className="h-4 w-4" /></button>
                  {data.promotions.length > 1 && (
                    <button type="button" onClick={() => removePromo(idx)} className="rounded-lg border border-red-200 bg-white p-1.5 text-red-600 hover:bg-red-50" title="Remover"><Trash2 className="h-4 w-4" /></button>
                  )}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Título da promoção">
                  <input className="input" value={p.title} onChange={(e) => updatePromo(idx, { title: e.target.value })} />
                </Field>
                <Field label="Link de redirecionamento">
                  <input className="input" value={p.redirect_url} onChange={(e) => updatePromo(idx, { redirect_url: e.target.value })} placeholder="https://" />
                </Field>
                <Field label="% de desconto">
                  <input type="number" className="input" value={p.discount_percent ?? ""} onChange={(e) => updatePromo(idx, { discount_percent: e.target.value === "" ? null : Number(e.target.value) })} />
                </Field>
                <Field label="Cupom">
                  <input className="input" value={p.coupon_code ?? ""} onChange={(e) => updatePromo(idx, { coupon_code: e.target.value })} />
                </Field>
                <Field label="Descrição" full>
                  <textarea className="input min-h-[64px]" value={p.description ?? ""} onChange={(e) => updatePromo(idx, { description: e.target.value })} />
                </Field>
                <Field label="Regras específicas" full>
                  <textarea className="input min-h-[64px]" value={p.rules ?? ""} onChange={(e) => updatePromo(idx, { rules: e.target.value })} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <style>{`
        .input { width: 100%; border-radius: 0.75rem; border: 1px solid var(--border); background: white; padding: 0.6rem 0.8rem; font-size: 0.9rem; outline: none; }
        .input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 25%, transparent); }
      `}</style>
    </form>
  );
}

function Section({ title, children, actions }: { title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl text-[color:var(--midnight)]">{title}</h2>
        {actions}
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--muted-foreground)]">{label}</div>
      {children}
    </label>
  );
}

function ImageField({ label, url, onUpload, onClear }: { label: string; url?: string | null; onUpload: (f: File) => void; onClear: () => void }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--muted-foreground)]">{label}</div>
      <div className="flex items-center gap-4">
        <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-xl border border-dashed border-[color:var(--border)] bg-[color:var(--muted)]">
          {url ? <img src={url} alt={label} className="h-full w-full object-cover" /> : <Upload className="h-5 w-5 text-[color:var(--muted-foreground)]" />}
        </div>
        <div className="flex flex-col gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-xs font-semibold hover:bg-[color:var(--muted)]">
            <Upload className="h-3.5 w-3.5" /> Enviar
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
          </label>
          {url && <button type="button" onClick={onClear} className="text-xs text-red-600 hover:underline">Remover</button>}
        </div>
      </div>
    </div>
  );
}
