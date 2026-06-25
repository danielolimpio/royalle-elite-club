import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Sparkles, Crown, ArrowRight, Star, ShieldCheck, Headphones } from "lucide-react";
import { SiteShell } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos — Royalle Club" },
      { name: "description", content: "Conheça os planos individuais e White Label do Royalle Club. Acesso completo a centenas de benefícios a partir de R$ 9,90/mês." },
    ],
  }),
  component: PlanosPage,
});

type Plan = {
  id: string;
  name: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
  cta: string;
  href: string;
  type: "individual" | "white_label";
};

const individual: Plan = {
  id: "individual",
  name: "Royalle Individual",
  price: "R$ 9,90",
  unit: "/mês",
  description: "Para quem quer aproveitar todos os benefícios do clube com acesso imediato.",
  features: [
    "Acesso a +500 marcas parceiras",
    "Cupons e cashback em todas as categorias",
    "Ofertas relâmpago exclusivas",
    "Dashboard personalizada",
    "Suporte por WhatsApp",
  ],
  cta: "Assinar agora",
  href: "/checkout/individual",
  type: "individual",
  badge: "MAIS POPULAR",
  highlight: true,
};

const whiteLabel: Plan[] = [
  {
    id: "inicial",
    name: "Plano Inicial",
    price: "R$ 1.370",
    unit: "/mês",
    description: "Para começar com um clube completo e já rodando.",
    features: [
      "Até 1.000 beneficiários",
      "Clube com sua marca",
      "+300 parcerias nacionais",
      "Adicione suas próprias parcerias",
      "Campanhas padronizadas",
      "Validação de usuários",
    ],
    cta: "Quero esse plano",
    href: "/checkout/inicial",
    type: "white_label",
  },
  {
    id: "padrao",
    name: "Plano Padrão",
    price: "R$ 2.270",
    unit: "/mês",
    description: "Para acelerar a adoção, ampliar ativações e conteúdo.",
    features: [
      "Até 3.000 beneficiários",
      "Domínio próprio",
      "Campanhas personalizadas",
      "Conteúdos gratuitos",
      "Calendário de sorteios",
      "Jogos e ativações premiadas",
    ],
    cta: "Quero esse plano",
    href: "/checkout/padrao",
    type: "white_label",
  },
  {
    id: "avancado",
    name: "Plano Avançado",
    price: "R$ 3.670",
    unit: "/mês",
    description: "Para escalar e integrar com mais autonomia e canais.",
    features: [
      "Até 10.000 beneficiários",
      "Aplicativo dedicado",
      "Integração de sistemas",
      "Validação via Token ou API",
      "Disparo de e-mail marketing",
      "Autonomia para envios de push",
    ],
    cta: "Quero esse plano",
    href: "/checkout/avancado",
    type: "white_label",
    badge: "RECOMENDADO",
    highlight: true,
  },
  {
    id: "pro",
    name: "Plano Pro",
    price: "Sob consulta",
    unit: "",
    description: "Para quem quer ir além em volume, personalização e integrações.",
    features: [
      "Mais beneficiários",
      "Cartão-presente personalizado",
      "Sorteios e bolsões exclusivos",
      "Prospecção dedicada",
      "Integrações sob medida",
      "Estratégias de comunicação",
    ],
    cta: "Falar com vendas",
    href: "/checkout/pro",
    type: "white_label",
  },
];

function PlanosPage() {
  const navigate = useNavigate();
  return (
    <SiteShell>
      {/* HERO Awin-style */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[color:var(--midnight)] via-[color:var(--midnight-2)] to-[color:var(--accent)] text-white">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.4em] text-white/80">Preços e planos</div>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
            Sua jornada de parceria <span className="text-[color:var(--gold)]">começa hoje</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-white/85">
            Escolha entre o plano individual a partir de R$ 9,90/mês ou monte um Clube de Benefícios White Label completo para sua empresa.
          </p>
        </div>
      </section>

      {/* INDIVIDUAL */}
      <section className="bg-[color:var(--background)] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.4em] text-[color:var(--accent)]">Plano individual</div>
            <h2 className="mt-2 font-display text-3xl text-[color:var(--midnight)] md:text-4xl">
              Acesso completo a todos os benefícios
            </h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-md gap-4">
            <PlanCard plan={individual} onSelect={() => navigate({ to: individual.href })} />
          </div>
        </div>
      </section>

      {/* WHITE LABEL */}
      <section className="bg-gradient-to-b from-[color:var(--muted)]/50 to-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.4em] text-[color:var(--primary)]">Planos para empresas — White Label</div>
            <h2 className="mt-2 font-display text-3xl text-[color:var(--midnight)] md:text-4xl">
              Negócios diferentes, <span className="text-[color:var(--accent)]">caminhos de crescimento diferentes</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[color:var(--muted-foreground)]">
              Escolha o plano ideal para você e comece a oferecer um Clube de Benefícios com a sua marca.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {whiteLabel.map((p) => (
              <PlanCard key={p.id} plan={p} onSelect={() => navigate({ to: p.href })} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { Icon: ShieldCheck, title: "Pagamento seguro", text: "Ambiente protegido por criptografia SSL e antifraude." },
              { Icon: Headphones, title: "Suporte humano", text: "Equipe especializada para tirar dúvidas e ativar seu clube." },
              { Icon: Star, title: "+500 marcas parceiras", text: "Cashback, cupons e descontos exclusivos em todo o Brasil." },
            ].map((t) => (
              <div key={t.title} className="rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
                  <t.Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg text-[color:var(--midnight)]">{t.title}</h3>
                <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banda */}
      <section className="bg-gradient-to-r from-[color:var(--midnight)] to-[color:var(--accent)] py-14 text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-6 text-center">
          <Sparkles className="h-8 w-8 text-[color:var(--gold)]" />
          <h3 className="font-display text-3xl md:text-4xl">Ainda em dúvida sobre qual plano escolher?</h3>
          <p className="max-w-xl text-white/85">Nosso time monta uma proposta personalizada para o seu público e objetivo.</p>
          <Link to="/checkout/individual" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold uppercase tracking-wide text-[color:var(--midnight)] hover:scale-[1.02] transition">
            Começar agora <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}

function PlanCard({ plan, onSelect }: { plan: Plan; onSelect: () => void }) {
  const highlight = plan.highlight;
  return (
    <div className={`relative flex flex-col rounded-3xl border p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
      highlight
        ? "border-transparent bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--midnight)] text-white shadow-2xl"
        : "border-[color:var(--border)] bg-white text-[color:var(--midnight)]"
    }`}>
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[color:var(--accent)] px-4 py-1 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white shadow">
          <Crown className="mr-1 inline h-3 w-3" /> {plan.badge}
        </div>
      )}
      <h3 className={`font-display text-xl ${highlight ? "text-white" : "text-[color:var(--midnight)]"}`}>{plan.name}</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className={`font-display text-4xl font-bold ${highlight ? "text-[color:var(--gold)]" : "text-[color:var(--accent)]"}`}>{plan.price}</span>
        {plan.unit && <span className={`text-sm ${highlight ? "text-white/70" : "text-[color:var(--muted-foreground)]"}`}>{plan.unit}</span>}
      </div>
      <p className={`mt-3 text-sm ${highlight ? "text-white/85" : "text-[color:var(--muted-foreground)]"}`}>{plan.description}</p>
      <ul className="mt-6 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${highlight ? "text-[color:var(--gold)]" : "text-[color:var(--accent)]"}`} />
            <span className={highlight ? "text-white/90" : "text-[color:var(--midnight)]/85"}>{f}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onSelect}
        className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold uppercase tracking-wide transition ${
          highlight
            ? "bg-[color:var(--gold)] text-[color:var(--midnight)] hover:bg-white"
            : "bg-[color:var(--accent)] text-white hover:bg-[color:var(--gold-deep)]"
        }`}
      >
        {plan.cta} <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}