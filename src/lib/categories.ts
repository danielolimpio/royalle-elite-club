import {
  Pill,
  Shirt,
  Hammer,
  Cpu,
  WashingMachine,
  Car,
  Baby,
  UtensilsCrossed,
  GraduationCap,
  Film,
  Plane,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type CategoryMeta = {
  slug: string;
  name: string;
  icon: LucideIcon;
  gradient: string;
};

export const CATEGORIES: CategoryMeta[] = [
  { slug: "farmacia-cosmeticos", name: "Farmácia & Cosméticos", icon: Pill, gradient: "from-pink-500 to-rose-500" },
  { slug: "moda-acessorios", name: "Moda & Acessórios", icon: Shirt, gradient: "from-fuchsia-500 to-pink-500" },
  { slug: "casa-construcao", name: "Casa & Construção", icon: Hammer, gradient: "from-amber-500 to-orange-500" },
  { slug: "tecnologia", name: "Tecnologia", icon: Cpu, gradient: "from-blue-500 to-indigo-500" },
  { slug: "eletrodomesticos", name: "Eletrodomésticos", icon: WashingMachine, gradient: "from-sky-500 to-cyan-500" },
  { slug: "automotivo", name: "Automotivo", icon: Car, gradient: "from-slate-600 to-zinc-700" },
  { slug: "infantil", name: "Infantil", icon: Baby, gradient: "from-yellow-400 to-orange-400" },
  { slug: "alimentacao", name: "Alimentação", icon: UtensilsCrossed, gradient: "from-red-500 to-orange-500" },
  { slug: "educacao", name: "Educação", icon: GraduationCap, gradient: "from-emerald-500 to-teal-500" },
  { slug: "entretenimento", name: "Entretenimento", icon: Film, gradient: "from-violet-500 to-purple-600" },
  { slug: "viagens", name: "Viagens", icon: Plane, gradient: "from-cyan-500 to-blue-600" },
  { slug: "servicos", name: "Serviços", icon: Wrench, gradient: "from-stone-500 to-stone-700" },
];

export const CATEGORY_BY_SLUG = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c])) as Record<string, CategoryMeta>;

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return CATEGORY_BY_SLUG[slug];
}
