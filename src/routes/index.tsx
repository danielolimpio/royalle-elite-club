import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Crown,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Filter,
  ArrowUpRight,
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteLayout";
import { slugify } from "@/lib/slug";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CATEGORIES as ROYALLE_CATEGORIES } from "@/lib/categories";
import { getMostAccessedFn, getRecentFn, getSpecialMomentsFn, listCompaniesFn } from "@/lib/companies.functions";

import hero from "@/assets/hero-royalle.jpg";
import banner1 from "@/assets/banner-1.jpg";
import banner2 from "@/assets/banner-2.jpg";
import banner3 from "@/assets/banner-3.jpg";
import feat1 from "@/assets/feat-1.jpg";
import feat2 from "@/assets/feat-2.jpg";
import feat3 from "@/assets/feat-3.jpg";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Royalle — Clube de Benefícios Premium" },
      {
        name: "description",
        content:
          "Royalle.club — clube de benefícios premium com experiências, descontos exclusivos e cashback selecionados para uma vida com mais luxo.",
      },
      { property: "og:title", content: "Royalle — Clube de Benefícios Premium" },
      {
        property: "og:description",
        content:
          "Acesso curado a marcas, viagens, gastronomia e bem-estar. Um clube de benefícios à altura de quem busca o melhor.",
      },
      { property: "og:image", content: hero },
    ],
  }),
  component: RoyalleHome,
});

// Categorias oficiais Royalle (12) vêm de `@/lib/categories`

const SLIDES = [
  {
    img: banner1,
    eyebrow: "Royalle Travel",
    title: "Voe em jatos privados",
    desc: "Até 35% de desconto em traslados executivos e fretamentos com nossos parceiros premium.",
    cta: "Explorar viagens",
  },
  {
    img: banner2,
    eyebrow: "Royalle Boutique",
    title: "Maisons selecionadas, descontos reais",
    desc: "As marcas mais desejadas do Brasil e do mundo com condições exclusivas para membros Royalle.",
    cta: "Ver boutiques",
  },
  {
    img: banner3,
    eyebrow: "Royalle Wellness",
    title: "Spas, retiros e bem-estar",
    desc: "Experiências cuidadosamente curadas para você relaxar com a tranquilidade de quem é membro.",
    cta: "Cuidar de mim",
  },
];

const FEATURED = [
  { img: feat1, eyebrow: "Destaques", title: "Descontos em Destaque", text: "As parcerias mais desejadas pelos membros Royalle." },
  { img: feat2, eyebrow: "Família", title: "Diversão em Família", text: "Experiências para curtir com quem você ama." },
  { img: feat3, eyebrow: "Torcida", title: "Vibrar Junto", text: "Curadoria de ofertas para os grandes momentos esportivos." },
];

const MOMENTS = [
  { label: "Torcer junto", tag: "Torcida" },
  { label: "Diversão em família", tag: "Passeios" },
  { label: "Top ofertas", tag: "Promoção" },
  { label: "Estreias do mês", tag: "Ingressos" },
  { label: "Uma boa leitura", tag: "Conteúdos" },
  { label: "Investir nos estudos", tag: "Aprendizado" },
];

const ALL_BENEFITS = [
  { name: "Agaxtur Tour", desc: "Benefícios variados", city: "São Paulo", cat: "Viagem" },
  { name: "Amazon Prime", desc: "Até 10% de desconto", city: "Online", cat: "Achadinhos" },
  { name: "Ao Cubo Studio", desc: "20% de desconto", city: "Rio de Janeiro", cat: "Lar doce lar" },
  { name: "Curitiba Fitness", desc: "Até 30% de desconto", city: "Curitiba", cat: "Autocuidado" },
  { name: "Avon Boutique", desc: "Até 40% de desconto", city: "Online", cat: "Autocuidado" },
  { name: "Berrini Café", desc: "10% de desconto", city: "São Paulo", cat: "Comer bem" },
  { name: "Barbearia do Zé", desc: "Até 25% de desconto", city: "Belo Horizonte", cat: "Autocuidado" },
  { name: "Beach Park", desc: "Até 15% de desconto", city: "Fortaleza", cat: "Para se divertir" },
  { name: "Beni Pet Store", desc: "Até 15% de desconto", city: "São Paulo", cat: "Cuidados pet" },
  { name: "World Tour", desc: "Até 17% de desconto", city: "Porto Alegre", cat: "Pé na estrada" },
  { name: "Boss Detail", desc: "15% de desconto", city: "Brasília", cat: "Achadinhos" },
  { name: "Brasas English", desc: "Até 40% de desconto", city: "Online", cat: "Foco na carreira" },
];

const CITIES = ["Todas as cidades", "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Fortaleza", "Brasília", "Porto Alegre", "Online"];
const FILTER_CATS = ["Todas as categorias", "Viagem", "Achadinhos", "Lar doce lar", "Autocuidado", "Comer bem", "Para se divertir", "Cuidados pet", "Pé na estrada", "Foco na carreira"];

const POSTS = [
  { img: blog1, tag: "Carreira", title: "10 hábitos que separam os membros Royalle de alta performance", date: "22 Jun 2026" },
  { img: blog2, tag: "Lifestyle", title: "Como aproveitar as boutiques exclusivas do clube com inteligência", date: "18 Jun 2026" },
  { img: blog3, tag: "Viagem", title: "Roteiros premium pela Europa com cashback Royalle Travel", date: "11 Jun 2026" },
];

function SectionTitle({ kicker, title, action }: { kicker?: string; title: string; action?: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6">
      <div>
        {kicker && <div className="ornament mb-3">{kicker}</div>}
        <h2 className="text-3xl font-light text-[color:var(--midnight)] md:text-4xl">{title}</h2>
      </div>
      {action && (
        <a href="#" className="hidden items-center gap-2 text-xs uppercase tracking-[0.3em] text-[color:var(--gold-deep)] hover:text-[color:var(--midnight)] md:inline-flex">
          {action} <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

function CategoriesCircles() {
  return (
    <section className="bg-[color:var(--ivory)] py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-center justify-between">
          <span className="ornament">Categorias Royalle</span>
          <Link to="/dashboard" className="hidden text-[0.65rem] uppercase tracking-[0.3em] text-[color:var(--accent)] md:inline-flex">
            Ver todas <ArrowUpRight className="ml-1 inline h-3 w-3" />
          </Link>
        </div>
        <div className="hide-scrollbar -mx-6 grid grid-flow-col auto-cols-[120px] gap-4 overflow-x-auto px-6 md:grid-flow-row md:auto-cols-auto md:grid-cols-6 lg:grid-cols-12">
          {ROYALLE_CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.slug}
                to="/categoria/$slug"
                params={{ slug: c.slug }}
                className="group flex flex-col items-center gap-3"
              >
                <div className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${c.gradient} text-white shadow-md transition group-hover:-translate-y-1 group-hover:shadow-xl`}>
                  <Icon className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <span className="text-center text-[0.72rem] font-medium leading-tight text-[color:var(--midnight)]">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);
  const go = (d: number) => setI((p) => (p + d + SLIDES.length) % SLIDES.length);
  return (
    <section className="bg-[color:var(--ivory)] pb-16">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="relative overflow-hidden rounded-sm border border-[color:var(--gold)]/40 shadow-luxe">
          <div className="absolute inset-0 bg-[color:var(--midnight)]" />
          {SLIDES.map((s, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
            >
              <img src={s.img} alt={s.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--midnight)]/95 via-[color:var(--midnight)]/70 to-transparent" />
            </div>
          ))}
          <div className="relative grid min-h-[220px] grid-cols-1 items-center px-8 py-6 md:min-h-[260px] md:px-16">
            <div className="max-w-xl text-[color:var(--ivory)]">
              <div className="ornament mb-5" style={{ color: "var(--gold)" }}>{SLIDES[i].eyebrow}</div>
              <h1 className="font-display text-4xl leading-tight md:text-6xl">
                {SLIDES[i].title}
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-[color:var(--ivory)]/80 md:text-base">
                {SLIDES[i].desc}
              </p>
              <div className="mt-8 flex gap-3">
                <Link to="/login" className="inline-flex items-center gap-2 bg-[color:var(--gold)] px-7 py-3 text-xs uppercase tracking-[0.3em] text-[color:var(--midnight)] transition hover:bg-[color:var(--ivory)]">
                  {SLIDES[i].cta}
                </Link>
                <Link to="/cadastro" className="inline-flex items-center gap-2 border border-[color:var(--ivory)]/30 px-7 py-3 text-xs uppercase tracking-[0.3em] text-[color:var(--ivory)] transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]">
                  Saber mais
                </Link>
              </div>
            </div>
          </div>
          <button onClick={() => go(-1)} className="absolute left-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-[color:var(--gold)]/40 bg-[color:var(--midnight)]/40 text-[color:var(--gold)] backdrop-blur transition hover:bg-[color:var(--gold)] hover:text-[color:var(--midnight)]">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => go(1)} className="absolute right-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-[color:var(--gold)]/40 bg-[color:var(--midnight)]/40 text-[color:var(--gold)] backdrop-blur transition hover:bg-[color:var(--gold)] hover:text-[color:var(--midnight)]">
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`h-1 rounded-full transition-all ${idx === i ? "w-10 bg-[color:var(--gold)]" : "w-4 bg-[color:var(--ivory)]/40"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandMark({ name }: { name: string }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <div className="grid h-16 w-full place-items-center">
      <div className="flex items-center gap-2">
        <span className="font-display text-3xl tracking-tight text-[color:var(--midnight)]">{initials}</span>
        <span className="text-[0.65rem] uppercase tracking-[0.3em] text-[color:var(--muted-foreground)]">{name.split(" ").slice(1).join(" ") || "Maison"}</span>
      </div>
    </div>
  );
}

function CompanyCard({ c, kicker }: { c: any; kicker?: string }) {
  return (
    <Link
      to="/empresa/$slug"
      params={{ slug: c.slug }}
      className="luxe-card group flex flex-col gap-3 p-6"
    >
      <div className="flex items-center gap-3">
        {c.logo_url ? (
          <img src={c.logo_url} alt={c.name} className="h-12 w-12 rounded-lg object-cover" />
        ) : (
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--midnight)] text-white font-display text-lg">
            {c.name?.[0]}
          </div>
        )}
        <div className="min-w-0">
          <div className="truncate font-display text-base text-[color:var(--midnight)]">{c.name}</div>
          <div className="text-[0.6rem] uppercase tracking-[0.25em] text-[color:var(--accent)]">
            {kicker ?? c.categories?.name ?? "Royalle"}
          </div>
        </div>
      </div>
      <p className="line-clamp-2 text-sm text-[color:var(--muted-foreground)]">
        {c.short_description ?? "Benefício exclusivo para membros."}
      </p>
      <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--accent)]">
        Acessar <ArrowUpRight className="h-3 w-3" />
      </span>
    </Link>
  );
}

function MostAccessed() {
  const fn = useServerFn(getMostAccessedFn);
  const q = useQuery({ queryKey: ["most-accessed"], queryFn: () => fn() });
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle kicker="Curadoria" title="Benefícios mais acessados" action="Ver todos" />
        {!q.data?.length ? (
          <EmptyHint text="Em breve: as marcas mais acessadas por categoria." />
        ) : (
          <div className="hide-scrollbar -mx-6 flex gap-5 overflow-x-auto px-6 pb-2">
            {q.data.map((c: any) => (
              <div key={c.id} className="w-64 shrink-0"><CompanyCard c={c} /></div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FlashOffers() {
  const [t, setT] = useState({ d: 8, h: 13, m: 10, s: 42 });
  useEffect(() => {
    const i = setInterval(() => {
      setT((p) => {
        let { d, h, m, s } = p;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; d--; }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(i);
  }, []);
  const cell = (n: number, l: string) => (
    <div className="flex flex-col items-center">
      <span className="font-display text-4xl text-[color:var(--gold)] md:text-5xl">{String(n).padStart(2, "0")}</span>
      <span className="text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--ivory)]/60">{l}</span>
    </div>
  );
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-sm border border-[color:var(--gold)]/40 shadow-luxe">
          <div className="absolute inset-0 gradient-midnight" />
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[color:var(--gold)]/10 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 h-60 w-60 rounded-full bg-[color:var(--burgundy)]/30 blur-3xl" />
          <div className="relative grid gap-6 px-8 py-6 md:grid-cols-[1.4fr_1fr] md:px-14 md:py-8">
            <div className="text-[color:var(--ivory)]">
              <div className="ornament mb-4" style={{ color: "var(--gold)" }}>
                <Clock className="h-3 w-3" /> Janela limitada
              </div>
              <h3 className="font-display text-4xl md:text-5xl">Ofertas Relâmpago Royalle</h3>
              <p className="mt-4 max-w-md text-sm text-[color:var(--ivory)]/70 md:text-base">
                Corra e aproveite uma seleção privê das melhores maisons com condições reservadas
                exclusivamente aos membros da corte.
              </p>
              <Link to="/ofertas-relampago" className="mt-8 inline-flex items-center gap-2 bg-[color:var(--gold)] px-8 py-3 text-xs uppercase tracking-[0.3em] text-[color:var(--midnight)] transition hover:bg-[color:var(--ivory)]">
                Aproveitar agora <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="flex items-center justify-around md:justify-end md:gap-6">
              {cell(t.d, "Dias")}<span className="font-display text-3xl text-[color:var(--gold)]/40">:</span>
              {cell(t.h, "Horas")}<span className="font-display text-3xl text-[color:var(--gold)]/40">:</span>
              {cell(t.m, "Min")}<span className="font-display text-3xl text-[color:var(--gold)]/40">:</span>
              {cell(t.s, "Seg")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Recent() {
  const fn = useServerFn(getRecentFn);
  const q = useQuery({ queryKey: ["recent"], queryFn: () => fn() });
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle kicker="Recém-chegados" title="Benefícios mais recentes" action="Ver todos" />
        {!q.data?.length ? (
          <EmptyHint text="Em breve: novidades variadas por categoria." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {q.data.map((c: any) => <CompanyCard key={c.id} c={c} kicker="Novo" />)}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedBanners() {
  return (
    <section className="pb-20">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">
        {FEATURED.map((f) => (
          <Link key={f.title} to="/destaque/$slug" params={{ slug: slugify(f.title) }} className="group relative aspect-[5/3] overflow-hidden border border-[color:var(--gold)]/30 shadow-soft">
            <img src={f.img} alt={f.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--midnight)] via-[color:var(--midnight)]/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-[color:var(--ivory)]">
              <div className="ornament mb-3" style={{ color: "var(--gold)" }}>{f.eyebrow}</div>
              <h3 className="font-display text-3xl">{f.title}</h3>
              <p className="mt-2 text-sm text-[color:var(--ivory)]/80">{f.text}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[color:var(--gold)]">
                Eu quero <ArrowUpRight className="h-3 w-3 transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Moments() {
  const fn = useServerFn(getSpecialMomentsFn);
  const q = useQuery({ queryKey: ["moments"], queryFn: () => fn() });
  return (
    <section className="bg-[color:var(--muted)] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle kicker="Ritual" title="Para momentos especiais" action="Ver tudo" />
        {!q.data?.length ? (
          <EmptyHint text="Marque empresas como destaque no admin para aparecerem aqui." />
        ) : (
          <div className="hide-scrollbar -mx-6 flex gap-5 overflow-x-auto px-6 pb-2">
            {q.data.map((c: any) => (
              <div key={c.id} className="w-64 shrink-0"><CompanyCard c={c} kicker="Destaque" /></div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-white p-10 text-center text-sm text-[color:var(--muted-foreground)]">
      {text}
    </div>
  );
}

function AllBenefits() {
  const [cat, setCat] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const fn = useServerFn(listCompaniesFn);
  const q = useQuery({
    queryKey: ["all-benefits", cat, city],
    queryFn: () => fn({ data: { categorySlug: cat || undefined, city: city || undefined, limit: 60, orderBy: "created_at" } }),
  });
  const cities = Array.from(new Set((q.data ?? []).map((c: any) => c.city).filter(Boolean))) as string[];
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle kicker="Catálogo" title="Todos os benefícios" />
        <div className="mb-10 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
            <Filter className="h-3.5 w-3.5" /> Filtrar
          </div>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="h-11 rounded-full border border-[color:var(--border)] bg-white px-5 text-sm outline-none focus:border-[color:var(--accent)]"
          >
            <option value="">Todas as categorias</option>
            {ROYALLE_CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="h-11 rounded-full border border-[color:var(--border)] bg-white px-5 text-sm outline-none focus:border-[color:var(--accent)]"
          >
            <option value="">Todas as cidades</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="ml-auto text-xs uppercase tracking-[0.3em] text-[color:var(--muted-foreground)]">
            {q.data?.length ?? 0} resultados
          </span>
        </div>
        {!q.data?.length ? (
          <EmptyHint text="Nenhum benefício encontrado com esses filtros." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {q.data.map((c: any) => (
              <CompanyCard key={c.id} c={c} />
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-10 py-4 text-xs uppercase tracking-[0.3em] text-white transition hover:brightness-110">
            Ver mais benefícios
          </Link>
        </div>
      </div>
    </section>
  );
}

function Blog() {
  return (
    <section className="bg-[color:var(--muted)] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle kicker="Royalle Journal" title="O diário do bom viver" action="Todas as edições" />
        <div className="grid gap-8 md:grid-cols-3">
          {POSTS.map((p) => (
            <a key={p.title} href="#" className="group flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={p.img} alt={p.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute left-4 top-4 bg-[color:var(--midnight)] px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--gold)]">
                  {p.tag}
                </div>
              </div>
              <div className="mt-5 text-[0.65rem] uppercase tracking-[0.3em] text-[color:var(--gold-deep)]">{p.date}</div>
              <h3 className="mt-2 font-display text-2xl leading-snug text-[color:var(--midnight)] transition group-hover:text-[color:var(--gold-deep)]">
                {p.title}
              </h3>
              <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[color:var(--midnight)]">
                Ler matéria <ArrowUpRight className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="relative overflow-hidden bg-[color:var(--midnight)] py-20 text-[color:var(--ivory)]">
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,var(--gold)_1px,transparent_0)] [background-size:32px_32px]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2 md:items-center">
        <div>
          <div className="ornament mb-4" style={{ color: "var(--gold)" }}>Royalle Privé</div>
          <h2 className="font-display text-4xl md:text-5xl">Receba a Carta da Corte</h2>
          <p className="mt-4 max-w-md text-sm text-[color:var(--ivory)]/70">
            Drops, ofertas privadas e convites para experiências fechadas — entregues no seu e-mail
            antes de chegarem ao site.
          </p>
        </div>
        <form className="flex flex-col gap-3 md:flex-row" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            required
            placeholder="Seu melhor e-mail"
            className="h-14 flex-1 rounded-none border border-[color:var(--gold)]/40 bg-transparent px-5 text-sm text-[color:var(--ivory)] outline-none placeholder:text-[color:var(--ivory)]/40 focus:border-[color:var(--gold)]"
          />
          <button className="h-14 bg-[color:var(--gold)] px-8 text-xs uppercase tracking-[0.3em] text-[color:var(--midnight)] transition hover:bg-[color:var(--ivory)]">
            Assinar
          </button>
        </form>
      </div>
    </section>
  );
}

function RoyalleHome() {
  return (
    <SiteShell>
      <CategoriesCircles />
      <HeroCarousel />
      <MostAccessed />
      <FlashOffers />
      <Recent />
      <FeaturedBanners />
      <Moments />
      <AllBenefits />
      <Blog />
      <Newsletter />
    </SiteShell>
  );
}