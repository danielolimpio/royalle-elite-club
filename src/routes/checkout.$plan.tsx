import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Crown, Lock, CreditCard, QrCode, FileText, Check, ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/checkout/$plan")({
  head: () => ({ meta: [{ title: "Checkout — Royalle Club" }] }),
  component: CheckoutPage,
});

type Form = {
  nome: string; cpf: string; email: string; emailConfirm: string;
  senha: string; senhaConfirm: string; whatsapp: string; metodo: "credit" | "pix" | "boleto";
};

function CheckoutPage() {
  const { plan } = useParams({ from: "/checkout/$plan" });
  const navigate = useNavigate();
  const [f, setF] = useState<Form>({
    nome: "", cpf: "", email: "", emailConfirm: "", senha: "", senhaConfirm: "", whatsapp: "", metodo: "credit",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (f.email !== f.emailConfirm) return setError("Os e-mails não coincidem.");
    if (f.senha !== f.senhaConfirm) return setError("As senhas não coincidem.");
    if (f.senha.length < 6) return setError("A senha deve ter ao menos 6 caracteres.");
    setLoading(true);
    setTimeout(() => { navigate({ to: "/login" }); }, 1400);
  }

  const field = (label: string, key: keyof Form, type = "text", placeholder = "") => (
    <div>
      <label className="text-[0.65rem] uppercase tracking-[0.3em] text-[color:var(--gold-deep)]">{label}</label>
      <input
        required type={type} value={f[key] as string} onChange={set(key)} placeholder={placeholder}
        className="mt-2 h-12 w-full border border-[color:var(--border)] bg-white px-4 text-sm text-[color:var(--midnight)] outline-none focus:border-[color:var(--gold)]"
      />
    </div>
  );

  return (
    <SiteShell>
      <section className="border-b border-[color:var(--border)] bg-[color:var(--midnight)] py-12 text-[color:var(--ivory)]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="ornament" style={{ color: "var(--gold)" }}>Checkout Seguro · {plan}</div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Finalizar adesão Royalle</h1>
        </div>
      </section>
      <section className="py-16">
        <form onSubmit={submit} className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-10">
            <div className="border border-[color:var(--border)] bg-white p-8 shadow-soft">
              <div className="ornament mb-6" style={{ color: "var(--gold-deep)" }}>1 · Dados pessoais</div>
              <div className="grid gap-5 md:grid-cols-2">
                {field("Nome completo", "nome", "text", "Como aparece no documento")}
                {field("CPF", "cpf", "text", "000.000.000-00")}
                {field("E-mail", "email", "email", "voce@royalle.club")}
                {field("Confirme o e-mail", "emailConfirm", "email", "voce@royalle.club")}
                {field("Senha", "senha", "password", "Mínimo 6 caracteres")}
                {field("Confirme a senha", "senhaConfirm", "password", "Repita a senha")}
                <div className="md:col-span-2">{field("WhatsApp", "whatsapp", "tel", "(11) 9 0000-0000")}</div>
              </div>
            </div>
            <div className="border border-[color:var(--border)] bg-white p-8 shadow-soft">
              <div className="ornament mb-6" style={{ color: "var(--gold-deep)" }}>2 · Forma de pagamento</div>
              <div className="grid gap-3 md:grid-cols-3">
                {([
                  { id: "credit", label: "Cartão", Icon: CreditCard },
                  { id: "pix", label: "Pix", Icon: QrCode },
                  { id: "boleto", label: "Boleto", Icon: FileText },
                ] as const).map((m) => {
                  const active = f.metodo === m.id;
                  return (
                    <button type="button" key={m.id} onClick={() => setF({ ...f, metodo: m.id })}
                      className={`flex items-center justify-between border p-5 text-left transition ${active ? "border-[color:var(--gold)] bg-[color:var(--midnight)] text-[color:var(--gold)]" : "border-[color:var(--border)] bg-white text-[color:var(--midnight)] hover:border-[color:var(--gold)]"}`}>
                      <span className="flex items-center gap-3">
                        <m.Icon className="h-5 w-5" />
                        <span className="font-display text-lg">{m.label}</span>
                      </span>
                      {active && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
              {f.metodo === "credit" && (
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-[0.65rem] uppercase tracking-[0.3em] text-[color:var(--gold-deep)]">Número do cartão</label>
                    <input className="mt-2 h-12 w-full border border-[color:var(--border)] bg-white px-4 text-sm outline-none focus:border-[color:var(--gold)]" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div>
                    <label className="text-[0.65rem] uppercase tracking-[0.3em] text-[color:var(--gold-deep)]">Nome no cartão</label>
                    <input className="mt-2 h-12 w-full border border-[color:var(--border)] bg-white px-4 text-sm outline-none focus:border-[color:var(--gold)]" />
                  </div>
                  <div>
                    <label className="text-[0.65rem] uppercase tracking-[0.3em] text-[color:var(--gold-deep)]">Validade</label>
                    <input className="mt-2 h-12 w-full border border-[color:var(--border)] bg-white px-4 text-sm outline-none focus:border-[color:var(--gold)]" placeholder="MM/AA" />
                  </div>
                  <div>
                    <label className="text-[0.65rem] uppercase tracking-[0.3em] text-[color:var(--gold-deep)]">CVV</label>
                    <input className="mt-2 h-12 w-full border border-[color:var(--border)] bg-white px-4 text-sm outline-none focus:border-[color:var(--gold)]" placeholder="123" />
                  </div>
                </div>
              )}
              {f.metodo === "pix" && (
                <p className="mt-6 text-sm text-[color:var(--muted-foreground)]">Você verá o QR Code Pix na próxima etapa. Pagamento aprovado em segundos.</p>
              )}
              {f.metodo === "boleto" && (
                <p className="mt-6 text-sm text-[color:var(--muted-foreground)]">O boleto será emitido em seu nome e tem compensação em até 2 dias úteis.</p>
              )}
            </div>
            {error && <div className="border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          </div>
          <aside className="space-y-6">
            <div className="relative overflow-hidden border border-[color:var(--gold)]/50 bg-[color:var(--midnight)] p-8 text-[color:var(--ivory)] shadow-luxe">
              <Crown className="absolute -right-6 -top-6 h-32 w-32 text-[color:var(--gold)]/10" />
              <div className="ornament" style={{ color: "var(--gold)" }}>Resumo do plano</div>
              <h3 className="mt-3 font-display text-3xl">Royalle Individual</h3>
              <p className="mt-2 text-sm text-[color:var(--ivory)]/70">Acesso completo ao clube — pagamento único.</p>
              <div className="my-8 border-y border-[color:var(--gold)]/30 py-6">
                <div className="flex items-end justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-[color:var(--ivory)]/60">Total</span>
                  <div>
                    <span className="text-lg text-[color:var(--gold)]">R$</span>{" "}
                    <span className="font-display text-5xl text-[color:var(--gold)]">9,90</span>
                  </div>
                </div>
              </div>
              <button type="submit" disabled={loading} className="inline-flex h-14 w-full items-center justify-center gap-2 bg-[color:var(--gold)] text-xs uppercase tracking-[0.3em] text-[color:var(--midnight)] transition hover:bg-[color:var(--ivory)] disabled:opacity-60">
                {loading ? "Processando..." : <>Pagar agora <ArrowRight className="h-4 w-4" /></>}
              </button>
              <div className="mt-5 flex items-center justify-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-[color:var(--ivory)]/60">
                <Lock className="h-3 w-3 text-[color:var(--gold)]" /> Ambiente 100% seguro
              </div>
            </div>
            <ul className="space-y-3 text-sm text-[color:var(--midnight)]">
              {["Acesso vitalício ao clube","Cashback em todas as categorias","Ofertas relâmpago exclusivas","Suporte concierge digital"].map((p) => (
                <li key={p} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 text-[color:var(--gold-deep)]" /> {p}</li>
              ))}
            </ul>
          </aside>
        </form>
      </section>
    </SiteShell>
  );
}