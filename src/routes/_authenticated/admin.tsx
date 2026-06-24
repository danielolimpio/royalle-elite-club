import { createFileRoute, Link, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { isAdminFn } from "@/lib/admin.functions";
import { SiteShell } from "@/components/site/SiteLayout";
import { LayoutDashboard, Building2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const r = await isAdminFn();
    if (!r.isAdmin) throw redirect({ to: "/dashboard" });
  },
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const nav = [
    { to: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
    { to: "/admin/empresas", label: "Empresas", icon: Building2 },
  ];
  return (
    <SiteShell>
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-[color:var(--border)] bg-white p-4 h-fit sticky top-24">
          <div className="mb-4 text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">Admin Royalle</div>
          <nav className="flex flex-col gap-1">
            {nav.map((n) => {
              const Icon = n.icon;
              const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to as any}
                  className={`inline-flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                    active ? "bg-[color:var(--accent)]/10 text-[color:var(--accent)] font-semibold" : "text-[color:var(--midnight)] hover:bg-[color:var(--muted)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0"><Outlet /></main>
      </div>
    </SiteShell>
  );
}
