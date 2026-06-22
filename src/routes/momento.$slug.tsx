import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { ArrowUpRight, Crown } from "lucide-react";
import { SiteShell } from "@/components/site/SiteLayout";

const MOMENTOS: Record<string, { name: string; eyebrow: string; desc: string; items: { brand: string; desc: string; tag: string }[] }> = {
  "torcer-junto": { name: "Torcer junto", eyebrow: "Torcida", desc: "Para vibrar com seu time do coração em grande estilo.", items: [
    { brand: "Stadium VIP", desc: "Camarote cortesia", tag: "VIP" },
    { brand: "DAZN Royalle", desc: "Mensalidade promo", tag: "Promo" },
    { brand: "Centauro Plus", desc: "10% em camisas", tag: "10% off" },
    { brand: "Sócio Royale", desc: "Plano sócio bolsa", tag: "Bolsa" },
  ]},
  "diversao-em-familia": { name: "Diversão em família", eyebrow: "Passeios", desc: "Roteiros para os melhores momentos com quem você ama.", items: [
    { brand: "Beach Park", desc: "Combo 15% off", tag: "15% off" },
    { brand: "Hopi Hari", desc: "Pacote família", tag: "Combo" },
    { brand: "Aquário Royale", desc: "Visita guiada", tag: "Guiada" },
    { brand: "Hot Park", desc: "20% off", tag: "20% off" },
  ]},
  "top-ofertas": { name: "Top ofertas", eyebrow: "Promoção", desc: "As ofertas mais resgatadas pela corte Royalle.", items: [
    { brand: "Maison Aurea", desc: "Até 30% off", tag: "30% off" },
    { brand: "Domaine Royal", desc: "Até 45% off", tag: "45% off" },
    { brand: "Édition Privée", desc: "Cashback 12%", tag: "12%" },
    { brand: "Privé Voyages", desc: "Cashback 8%", tag: "8%" },
  ]},
  "estreias-do-mes": { name: "Estreias do mês", eyebrow: "Ingressos", desc: "Pré-vendas e estreias com condição especial Royalle.", items: [
    { brand: "Cinépolis VIP", desc: "Pré-estreia", tag: "Pré" },
    { brand: "Live Nation", desc: "Pré-venda exclusiva", tag: "Pré-venda" },
    { brand: "Tickets For Fun", desc: "Acesso antecipado", tag: "Acesso" },
    { brand: "Sympla Plus", desc: "Cashback em shows", tag: "Cashback" },
  ]},
  "uma-boa-leitura": { name: "Uma boa leitura", eyebrow: "Conteúdos", desc: "Livros, revistas e conteúdo premium para crescer.", items: [
    { brand: "Amazon Kindle", desc: "1 mês cortesia", tag: "Cortesia" },
    { brand: "Skoob Plus", desc: "Cashback 5%", tag: "5%" },
    { brand: "Estante Virtual", desc: "Cupom Royalle", tag: "Cupom" },
    { brand: "Saraiva Royale", desc: "10% para membros", tag: "10% off" },
  ]},
  "investir-nos-estudos": { name: "Investir nos estudos", eyebrow: "Aprendizado", desc: "Cursos, mentorias e idiomas com descontos exclusivos.", items: [
    { brand: "Brasas English", desc: "Até 40% off", tag: "40% off" },
    { brand: "Alura Premium", desc: "3 meses grátis", tag: "Grátis" },
    { brand: "FGV Executivo", desc: "Bolsa MBA", tag: "Bolsa" },
    { brand: "Coursera Plus", desc: "Anuidade promo", tag: "Anuidade" },
  ]},
};

export const Route = createFileRoute("/momento/$slug")({
  loader: ({ params }) => { if (!MOMENTOS[params.slug]) throw notFound(); return null; },
  head: ({ params }) => {
    const m = params ? MOMENTOS[params.slug] : undefined;
    return { meta: [{ title: m ? `${m.name} — Royalle Club` : "Momento" }, { name: "description", content: m?.desc ?? "" }] };
  },
  notFoundComponent: () => (
    <SiteShell><section className="py-24 text-center"><h1 className="font-display text-4xl">Momento não encontrado</h1></section></SiteShell>
  ),
  component: MomentoPage,
});

function MomentoPage() {
  const { slug } = useParams({ from: "/momento/$slug" });
  const m = MOMENTOS[slug]!;
  return (
    <SiteShell>
      <section className="bg-[color:var(--midnight)] py-20 text-[color:var(--ivory)]">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="ornament justify-center" style={{ color: "var(--gold)" }}>{m.eyebrow}</div>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">{m.name}</h1>
          <p className="mx-auto mt-5 max-w-xl text-sm text-[color:var(--ivory)]/70 md:text-base">{m.desc}</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {m.items.map((b) => (
              <Link key={b.brand} to="/login" className="luxe-card group flex flex-col items-center p-7 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-[color:var(--midnight)]">
                  <Crown className="h-8 w-8 text-[color:var(--gold)]" strokeWidth={1.3} />
                </div>
                <h3 className="mt-5 font-display text-xl text-[color:var(--midnight)]">{b.brand}</h3>
                <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">{b.desc}</p>
                <span className="mt-4 bg-[color:var(--midnight)] px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--gold)]">{b.tag}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.25em] text-[color:var(--gold-deep)]">
                  Acessar <ArrowUpRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}