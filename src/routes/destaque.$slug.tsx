import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import { SiteShell } from "@/components/site/SiteLayout";
import feat1 from "@/assets/feat-1.jpg";
import feat2 from "@/assets/feat-2.jpg";
import feat3 from "@/assets/feat-3.jpg";

const DESTAQUES: Record<string, { name: string; img: string; eyebrow: string; desc: string; items: { brand: string; desc: string; tag: string }[] }> = {
  "descontos-em-destaque": { name: "Descontos em Destaque", img: feat1, eyebrow: "Destaques", desc: "As parcerias mais desejadas pelos membros Royalle.", items: [
    { brand: "Maison Aurea", desc: "Até 30% em coleção exclusiva", tag: "30% off" },
    { brand: "Domaine Royal", desc: "Até 45% em adegas premium", tag: "45% off" },
    { brand: "Atelier Noir", desc: "Até 25% em alfaiataria", tag: "25% off" },
    { brand: "L'Or Boutique", desc: "Até 35% em joalheria", tag: "35% off" },
    { brand: "Casa di Lusso", desc: "Até 40% em mobiliário", tag: "40% off" },
    { brand: "Édition Privée", desc: "Cashback 12% em luxo", tag: "12% cashback" },
  ]},
  "diversao-em-familia": { name: "Diversão em Família", img: feat2, eyebrow: "Família", desc: "Experiências cuidadosamente curadas para curtir com quem você ama.", items: [
    { brand: "Beach Park Família", desc: "Combo com 15% off", tag: "15% off" },
    { brand: "Hot Park", desc: "Ingresso família 20% off", tag: "20% off" },
    { brand: "Hopi Hari", desc: "Pacote 4 pessoas", tag: "Combo" },
    { brand: "Cinépolis Família", desc: "Sessão matinê privê", tag: "VIP" },
    { brand: "Aquário Royale", desc: "Visita guiada", tag: "Guiada" },
    { brand: "Sympla Kids", desc: "Cashback em shows infantis", tag: "Cashback" },
  ]},
  "vibrar-junto": { name: "Vibrar Junto", img: feat3, eyebrow: "Torcida", desc: "Curadoria de ofertas para os grandes momentos esportivos.", items: [
    { brand: "Sócio Royale", desc: "Plano sócio com bolsa", tag: "Bolsa" },
    { brand: "Centauro Plus", desc: "10% em camisas oficiais", tag: "10% off" },
    { brand: "DAZN Royalle", desc: "Mensalidade promocional", tag: "Promo" },
    { brand: "Stadium VIP", desc: "Camarote com cortesia", tag: "VIP" },
    { brand: "Tickets For Fun", desc: "Pré-venda Royalle", tag: "Pré-venda" },
    { brand: "Vai de Bus", desc: "Caravana com 20% off", tag: "20% off" },
  ]},
};

export const Route = createFileRoute("/destaque/$slug")({
  loader: ({ params }) => { if (!DESTAQUES[params.slug]) throw notFound(); return null; },
  head: ({ params }) => {
    const d = params ? DESTAQUES[params.slug] : undefined;
    return { meta: [{ title: d ? `${d.name} — Royalle Club` : "Destaque" }, { name: "description", content: d?.desc ?? "" }] };
  },
  notFoundComponent: () => (
    <SiteShell><section className="py-24 text-center"><h1 className="font-display text-4xl">Destaque não encontrado</h1></section></SiteShell>
  ),
  component: DestaquePage,
});

function DestaquePage() {
  const { slug } = useParams({ from: "/destaque/$slug" });
  const d = DESTAQUES[slug]!;
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-[color:var(--midnight)] text-[color:var(--ivory)]">
        <img src={d.img} alt={d.name} className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--midnight)] via-[color:var(--midnight)]/70 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="ornament" style={{ color: "var(--gold)" }}>{d.eyebrow}</div>
          <h1 className="mt-4 max-w-2xl font-display text-5xl md:text-6xl">{d.name}</h1>
          <p className="mt-5 max-w-xl text-sm text-[color:var(--ivory)]/80 md:text-base">{d.desc}</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {d.items.map((b) => (
              <Link key={b.brand} to="/login" className="luxe-card group flex flex-col p-7">
                <span className="inline-flex w-fit bg-[color:var(--gold)] px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--midnight)]">{b.tag}</span>
                <h3 className="mt-5 font-display text-2xl text-[color:var(--midnight)]">{b.brand}</h3>
                <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">{b.desc}</p>
                <div className="mt-6 flex items-center justify-between border-t border-dashed border-[color:var(--gold)]/40 pt-4 text-[0.65rem] uppercase tracking-[0.25em] text-[color:var(--gold-deep)]">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> Brasil</span>
                  <span className="inline-flex items-center gap-1">Aproveitar <ArrowUpRight className="h-3 w-3" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}