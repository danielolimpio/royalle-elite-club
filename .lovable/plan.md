# Plano: Royalle — Categorias unificadas + Dashboard + Admin + Páginas de Empresa

## 1. Backend (Lovable Cloud / Supabase)

Habilitar Lovable Cloud e criar schema:

**Tabelas (public):**
- `categories` — id, slug (unique), name, icon_url, sort_order, created_at
- `companies` — id, slug (unique), category_id (fk), name, logo_url, cover_url, short_description, long_description, cta_title, cta_text, persuasion_text, rules, featured (bool), access_count (int), created_at, updated_at
- `promotions` — id, company_id (fk, cascade), title, description, discount_percent, coupon_code, redirect_url, rules, sort_order, active (bool), created_at
- `profiles` — id (=auth.users.id), full_name, cpf, whatsapp, plan, created_at
- `user_roles` — id, user_id, role (enum: admin, user) — padrão `has_role()` security-definer

**Seed:** 12 categorias fixas:
Farmácia & Cosméticos, Moda & Acessórios, Casa & Construção, Tecnologia, Eletrodomésticos, Automotivo, Infantil, Alimentação, Educação, Entretenimento, Viagens, Serviços.

**RLS + GRANTS:**
- `categories`, `companies`, `promotions`: SELECT público para `anon` e `authenticated`; INSERT/UPDATE/DELETE só com `has_role(uid,'admin')`.
- `profiles`: usuário lê/edita o próprio.
- `user_roles`: apenas service_role escreve; authenticated lê o próprio.

**Storage:** bucket público `company-assets` (logos + capas).

## 2. Server functions (`src/lib/*.functions.ts`)

- `categories.functions.ts`: `listCategories()`
- `companies.functions.ts`: `listCompanies({categorySlug?, city?, limit?, orderBy?})`, `getCompanyBySlug(slug)`, `getMostAccessed()`, `getRecent()`, `getSpecialMoments()`, `incrementAccess(slug)`
- `admin.functions.ts` (com `requireSupabaseAuth` + check admin):
  `createCompany`, `updateCompany`, `deleteCompany`, `addPromotion`, `updatePromotion`, `deletePromotion`, `duplicateCompany`

Imagens uploadadas via supabase-js no browser direto para o bucket (URL pública gravada em `companies.logo_url`).

## 3. Frontend — Categorias unificadas

Criar `src/lib/categories.ts` com a lista mestre de 12 (slug + nome + ícone) — fonte única usada em todo lugar.

**Home (`src/routes/index.tsx`):**
- Substituir `QuickCategories` (Pé na estrada, Sextou, etc.) pelos 12 cards de categoria oficial logo abaixo do header.
- Remover componente `RoyalleCategoriesGrid` ("Todas as categorias do clube").
- `BenefíciosMaisAcessados`: query top 12 (uma por categoria, ordenado por access_count).
- `BenefíciosMaisRecentes`: query 12 mais recentes variando categorias.
- `ParaMomentosEspeciais`: featured=true variando categorias.
- `TodosOsBenefícios`: filtro por categoria (chips dos 12 + "Todos" default) + cidade.

**Páginas de categoria (`/categoria/$slug`):** reescrever para puxar da DB; lista de companies filtradas; 404 se slug fora dos 12.

**Página de empresa (`/empresa/$slug`)** — NOVA, premium:
- Header com logo + capa
- Descrição curta e longa
- Lista de promoções (cards) com: % desconto, cupom (copiar), CTA persuasivo, regras, botão "Ir para o site" (abre `redirect_url` em nova aba, chama `incrementAccess`)
- Suporta múltiplas promoções
- Botão "Duplicar página" só visível para admin (server fn)

## 4. Dashboard do usuário (`/_authenticated/dashboard`)

- Layout premium com sidebar
- Grid das 12 categorias
- Seções: Favoritos, Acessadas recentemente, Promoções ativas
- Cada card → `/empresa/$slug`

## 5. Painel Admin (`/_authenticated/admin/*`)

Gate adicional: redireciona se `has_role` != admin.

- `/admin` — overview (contagens)
- `/admin/empresas` — tabela com busca, filtro categoria, ações editar/excluir/duplicar
- `/admin/empresas/nova` e `/admin/empresas/$id` — formulário completo:
  - Categoria (select com 12)
  - Upload logo + capa (bucket)
  - Slug auto
  - Descrição curta/longa, CTA, persuasão, regras
  - Featured toggle
  - Sub-seção de Promoções: adicionar N promoções (título, %, cupom, link, regras, ativo, ordem)
  - Botão "Replicar como nova empresa" (duplica empresa + promoções)

## 6. Auth

- Reaproveitar `/login` e `/cadastro` existentes; após signup criar profile via trigger; primeiro usuário pode ser promovido a admin manualmente via SQL seed (incluir instrução).

## 7. Limpeza visual

- Apagar imports/assets das categorias removidas (`cat-icon-*` antigos, `cat-cinema`, `cat-cashback`, etc.) — manter só os 12 oficiais e gerar os que faltam via IA.
- Remover seção "Todas as categorias do clube" do index.
- Manter paleta Awin (roxo + laranja).

## Detalhes técnicos

- Rotas autenticadas sob `src/routes/_authenticated/` (layout gerenciado).
- Server fns admin: `requireSupabaseAuth` + `has_role` check, carregam `supabaseAdmin` via `await import` apenas se necessário (na maioria dá pra usar client autenticado + RLS).
- Queries via TanStack Query (`ensureQueryData` + `useSuspenseQuery`).
- Upload de imagem: cliente browser usa `supabase.storage.from('company-assets').upload(...)` então passa URL pública à server fn.
- Não usar admin client para leitura pública.

## Entregáveis ao final

1. 12 categorias seed e mostradas no topo da home
2. Páginas dinâmicas de categoria e empresa funcionando
3. Dashboard para usuário logado
4. Painel admin completo com CRUD de empresas + promoções + duplicação
5. Todas seções da home alimentadas pela DB com variação por categoria
