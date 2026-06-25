import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteLayout";
import {
  ArrowRight,
  ShieldCheck,
  Eye,
  Target,
  Heart,
  Sparkles,
  Code2,
  Cpu,
  Megaphone,
  TrendingUp,
  Users,
  Globe,
  Lock,
  Zap,
  CheckCircle2,
  Award as AwardIcon,
} from "lucide-react";

import heroImg from "@/assets/sobre/about-hero.webp.asset.json";
import teamImg from "@/assets/sobre/about-team.jpg.asset.json";
import iconAward from "@/assets/sobre/award.png.asset.json";
import iconCertified from "@/assets/sobre/certified.png.asset.json";
import iconStar from "@/assets/sobre/star.png.asset.json";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre o Royalle — Clube de Benefícios Premium" },
      {
        name: "description",
        content:
          "Conheça o Royalle: mais de 20 anos de expertise em marketing, tecnologia robusta e um clube de benefícios premium construído com transparência, responsabilidade e inovação.",
      },
      { property: "og:title", content: "Sobre o Royalle Club" },
      {
        property: "og:description",
        content:
          "Quem somos, nossa missão, visão, valores e a expertise que sustenta o clube de benefícios mais sofisticado do Brasil.",
      },
      { property: "og:image", content: heroImg.url },
    ],
  }),
  component: SobrePage,
});

const ROUNDED =
  "rounded-[2rem] overflow-hidden shadow-[0_30px_80px_-30px_rgba(76,29,149,0.35)]";

function SobrePage() {
  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0b3d] via-[#3b1078] to-[#6b21a8] text-white">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #f97316 0%, transparent 40%), radial-gradient(circle at 80% 80%, #a855f7 0%, transparent 50%)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Sobre o Royalle
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight lg:text-6xl">
              Tecnologia, marketing e cuidado
              <span className="block bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
                a serviço de quem economiza.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80">
              Somos uma empresa brasileira movida por transparência,
              responsabilidade e inovação. Unimos mais de duas décadas de
              expertise em marketing com engenharia de software de ponta para
              entregar o clube de benefícios mais premium do país.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/planos"
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-orange-500/40 transition hover:bg-orange-600"
              >
                Conhecer os planos <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/whitelabel"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Solução White Label
              </Link>
            </div>
          </div>
          <div className={ROUNDED}>
            <img
              src={heroImg.url}
              alt="Royalle — pessoas e tecnologia"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 lg:grid-cols-4">
          {[
            { v: "20+", l: "Anos de expertise em marketing" },
            { v: "1.500+", l: "Marcas parceiras conectadas" },
            { v: "98%", l: "Satisfação dos assinantes" },
            { v: "24/7", l: "Suporte e monitoramento" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6 text-center"
            >
              <div className="bg-gradient-to-r from-[#6b21a8] to-orange-500 bg-clip-text text-4xl font-bold text-transparent">
                {s.v}
              </div>
              <p className="mt-2 text-sm text-gray-600">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QUEM SOMOS */}
      <section className="bg-gradient-to-b from-white to-purple-50/40 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
          <div className={ROUNDED}>
            <img
              src={teamImg.url}
              alt="Time Royalle"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              Quem somos
            </span>
            <h2 className="mt-3 text-3xl font-bold text-[#1a0b3d] lg:text-4xl">
              Um clube construído por especialistas, para pessoas reais.
            </h2>
            <p className="mt-5 text-lg text-gray-700">
              O Royalle nasceu da união entre profissionais com mais de 20 anos
              de estrada em marketing de performance, branding e fidelização, e
              um time de engenharia de software focado em escalabilidade,
              segurança e experiência premium.
            </p>
            <p className="mt-4 text-gray-600">
              Acreditamos que economizar pode ser sofisticado — e que cada
              parceria precisa ser construída com responsabilidade, ética e
              entrega de valor real para o assinante.
            </p>
            <ul className="mt-6 space-y-3 text-gray-700">
              {[
                "Operação transparente e auditável",
                "Compliance com LGPD e padrões internacionais",
                "Curadoria criteriosa de marcas parceiras",
                "Tecnologia proprietária e infraestrutura própria",
              ].map((i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* MVV */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              Nossa essência
            </span>
            <h2 className="mt-3 text-3xl font-bold text-[#1a0b3d] lg:text-4xl">
              Missão, visão e valores
            </h2>
            <p className="mt-4 text-gray-600">
              O que nos move todos os dias e orienta cada decisão dentro do
              Royalle.
            </p>
          </div>
          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Missão",
                text: "Democratizar o acesso a benefícios premium, gerando economia real e experiências memoráveis para milhões de brasileiros.",
                color: "from-orange-500 to-orange-600",
              },
              {
                icon: Eye,
                title: "Visão",
                text: "Ser o clube de benefícios mais admirado e tecnologicamente avançado da América Latina até 2030.",
                color: "from-[#6b21a8] to-[#3b1078]",
              },
              {
                icon: Heart,
                title: "Valores",
                text: "Transparência radical, obsessão pelo cliente, responsabilidade social, inovação contínua e excelência em cada detalhe.",
                color: "from-pink-500 to-orange-500",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="group relative overflow-hidden rounded-3xl border border-purple-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${c.color} text-white shadow-lg`}
                >
                  <c.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-[#1a0b3d]">
                  {c.title}
                </h3>
                <p className="mt-3 text-gray-600">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFÓLIO / EXPERTISE */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0b3d] to-[#3b1078] py-24 text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, #f97316 0%, transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">
              Portfólio & Expertise
            </span>
            <h2 className="mt-3 text-3xl font-bold lg:text-4xl">
              Mais de 20 anos transformando marcas em movimento
            </h2>
            <p className="mt-4 text-white/80">
              Nossa trajetória combina campanhas de alta performance,
              construção de marca e tecnologia robusta — uma rara combinação
              que poucos players do mercado conseguem entregar.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: Megaphone,
                title: "Marketing de Performance",
                text: "Mais de 2 décadas otimizando funis, mídia paga, CRM e fidelização para marcas líderes em diversos setores.",
              },
              {
                icon: TrendingUp,
                title: "Branding & Posicionamento",
                text: "Construção de marcas premium reconhecidas nacionalmente, com narrativa, identidade visual e tom de voz consistentes.",
              },
              {
                icon: Users,
                title: "Relacionamento & Fidelização",
                text: "Programas de retenção que reduzem churn em até 68% e elevam o LTV em mais de 3x.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-3xl border border-white/15 bg-white/5 p-7 backdrop-blur transition hover:bg-white/10"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 text-orange-300">
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold">{c.title}</h3>
                <p className="mt-2 text-sm text-white/75">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECNOLOGIA */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                Tecnologia robusta
              </span>
              <h2 className="mt-3 text-3xl font-bold text-[#1a0b3d] lg:text-4xl">
                Engenharia de software de classe mundial
              </h2>
              <p className="mt-5 text-gray-700">
                Nossa plataforma é construída com arquitetura moderna,
                infraestrutura escalável e protocolos de segurança bancários.
                Programação avançada, código limpo, monitoramento em tempo
                real e disponibilidade 99,9%.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Code2, t: "Stack moderna React + Edge" },
                  { icon: Cpu, t: "APIs escaláveis e performáticas" },
                  { icon: Lock, t: "Criptografia AES-256 + LGPD" },
                  { icon: Globe, t: "CDN global de baixa latência" },
                  { icon: Zap, t: "Apps iOS e Android nativos" },
                  { icon: ShieldCheck, t: "Auditoria contínua de segurança" },
                ].map((f) => (
                  <div
                    key={f.t}
                    className="flex items-start gap-3 rounded-2xl border border-purple-100 bg-purple-50/40 p-4"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6b21a8] to-orange-500 text-white">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {f.t}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              {[
                {
                  img: iconAward.url,
                  t: "Excelência reconhecida",
                  d: "Premiações e cases de sucesso em fidelização e marketing digital.",
                },
                {
                  img: iconCertified.url,
                  t: "Certificações de mercado",
                  d: "Compliance LGPD, ISO e padrões internacionais de segurança da informação.",
                },
                {
                  img: iconStar.url,
                  t: "Experiência premium",
                  d: "Cada detalhe pensado para entregar uma jornada surpreendente ao assinante.",
                },
              ].map((c) => (
                <div
                  key={c.t}
                  className="flex items-start gap-5 rounded-3xl border border-purple-100 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <img src={c.img} alt={c.t} className="h-16 w-16 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-[#1a0b3d]">{c.t}</h3>
                    <p className="mt-1 text-sm text-gray-600">{c.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RESPONSABILIDADE */}
      <section className="bg-purple-50/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              Empresa responsável
            </span>
            <h2 className="mt-3 text-3xl font-bold text-[#1a0b3d] lg:text-4xl">
              Transparência em cada passo
            </h2>
            <p className="mt-4 text-gray-600">
              Acreditamos que confiança se constrói com clareza. Por isso,
              operamos com regras públicas, contratos justos e canais abertos
              de comunicação com assinantes, parceiros e colaboradores.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, t: "Operação ética", d: "Políticas claras e auditáveis." },
              { icon: AwardIcon, t: "Curadoria premium", d: "Só entram marcas que cumprem nossos critérios." },
              { icon: Users, t: "Foco no assinante", d: "O usuário no centro de todas as decisões." },
              { icon: Heart, t: "Impacto social", d: "Apoio a iniciativas de educação e inclusão." },
            ].map((c) => (
              <div
                key={c.t}
                className="rounded-2xl border border-purple-100 bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#6b21a8] to-orange-500 text-white">
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-bold text-[#1a0b3d]">{c.t}</h3>
                <p className="mt-2 text-sm text-gray-600">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0b3d] via-[#3b1078] to-orange-600 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold lg:text-5xl">
            Pronto para fazer parte do Royalle?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/85">
            Mais de 1.500 marcas parceiras, economia real todos os dias e uma
            experiência premium em cada detalhe esperando por você.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/planos"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-[#1a0b3d] shadow-xl transition hover:bg-orange-50"
            >
              Ver planos <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/whitelabel"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Sou empresa
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}