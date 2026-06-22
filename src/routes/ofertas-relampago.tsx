import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site/SiteLayout";

const FLASH = [
  { brand: "Maison Aurea", desc: "Coleção primavera", tag: "40% off" },
  { brand: "Domaine Royal", desc: "Vinhos selecionados", tag: "45% off" },
  { brand: "Atelier Noir", desc: "Alfaiataria sob medida", tag: "25% off" },
  { brand: "Casa di Lusso", desc: "Mobiliário italiano", tag: "30% off" },
  { brand: "L'Or Boutique", desc: "Joias de autor", tag: "35% off" },
  { brand: "Privé Voyages", desc: "Pacotes internacionais", tag: "8% cashback" },
  { brand: "Édition Privée", desc: "Luxo importado", tag: "12% cashback" },
  { brand: "Beach Park", desc: "Combo verão", tag: "20% off" },
];

export const Route = createFileRoute("/ofertas-relampago")({
  head: () => ({ meta: [{ title: "Ofertas Relâmpago — Royalle Club" }, { name: "description", content: "Ofertas com janela limitada." }] }),
  component: FlashPage,
});

function FlashPage() {
  const [t, setT] = useState({ d: 8, h: 13, m: 10, s: 42 });
  useEffect(() => {
    const i = setInterval(() => setT((p) => {
      let { d, h, m, s } = p; s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 23; d--; } return { d, h, m, s };
    }), 1000);
    return () => clearInterval(i);
  }, []);
  const cell = (n: number, l: string) => (
    <div className="flex flex-col items-center"><span className="font-display text-4xl text-[color:var(--gold)] md:text-5xl">{String(n).padStart(2, "0")}</span><span className="text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--ivory)]/60">{l}</span></div>
  );
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-[color:var(--midnight)] py-20 text-[color:var(--ivory)]">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[color:var(--gold)]/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-60 w-60 rounded-full bg-[color:var(--burgundy)]/30 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="ornament" style={{ color: "var(--gold)" }}><Clock className="h-3 w-3" /> Janela limitada</div>
            <h1 className="mt-4 font-display text-5xl md:text-6xl">Ofertas Relâmpago Royalle</h1>
            <p className="mt-5 max-w-xl text-sm text-[color:var(--ivory)]/70 md:text-base">
              Uma seleção privê das melhores maisons com condições reservadas exclusivamente aos membros da corte.
            </p>
          </div>
          <div className="flex items-center justify-around md:justify-end md:gap-6">
            {cell(t.d, "Dias")}<span className="font-display text-3xl text-[color:var(--gold)]/40">:</span>
            {cell(t.h, "Horas")}<span className="font-display text-3xl text-[color:var(--gold)]/40">:</span>
            {cell(t.m, "Min")}<span className="font-display text-3xl text-[color:var(--gold)]/40">:</span>
            {cell(t.s, "Seg")}
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FLASH.map((f) => (
              <Link key={f.brand} to="/login" className="luxe-card group flex flex-col p-6">
                <span className="inline-flex w-fit bg-[color:var(--burgundy)] px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--ivory)]">Relâmpago</span>
                <h3 className="mt-5 font-display text-xl text-[color:var(--midnight)]">{f.brand}</h3>
                <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">{f.desc}</p>
                <div className="mt-5 flex items-center justify-between border-t border-dashed border-[color:var(--gold)]/40 pt-3">
                  <span className="text-[0.65rem] uppercase tracking-[0.25em] text-[color:var(--gold-deep)]">{f.tag}</span>
                  <ArrowUpRight className="h-3 w-3 text-[color:var(--gold-deep)]" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}