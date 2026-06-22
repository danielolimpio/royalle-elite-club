import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Crown, Menu, X, Mail, Phone, Instagram, Facebook, Linkedin, Youtube } from "lucide-react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Serviços", href: "/servicos" },
  { label: "Whitelabel", href: "/whitelabel" },
  { label: "Parcerias", href: "/parcerias" },
  { label: "Planos", href: "/cadastro" },
  { label: "Contato", href: "/contato" },
];

function Logo() {
  return (
    <Link to="/" className="group inline-flex items-center gap-3">
      <span className="relative grid h-11 w-11 place-items-center rounded-full border border-[color-mix(in_oklab,var(--gold)_50%,transparent)] bg-[color:var(--midnight)]">
        <Crown className="h-5 w-5 text-[color:var(--gold)]" strokeWidth={1.5} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl tracking-wide text-[color:var(--midnight)]">Royalle</span>
        <span className="text-[0.6rem] uppercase tracking-[0.4em] text-[color:var(--gold-deep)]">Club · royalle.club</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <>
      <div className="bg-[color:var(--midnight)] text-[color:var(--gold)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-[0.7rem] uppercase tracking-[0.3em]">
          <span className="hidden sm:inline">✦ Experiências curadas para membros</span>
          <span className="opacity-80">Convide a corte · ganhe 1 mês Royalle Black</span>
          <span className="hidden sm:inline">+55 (11) 4000 · 2026</span>
        </div>
      </div>
      <header className={`sticky top-0 z-40 border-b border-[color:var(--border)] transition-all ${scrolled ? "bg-[color:var(--ivory)]/95 backdrop-blur shadow-soft" : "bg-[color:var(--ivory)]"}`}>
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
          <Logo />
          <div className="ml-auto hidden flex-1 max-w-lg lg:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-foreground)]" />
              <input placeholder="O que você procura hoje?" className="h-11 w-full rounded-full border border-[color:var(--border)] bg-white pl-11 pr-32 text-sm outline-none transition focus:border-[color:var(--gold)]" />
              <button className="absolute right-1 top-1 h-9 rounded-full bg-[color:var(--midnight)] px-4 text-xs uppercase tracking-[0.25em] text-[color:var(--gold)] hover:bg-[color:var(--midnight-2)]">Buscar</button>
            </div>
          </div>
          <nav className="hidden items-center gap-7 text-sm xl:flex">
            {NAV.map((n) => (
              <Link key={n.label} to={n.href} className="relative text-[color:var(--midnight)] transition hover:text-[color:var(--gold-deep)]">{n.label}</Link>
            ))}
          </nav>
          <Link to="/login" className="hidden items-center gap-2 rounded-full border border-[color:var(--midnight)] px-5 py-2 text-xs uppercase tracking-[0.3em] text-[color:var(--midnight)] transition hover:bg-[color:var(--midnight)] hover:text-[color:var(--gold)] md:inline-flex">Entrar</Link>
          <button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--border)] xl:hidden" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="border-t border-[color:var(--border)] bg-[color:var(--ivory)] xl:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
              {NAV.map((n) => (
                <Link key={n.label} to={n.href} className="rounded-md px-3 py-3 text-sm hover:bg-[color:var(--muted)]">{n.label}</Link>
              ))}
              <Link to="/login" className="mt-2 rounded-full bg-[color:var(--midnight)] px-4 py-3 text-center text-xs uppercase tracking-[0.3em] text-[color:var(--gold)]">Entrar</Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[color:var(--midnight)] text-[color:var(--ivory)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-[color:var(--gold)]">
              <Crown className="h-5 w-5 text-[color:var(--gold)]" strokeWidth={1.3} />
            </span>
            <div>
              <div className="font-display text-3xl">Royalle</div>
              <div className="text-[0.65rem] uppercase tracking-[0.4em] text-[color:var(--gold)]">royalle.club</div>
            </div>
          </div>
          <p className="mt-6 max-w-sm text-sm text-[color:var(--ivory)]/60">
            Um clube de benefícios premium para quem entende que a vida boa é feita de pequenas e grandes regalias — criteriosamente escolhidas.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Linkedin, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--gold)]/40 transition hover:border-[color:var(--gold)] hover:bg-[color:var(--gold)] hover:text-[color:var(--midnight)]">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        {[
          { t: "Clube", links: [["Sobre","/sobre"],["Como funciona","/servicos"],["Planos","/cadastro"],["Whitelabel","/whitelabel"]] },
          { t: "Membros", links: [["Entrar","/login"],["Cadastrar","/cadastro"],["Indicar","/cadastro"],["Suporte","/contato"]] },
          { t: "Legal", links: [["Termos de uso","/contato"],["Privacidade","/contato"],["Cookies","/contato"],["Imprensa","/contato"]] },
        ].map((col) => (
          <div key={col.t}>
            <div className="mb-5 text-[0.7rem] uppercase tracking-[0.4em] text-[color:var(--gold)]">{col.t}</div>
            <ul className="space-y-3 text-sm text-[color:var(--ivory)]/70">
              {col.links.map(([l, href]) => (
                <li key={l}><Link to={href} className="transition hover:text-[color:var(--gold)]">{l}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[color:var(--gold)]/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-[color:var(--ivory)]/50 md:flex-row">
          <div>© 2016—2026 Royalle Club. Todos os direitos reservados.</div>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-[color:var(--gold)]" /> contato@royalle.club</span>
            <span className="inline-flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-[color:var(--gold)]" /> +55 (11) 4000-2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[color:var(--ivory)] text-[color:var(--foreground)]">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}