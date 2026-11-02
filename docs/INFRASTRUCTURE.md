# Bahi infrastructure

How Bahi connects to GitHub and Supabase, and how to work with both day to day.

## Architecture at a glance

- **Frontend:** React + Vite, runs entirely in the browser.
- **Backend:** Supabase (Postgres, Auth). The browser talks to it directly with the
  **publishable/anon key**; every table must be protected by Row Level Security (RLS).
- **Source of truth for the schema:** SQL files in `supabase/migrations/`.
- **Secrets:** none live in the repository. The service-role key is never used by the frontend.

## Environment variables

Defined in `.env.local` (git-ignored). `.env.example` is the tracked template.

| Variable                 | Required | Notes                                                                            |
| ------------------------ | -------- | -------------------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`      | yes      | `https://<project-ref>.supabase.co`. `http://` is accepted only for `localhost`. |
| `VITE_SUPABASE_ANON_KEY` | yes      | Publishable key (`sb_publishable_…`) or legacy `anon` JWT. Both are public.      |

Find both in the Supabase dashboard under **Project Settings → API** / **API Keys**.

### Safety rules (enforced in `src/lib/env.ts`)

- Missing or malformed values stop the app at startup with a screen that names the variable.
- A `sb_secret_…` key, a JWT with `role: service_role`, or any `VITE_*SERVICE_ROLE*` variable is
  rejected. Anything prefixed `VITE_` is shipped to every visitor's browser.
- Error messages name variables only; values are never logged or displayed.
- The Supabase client (`src/lib/supabase/client.ts`) is the only place a client is created.

## First-time setup

```bash
npm install
cp .env.example .env.local      # then fill in the two values
npm run check:supabase          # verify connectivity
npm run dev
```

`npm run check:supabase` (temporary) validates the URL, initialises the client, and calls the Auth
health and settings endpoints. It reads no tables and never prints the key.

## Supabase CLI

The CLI is a dev dependency, so everyone runs the same version: use `npx supabase …` (or the
`npm run db:*` shortcuts). Docker is only needed for a local database (`npx supabase start`), which
is optional.

One-time link to the remote project (interactive; run these yourself):

```bash
npx supabase login                          # opens a browser to authenticate
npx supabase link --project-ref <ref>       # <ref> is the subdomain of your project URL
```

`link` prompts for the database password if it needs one. Do not paste it into chat, scripts or
files. `supabase/.temp/` (where link state is stored) is git-ignored.

`supabase/config.toml` configures the **local** stack only. Hosted-project auth settings
(site URL, redirect URLs, email confirmation, password length) are set in the dashboard under
**Authentication → URL Configuration / Sign In-Up**, or pushed with `npx supabase config push`.

For hosted auth, set:

- Site URL: your production URL (use `http://localhost:5173` while developing).
- Redirect URLs: `http://localhost:5173/**` plus your production and preview URLs.

## Migration workflow

Migrations are the only way schema changes reach the database. Do not edit tables in the dashboard
SQL editor for anything that should persist.

```bash
npm run db:new add_profiles          # creates supabase/migrations/<timestamp>_add_profiles.sql
# write the SQL, including RLS policies for every new table
npm run db:push                      # applies pending migrations to the linked project
npm run db:types                     # regenerates src/lib/supabase/database.types.ts
```

Then replace the temporary `Database` interface in `src/lib/supabase/types.ts` with
`export type { Database, Json } from './database.types'` (the file explains this). Commit the
migration and the regenerated types together.

Rules:

1. Never edit a migration that has been pushed; add a new one.
2. Every table in `public` gets `alter table … enable row level security` and explicit policies.
3. Review the SQL before `db:push`; use `npx supabase db push --dry-run` to preview.

## Authentication layer

- `src/features/auth/services/auth.service.ts` — `signUp`, `signIn`, `signOut`, `getSession`,
  `getCurrentUser`, `resetPassword`. Failures throw `AuthServiceError` with a stable `code` and a
  user-safe message; the provider's raw message is never shown.
- `src/features/auth/AuthProvider.tsx` — central state: loads the persisted session, follows auth
  events (sign-in/out, token refresh, other tabs) and exposes loading and error state.
- `src/features/auth/hooks/useAuth.ts` — `const { status, user, session, error, signIn, … } = useAuth()`.
  Actions return `{ ok: true, data } | { ok: false, error }` rather than throwing.
- Sessions persist in `localStorage` under `bahi-auth` and refresh automatically.
- `getCurrentUser()` verifies with the Auth server; use it (not `session.user`) for anything
  security-sensitive.
- Password reset emails link to `/reset-password`, which does not exist yet (login UI is not built).

## Git and GitHub

- `main` is the production branch. Feature work happens on `type/short-name` branches merged by
  pull request.
- Commit format: `feat:`, `fix:`, `chore:`, `docs:`, `test:`.
- Nothing is pushed automatically. Add the remote once, then push deliberately:

```bash
git remote add origin https://github.com/<owner>/<repo>.git
git push -u origin main
```

Recommended repository settings after the first push: default branch `main`; branch protection
requiring a pull request and passing checks; GitHub secret scanning and push protection enabled.

## Local development

```bash
npm run dev              # http://localhost:5173
npm run typecheck && npm run lint && npm run test && npm run build
```

Tests use dummy Supabase values from `vitest.config.ts` and never contact a real project.

## Rotating credentials

If a key leaks, rotate it in the dashboard (**Project Settings → API Keys**), update `.env.local`,
and redeploy. The anon/publishable key is designed to be public, but it is only safe because RLS
is on for every table.
