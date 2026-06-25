import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { Crown, Mail, Lock, ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({ from: typeof s.from === "string" ? s.from : undefined }),
  head: () => ({ meta: [{ title: "Entrar — Royalle Club" }, { name: "description", content: "Acesse sua conta Royalle." }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { from } = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pwd });
    if (error) { setLoading(false); toast.error(error.message); return; }
    let isAdmin = false;
    if (data.user) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      isAdmin = !!roles;
    }
    setLoading(false);
    navigate({ to: isAdmin || from === "admin" ? "/admin" : "/dashboard" });
  }
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-[color:var(--midnight)] py-20 text-[color:var(--ivory)]">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,var(--gold)_1px,transparent_0)] [background-size:32px_32px]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="ornament" style={{ color: "var(--gold)" }}>Acesso da Corte</div>
            <h1 className="mt-4 font-display text-5xl leading-tight md:text-6xl">Bem-vindo de volta ao Royalle.</h1>
            <p className="mt-6 max-w-md text-sm text-[color:var(--ivory)]/70 md:text-base">
              Entre para descobrir benefícios exclusivos, cashback e experiências curadas para membros.
            </p>
            <div className="mt-10 flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-[color:var(--gold)]/80">
              <Crown className="h-5 w-5" /> Royalle Privé · {from ? "continuar onde parou" : "membros do clube"}
            </div>
          </div>
          <div className="rounded-sm border border-[color:var(--gold)]/30 bg-[color:var(--ivory)] p-10 shadow-luxe">
            <form onSubmit={submit} className="space-y-5 text-[color:var(--midnight)]">
              <div>
                <label className="text-[0.65rem] uppercase tracking-[0.3em] text-[color:var(--gold-deep)]">E-mail</label>
                <div className="relative mt-2">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-foreground)]" />
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@royalle.club" className="h-12 w-full border border-[color:var(--border)] bg-white pl-11 pr-4 text-sm outline-none focus:border-[color:var(--gold)]" />
                </div>
              </div>
              <div>
                <label className="text-[0.65rem] uppercase tracking-[0.3em] text-[color:var(--gold-deep)]">Senha</label>
                <div className="relative mt-2">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-foreground)]" />
                  <input required type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="••••••••" className="h-12 w-full border border-[color:var(--border)] bg-white pl-11 pr-4 text-sm outline-none focus:border-[color:var(--gold)]" />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <label className="inline-flex items-center gap-2 text-[color:var(--muted-foreground)]">
                  <input type="checkbox" className="accent-[color:var(--gold)]" /> Lembrar de mim
                </label>
                <a href="#" className="uppercase tracking-[0.25em] text-[color:var(--gold-deep)]">Esqueci minha senha</a>
              </div>
              <button type="submit" disabled={loading} className="inline-flex h-12 w-full items-center justify-center gap-2 bg-[color:var(--midnight)] text-xs uppercase tracking-[0.3em] text-[color:var(--gold)] transition hover:bg-[color:var(--midnight-2)] disabled:opacity-60">
                {loading ? "Entrando…" : "Entrar"} <ArrowRight className="h-4 w-4" />
              </button>
              <div className="text-center text-sm text-[color:var(--muted-foreground)]">
                Ainda não é membro?{" "}
                <Link to="/cadastro" className="font-semibold text-[color:var(--midnight)] underline decoration-[color:var(--gold)] underline-offset-4">
                  Cadastre-se
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}