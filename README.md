# Bahi V0

Bahi is a personal ledger app (khata, split expenses, portfolio, recurring entries, reports).
This repository currently contains only the project foundation and a placeholder application
shell. Financial features and the Supabase connection are added in later phases.

## Technology stack

| Area      | Tools                                                                   |
| --------- | ----------------------------------------------------------------------- |
| Core      | React 19, TypeScript 6 (strict), Vite 8, React Router 7                 |
| Styling   | Tailwind CSS 4, shadcn/ui (Radix, `radix-nova`), lucide-react, sonner   |
| Data      | TanStack Query, Supabase JS client                                      |
| Forms     | react-hook-form, zod, @hookform/resolvers                               |
| Charts    | Recharts                                                                |
| Utilities | date-fns, nanoid, clsx, tailwind-merge, class-variance-authority        |
| PWA       | vite-plugin-pwa                                                         |
| Tooling   | ESLint 10 (typescript-eslint), Prettier, Vitest, Testing Library, jsdom |

TypeScript is pinned to the 6.0 line because `typescript-eslint` does not yet support 7.x.

## Folder structure

```
src/
  app/            App shell: App.tsx, providers.tsx, router.tsx
  components/
    ui/           shadcn/ui primitives (added via the shadcn CLI, themed to Bahi tokens)
    layout/       AppShell, DesktopSidebar, MobileBottomNav, PageHeader, PageContainer
    financial/    MoneyDisplay, BalanceCard, SummaryCard, TransactionRow, AccountCard,
                  CategoryIcon, StatusBadge
    charts/       Recharts wrappers driven by CSS-variable colours
    shared/       PrimaryButton, IconButton, BottomSheet, Modal, ConfirmDialog, DatePicker,
                  SearchInput, SegmentedControl, FormField, EmptyState, ErrorState, LoadingSkeleton
  features/       One folder per domain, each with components/ hooks/ services/ types/
    auth/  onboarding/  khata/  split/  portfolio/  recurring/  reports/
    design-preview/   Design-only screens and FICTIONAL seed data (removed as real features land)
  hooks/          Shared hooks
  lib/
    supabase/     Supabase client (later)
    utils/        cn() and other helpers
    validation/   Shared zod schemas
    accounting/   Ledger and accounting logic
    env.ts        Validated environment variables
  services/       Shared services
  types/          Shared types
  constants/      Shared constants
  styles/         Global CSS (Tailwind entry)
  assets/         Static assets imported by code
  test/           Vitest setup
supabase/
  migrations/     SQL migrations
  seed.sql        Seed data
  functions/      Edge functions
public/icons/     PWA icons
docs/             Project documentation
```

Business logic lives in `features/*` and `lib/*`; `components/*` stays presentational and reusable.
The `@/` alias maps to `src/`.

## Design system

Direction: premium Indian fintech — minimal, calm, trustworthy, data-rich without clutter.
Tagline: _Every rupee, accounted for._ A live gallery of everything below is at `/design`.

### Tokens (single source of truth)

All raw values live in [`src/styles/tokens.css`](src/styles/tokens.css). Components use semantic
Tailwind utilities (`bg-card`, `text-muted-foreground`, `text-success-ink`) and never hex values.
Values needed in TypeScript (breakpoints, chart colours, motion) are mirrored in
[`src/constants/design-tokens.ts`](src/constants/design-tokens.ts) as CSS-variable references.

| Token group       | Notes                                                                                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Colour            | Background `#F7F6F2`, surface `#FFFFFF`, primary `#6254D9`, primary dark `#40358F`, text `#25233A`, secondary text `#858397`, success `#258653`, expense `#C65353`, border `#EAE8F0` |
| Typography        | Geist Variable. Scale: `caption`, `body-sm`, `body`, `title-sm`, `title`, `headline`, `display-sm`, `display`. Weights 400/500/600/700. Currency uses tabular numerals               |
| Spacing / layout  | Tailwind 4px scale; `--page-gutter` 16 / 24 / 32px; `--page-max` 80rem                                                                                                               |
| Radii             | `--radius` 12px base; cards 16px (`rounded-2xl`), hero cards 24px                                                                                                                    |
| Shadows           | `shadow-card`, `shadow-raised`, `shadow-overlay`, `shadow-nav`                                                                                                                       |
| Breakpoints       | `sm` 430, `md` 768, `lg` 1024, `xl` 1440                                                                                                                                             |
| Component heights | control 32 / 40 / **44** (touch), header 56, bottom nav 64, sidebar 256                                                                                                              |
| Motion            | 120 / 200 / 320 ms, `ease-soft`; honours `prefers-reduced-motion`                                                                                                                    |

**Accessible colour variants.** The brand colours do not all reach 4.5:1 as small text, so each has
a role. Brand `success` / `expense` are for fills, icons and large figures; `success-ink`
(`#1B6B41`) and `expense-ink` (`#A63D3D`) are for text and solid destructive buttons. Spec secondary
text `#858397` (3.4–3.7:1) is kept as `--subtle-foreground` for non-text use, while readable
secondary text uses `--muted-foreground` (`#6B6980`). Warning is `#8A5409`.

### Responsive behaviour

| Width      | Navigation                                                                                                 | Overlays        |
| ---------- | ---------------------------------------------------------------------------------------------------------- | --------------- |
| < 768px    | Bottom navigation with a centre Add action and a More sheet; compact sticky page header; safe-area padding | Bottom sheets   |
| 768–1023px | Icon-rail sidebar                                                                                          | Centered modals |
| 1024px+    | Full sidebar                                                                                               | Centered modals |
| 1440px+    | Full sidebar + optional contextual right panel (`PageContainer aside`)                                     | Centered modals |

`ResponsiveDialog` picks a bottom sheet or modal automatically. Phones use `viewport-fit=cover`
with `pt-safe` / `pb-safe` / `px-safe` utilities.

### Conventions

- Build new screens from `PageContainer` + `PageHeader` + `SectionCard` / `Surface`.
- Show money only through `MoneyDisplay` (Indian digit grouping, true minus sign, screen-reader text).
- Icon-only buttons must use `IconButton` (requires a label). Form fields use `FormField`.
- Filter-style tabs use `SegmentedControl`; real tab panels use `Tabs` + `TabsContent`.
- `cn()` is configured for the custom type scale; do not swap it for a plain `twMerge`.
- Design-preview screens and `features/design-preview/data.ts` are **fictional** and temporary.

### Quality checks run

Layout (no horizontal overflow, no console errors, tap targets ≥ 32px) was verified at 375, 390,
430, 768, 1024 and 1440px on every route, and axe-core (WCAG 2 A/AA + best practices) reports no
violations on all routes at 390px and 1440px.

## Installation

Requires Node.js 20+ (developed on Node 22) and npm.

```bash
npm install
```

## Environment configuration

```bash
cp .env.example .env.local
```

| Variable                 | Description                     |
| ------------------------ | ------------------------------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL       |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon (public) key |

Anything prefixed with `VITE_` is bundled into the browser build. Never put a service-role key or
any other secret in a `VITE_` variable. `.env`, `.env.local` and other `.env.*` files are ignored
by Git; only `.env.example` is tracked.

## Local development

```bash
npm run dev       # start the dev server
npm run preview   # serve the production build locally
```

## Build and test commands

| Command              | Purpose                          |
| -------------------- | -------------------------------- |
| `npm run dev`        | Vite dev server                  |
| `npm run build`      | Typecheck, then production build |
| `npm run preview`    | Preview the production build     |
| `npm run lint`       | ESLint                           |
| `npm run typecheck`  | `tsc -b` (strict)                |
| `npm run test`       | Vitest (single run)              |
| `npm run test:watch` | Vitest in watch mode             |
| `npm run format`     | Prettier                         |

Add shadcn/ui components with the official CLI, for example `npx shadcn@latest add dialog`.
