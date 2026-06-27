import { createFileRoute, redirect } from "@tanstack/react-router";
import { Check, Crown, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/cadastro")({
  beforeLoad: () => {
    throw redirect({ to: "/checkout/$plan", params: { plan: "individual" } });
  },
  head: () => ({ meta: [{ title: "Planos — Royalle Club" }, { name: "description", content: "Escolha o seu plano Royalle." }] }),
  component: PlansPage,
});

const PLANS = [
  {
    id: "individual",
    name: "Royalle Individual",
    eyebrow: "Mais escolhido",
    price: "9,90",
    desc: "Acesso completo ao clube de benefícios com cashback e ofertas privê.",
    perks: [
      "Benefícios em mais de 1.500 marcas",
      "Cashback Royalle em todas as categorias",
      "Ofertas relâmpago exclusivas",
      "Carta da Corte semanal",
      "Suporte concierge digital",
    ],
    highlight: true,
  },
  {
    id: "empresarial",
    name: "Royalle Empresarial",
    eyebrow: "Para times",
    price: "Sob consulta",
    desc: "Programa de benefícios whitelabel para colaboradores da sua empresa.",
    perks: [
      "Painel administrativo dedicado",
      "Benefícios negociados para o seu time",
      "Whitelabel com sua marca",
      "Relatórios de engajamento",
      "Gerente de contas exclusivo",
    ],
    highlight: false,
  },
];

function PlansPage() {
  return (
    <SiteShell>
      <section className="bg-[color:var(--midnight)] py-20 text-[color:var(--ivory)]">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="ornament justify-center" style={{ color: "var(--gold)" }}>Royalle Privé</div>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">Escolha o seu plano</h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-[color:var(--ivory)]/70 md:text-base">
            Acesso vitalício ao clube de benefícios mais sofisticado do Brasil — sem mensalidades surpresas.
          </p>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-2">
          {PLANS.map((p) => (
            <div key={p.id} className={`relative flex flex-col border ${p.highlight ? "border-[color:var(--gold)] shadow-luxe" : "border-[color:var(--border)] shadow-soft"} bg-white p-10`}>
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[color:var(--gold)] px-4 py-1 text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--midnight)]">
                  {p.eyebrow}
                </span>
              )}
              <div className="ornament" style={{ color: "var(--gold-deep)" }}>{p.eyebrow}</div>
              <h2 className="mt-4 font-display text-3xl text-[color:var(--midnight)]">{p.name}</h2>
              <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">{p.desc}</p>
              <div className="mt-6 flex items-baseline gap-2">
                {p.id === "individual" ? (
                  <>
                    <span className="text-2xl text-[color:var(--midnight)]">R$</span>
                    <span className="font-display text-6xl text-[color:var(--midnight)]">{p.price}</span>
                    <span className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted-foreground)]">/ único</span>
                  </>
                ) : (
                  <span className="font-display text-4xl text-[color:var(--midnight)]">{p.price}</span>
                )}
              </div>
              <ul className="mt-8 space-y-3 text-sm text-[color:var(--midnight)]">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold-deep)]" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={p.id === "individual" ? "/checkout/$plan" : "/contato"}
                params={p.id === "individual" ? { plan: "individual" } : undefined}
                className={`mt-10 inline-flex h-12 items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] transition ${p.highlight ? "bg-[color:var(--midnight)] text-[color:var(--gold)] hover:bg-[color:var(--midnight-2)]" : "border border-[color:var(--midnight)] text-[color:var(--midnight)] hover:bg-[color:var(--midnight)] hover:text-[color:var(--gold)]"}`}
              >
                {p.id === "individual" ? <><Sparkles className="h-4 w-4" /> Assinar agora</> : <><Crown className="h-4 w-4" /> Falar com consultor</>}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}