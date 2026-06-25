import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteLayout";
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Users,
  Zap,
  Sparkles,
  Layers,
  Smartphone,
  BarChart3,
  Lock,
  Globe,
  Repeat,
  Heart,
  Cpu,
  Palette,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";

import hero from "@/assets/wl/gtm-heroimage-newsroom.jfif.asset.json";
import advertiser from "@/assets/wl/advertiser-lr-1.png.asset.json";
import careers from "@/assets/wl/careers-openroles.jpg.asset.json";
import chart1 from "@/assets/wl/3.jpg.asset.json";
import chart2 from "@/assets/wl/7.jpg.asset.json";
import iconChart from "@/assets/wl/icon-chart-line-animation.gif.asset.json";
import iconCog from "@/assets/wl/icon-cog-animation.gif.asset.json";
import iconExt from "@/assets/wl/icon-extension-animation.gif.asset.json";
import iconHands from "@/assets/wl/icon-handshake.png.asset.json";
import iconRocket from "@/assets/wl/icon_rocket_animation.gif.asset.json";
import iconWebpage from "@/assets/wl/icon_webpage_animation.gif.asset.json";
import iconProfile from "@/assets/wl/icon_profile_animation.gif.asset.json";

export const Route = createFileRoute("/whitelabel")({
  head: () => ({
    meta: [
      { title: "White Label Royalle — Clube de Benefícios com a Sua Marca" },
      {
        name: "description",
        content:
          "Reduza cancelamentos em até 68% e aumente a receita recorrente com um clube de benefícios white label premium personalizado com a identidade da sua empresa.",
      },
    ],
  }),
  component: WhitelabelPage,
});

const ROUNDED = "rounded-[2rem] overflow-hidden shadow-[0_30px_80px_-30px_rgba(76,29,149,0.35)]";

function WhitelabelPage() {
  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0b3d] via-[#3b1078] to-[#6b21a8] text-white">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #f97316 0%, transparent 40%), radial-gradient(circle at 80% 80%, #a855f7 0%, transparent 50%)" }} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:py-32">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-orange-400" /> Plataforma White Label
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">
              Tenha o seu próprio <span className="bg-gradient-to-r from-orange-400 to-orange-200 bg-clip-text text-transparent">clube de benefícios</span> com a marca da sua empresa.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80">
              Reduza o churn, multiplique a fidelização e crie uma nova fonte de receita recorrente — em uma plataforma premium, segura e 100% personalizada com a identidade da sua marca.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/planos" className="group inline-flex items-center gap-2 rounded-full bg-orange-500 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_20px_50px_-15px_rgba(249,115,22,0.7)] transition hover:bg-orange-400">
                Ver planos White Label <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link to="/contato" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white backdrop-blur transition hover:bg-white/10">
                Falar com especialista
              </Link>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 text-center">
              {[
                { n: "-68%", l: "Cancelamentos" },
                { n: "+3.2x", l: "Receita recorrente" },
                { n: "92%", l: "Retenção em 12m" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl text-orange-300">{s.n}</div>
                  <div className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-white/60">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src={hero.url} alt="Equipe analisando dashboard White Label" className={ROUNDED + " w-full"} />
            <div className="absolute -bottom-8 -left-8 hidden rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl md:block">
              <div className="flex items-center gap-3">
                <img src={iconChart.url} alt="" className="h-12 w-12" />
                <div>
                  <div className="text-2xl font-bold text-orange-300">+47%</div>
                  <div className="text-xs uppercase tracking-wider text-white/70">LTV médio dos clientes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="border-y border-purple-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
          {[
            { n: "+1.200", l: "Marcas parceiras nacionais" },
            { n: "+850", l: "Cidades cobertas" },
            { n: "+9 mi", l: "Benefícios entregues/mês" },
            { n: "4.9/5", l: "NPS de clientes finais" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display text-4xl text-[#6b21a8]">{s.n}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RETENÇÃO */}
      <section className="bg-gradient-to-b from-white to-purple-50/60 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <div>
            <img src={chart1.url} alt="Resultados de fidelização com clube de benefícios" className={ROUNDED + " w-full"} />
          </div>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
              <Heart className="h-3.5 w-3.5" /> Fidelização ampliada
            </span>
            <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight text-[#1a0b3d] md:text-5xl">
              Seus clientes param de cancelar — porque param de querer sair.
            </h2>
            <p className="mt-5 text-lg text-slate-600">
              Internet, plano de saúde, plano funerário, academia, software, telefonia. Quando o seu serviço passa a entregar <strong>centenas de benefícios reais</strong> com a sua marca, o cliente percebe um valor muito maior do que paga — e a decisão de cancelar simplesmente desaparece.
            </p>
            <div className="mt-8 space-y-4">
              {[
                ["Redução média de churn de 42% a 68%", "em empresas que adotam clube de benefícios nos primeiros 90 dias."],
                ["NPS sobe em média +24 pontos", "porque o cliente passa a associar a marca a economia real no dia a dia."],
                ["LTV cresce 2.8x a 3.5x", "estendendo o ciclo de vida do contrato e multiplicando o ARPU."],
              ].map(([t, d]) => (
                <div key={t} className="flex gap-4">
                  <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-orange-500" />
                  <div>
                    <div className="font-semibold text-[#1a0b3d]">{t}</div>
                    <div className="text-sm text-slate-600">{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RECEITA RECORRENTE */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <div className="lg:order-2">
            <img src={chart2.url} alt="Crescimento de receita recorrente" className={ROUNDED + " w-full"} />
          </div>
          <div className="lg:order-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-purple-700">
              <TrendingUp className="h-3.5 w-3.5" /> Nova receita recorrente
            </span>
            <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight text-[#1a0b3d] md:text-5xl">
              Transforme fidelização em <span className="text-orange-500">receita previsível</span>.
            </h2>
            <p className="mt-5 text-lg text-slate-600">
              Além de reter, o clube White Label se torna um novo produto da sua empresa — cobrado mensalmente, com margens acima de 70% e crescimento composto mês a mês.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {[
                { i: BarChart3, t: "MRR adicional", d: "Receita mensal recorrente do próprio clube." },
                { i: Repeat, t: "Upsell natural", d: "Planos premium, family, corporate." },
                { i: Users, t: "Aquisição viral", d: "Indicação entre membros reduz CAC." },
                { i: Zap, t: "Take rate", d: "Comissão sobre transações dentro do clube." },
              ].map(({ i: Icon, t, d }) => (
                <div key={t} className="rounded-2xl border border-purple-100 bg-purple-50/40 p-5">
                  <Icon className="h-6 w-6 text-orange-500" />
                  <div className="mt-3 font-semibold text-[#1a0b3d]">{t}</div>
                  <div className="mt-1 text-sm text-slate-600">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS DE BENEFÍCIOS */}
      <section className="bg-gradient-to-br from-[#1a0b3d] to-[#4c1d95] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em]">
              <Sparkles className="h-3.5 w-3.5 text-orange-400" /> Benefícios que encantam
            </span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              Da conta de luz ao streaming — economia real em tudo.
            </h2>
            <p className="mt-4 text-lg text-white/70">
              Os membros do seu clube acessam descontos exclusivos em mais de 12 categorias essenciais — incluindo o programa Royalle Energia, que reduz até 20% da conta de luz no mercado livre.
            </p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3 lg:grid-cols-4">
            {[
              { t: "Conta de energia", d: "Até 20% off na fatura via mercado livre regulamentado." },
              { t: "Farmácia & Saúde", d: "Até 70% em medicamentos e exames." },
              { t: "Supermercado", d: "Cashback recorrente nas maiores redes." },
              { t: "Combustível", d: "Centavos por litro em postos parceiros nacionais." },
              { t: "Educação", d: "Bolsas de até 80% em cursos e graduação." },
              { t: "Streaming & Apps", d: "Netflix, Prime, Disney+, GPT, Canva." },
              { t: "Viagens", d: "Hotéis, passagens e pacotes com preço de afiliado." },
              { t: "Moda & Beleza", d: "Marcas premium com cupons exclusivos." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-orange-400/60 hover:bg-white/10">
                <div className="font-display text-xl text-orange-300">{c.t}</div>
                <div className="mt-2 text-sm text-white/70">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECNOLOGIA */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <img src={advertiser.url} alt="Cliente usando o app White Label" className={ROUNDED + " w-full"} />
            </div>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
                <Cpu className="h-3.5 w-3.5" /> Tecnologia de ponta
              </span>
              <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight text-[#1a0b3d] md:text-5xl">
                Uma plataforma robusta, segura e pronta para escalar.
              </h2>
              <p className="mt-5 text-lg text-slate-600">
                Toda a infraestrutura tecnológica é desenvolvida em arquitetura cloud-native, com SLA 99.9%, criptografia ponta-a-ponta e conformidade total com a LGPD. Sua marca, sua experiência — nossa engenharia.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { i: Layers, t: "Arquitetura serverless", d: "Escala automática para milhões de usuários." },
                  { i: Lock, t: "Criptografia AES-256", d: "Dados protegidos em trânsito e em repouso." },
                  { i: ShieldCheck, t: "Compliance LGPD", d: "Auditorias e relatórios automáticos." },
                  { i: Smartphone, t: "Apps iOS + Android", d: "Publicados nas lojas com a sua marca." },
                  { i: Palette, t: "Branding total", d: "Cores, fontes, logo, domínio próprio." },
                  { i: Globe, t: "API & integrações", d: "CRM, ERP, billing e SSO nativo." },
                ].map(({ i: Icon, t, d }) => (
                  <div key={t} className="flex gap-3 rounded-xl border border-purple-100 p-4">
                    <Icon className="h-6 w-6 shrink-0 text-purple-700" />
                    <div>
                      <div className="font-semibold text-[#1a0b3d]">{t}</div>
                      <div className="text-xs text-slate-600">{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUPER VANTAGENS */}
      <section className="bg-gradient-to-b from-purple-50/60 to-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-4xl tracking-tight text-[#1a0b3d] md:text-5xl">
              Super vantagens de ter o clube com a sua marca
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Tudo o que você precisa para transformar o relacionamento com seus clientes em um ativo estratégico de longo prazo.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: iconProfile.url, t: "Marca em primeiro lugar", d: "App, web e comunicação com a sua identidade — não a nossa. Seus clientes nunca veem Royalle." },
              { icon: iconWebpage.url, t: "Dashboard analítico completo", d: "Acompanhe engajamento, economia gerada, NPS e LTV em tempo real." },
              { icon: iconCog.url, t: "Operação chave-na-mão", d: "Curadoria de parceiros, suporte ao usuário final e atualizações constantes por nossa conta." },
              { icon: iconExt.url, t: "Integrações nativas", d: "Conecte com o seu billing, CRM e canais de atendimento via API REST e webhooks." },
              { icon: iconRocket.url, t: "Onboarding em 7 dias", d: "Do contrato ao lançamento. Equipe dedicada para configurar marca, planos e fluxo de assinatura." },
              { icon: iconChart.url, t: "Crescimento garantido", d: "Casos reais mostram ROI positivo já no terceiro mês de operação do clube." },
            ].map((v) => (
              <div key={v.t} className="group rounded-3xl border border-purple-100 bg-white p-7 shadow-[0_10px_40px_-20px_rgba(76,29,149,0.25)] transition hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(76,29,149,0.4)]">
                <img src={v.icon} alt="" className="h-14 w-14" />
                <div className="mt-5 font-display text-xl text-[#1a0b3d]">{v.t}</div>
                <div className="mt-2 text-sm text-slate-600">{v.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CASOS DE USO */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-purple-700">
              <Lightbulb className="h-3.5 w-3.5" /> Para todos os setores
            </span>
            <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight text-[#1a0b3d] md:text-5xl">
              Funciona para o seu negócio.
            </h2>
            <p className="mt-5 text-lg text-slate-600">
              Provedores de internet, operadoras de saúde, planos funerários, academias, escolas, cooperativas, SaaS, varejistas, sindicatos e associações já transformaram retenção com o nosso White Label.
            </p>
            <ul className="mt-8 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
              {[
                "Provedores de Internet (ISP)",
                "Planos de Saúde e Odontológicos",
                "Planos Funerários",
                "Cooperativas e Sindicatos",
                "Academias e Wellness",
                "Escolas e Universidades",
                "Bancos e Fintechs",
                "Empresas SaaS",
                "Varejo e E-commerce",
                "Concessionárias e Automotivo",
              ].map((u) => (
                <li key={u} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-orange-500" /> {u}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <img src={careers.url} alt="Equipe celebrando resultados" className={ROUNDED + " w-full"} />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0b3d] via-[#4c1d95] to-[#6b21a8] py-24 text-white">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, #f97316 0%, transparent 35%), radial-gradient(circle at 70% 70%, #a855f7 0%, transparent 45%)" }} />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-5xl leading-tight md:text-6xl">
            Pronto para lançar o clube de benefícios da <span className="bg-gradient-to-r from-orange-400 to-orange-200 bg-clip-text text-transparent">sua marca?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            Escolha o plano White Label ideal para a sua operação e tenha o seu clube no ar em até 7 dias. Sem investimento inicial em desenvolvimento.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/planos" className="group inline-flex items-center gap-2 rounded-full bg-orange-500 px-10 py-5 text-base font-bold uppercase tracking-[0.18em] text-white shadow-[0_20px_60px_-15px_rgba(249,115,22,0.8)] transition hover:bg-orange-400">
              Ver Planos White Label <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </Link>
            <Link to="/contato" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-10 py-5 text-base font-semibold uppercase tracking-[0.18em] backdrop-blur transition hover:bg-white/10">
              Falar com consultor
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}