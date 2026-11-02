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
    ui/           shadcn/ui components (added via the shadcn CLI)
    layout/       Page layout components
    shared/       Reusable, feature-agnostic components
  features/       One folder per domain, each with components/ hooks/ services/ types/
    auth/  onboarding/  khata/  split/  portfolio/  recurring/  reports/
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
