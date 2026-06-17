# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A product reviews app: a React client lists products, and for a selected product shows its reviews plus an
AI-generated summary (OpenAI) of those reviews, cached in Postgres for 7 days. Bun workspace monorepo with
`packages/client` (Vite + React) and `packages/server` (Express + Prisma).

## Commands

Package manager is **bun** everywhere (not npm/yarn) — `bun.lock` is the lockfile.

```bash
bun install                  # installs all workspaces from repo root
docker-compose up -d         # starts the Postgres container (needs root .env, see below)
bun run dev                  # root: runs server + client dev servers concurrently (via index.ts/concurrently)
bun run format               # root: prettier --write . across the whole repo
```

Per-package:

```bash
cd packages/server && bun run dev      # bun --watch run index.ts (port 3000)
cd packages/server && bunx prisma generate   # regenerate the Prisma client (required after clone/schema change, see gotcha below)
cd packages/server && bunx prisma migrate dev  # create/apply a migration
cd packages/server && node_modules/.bin/tsc --noEmit -p tsconfig.json   # typecheck (no script defined)

cd packages/client && bun run dev      # vite dev server
cd packages/client && bun run lint     # eslint .
cd packages/client && bun run build    # tsc -b && vite build (also serves as typecheck)
```

There is no test suite in this repo yet.

A Husky pre-commit hook runs `lint-staged`, which runs `eslint --fix` on staged `packages/client/**/*.{ts,tsx}`
files only (server has no ESLint config, so it's excluded). Because bun workspaces don't hoist binaries to the
root `node_modules/.bin`, the lint-staged command in the root `package.json` points directly at
`packages/client/node_modules/.bin/eslint` with an explicit `--config packages/client/eslint.config.js`.

## Environment files

Two separate `.env` files are required, each with its own `.env.example`:

- **root `.env`** — `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` (consumed by `docker-compose.yml`); also
  declares `BACKEND_PORT`/`FRONTEND_PORT` which aren't currently read anywhere in code (server port 3000 and the
  Vite client port are not parameterized by them).
- **`packages/server/.env`** — `DATABASE_URL` (used by `prisma.config.ts` and `repository/prisma.ts`) and
  `OPENAI_API_KEY` (used by `service/ai.service.ts`).

## Architecture

### Server (`packages/server`)

Layered, each layer importing only the one below it:

```
routes.ts → controller/*.controller.ts → service/*.service.ts → repository/*.repository.ts → repository/prisma.ts
```

- `routes.ts` is the single place all Express routes are registered/exposed; add new endpoints here.
- Controllers parse/validate `req.params`/`req.body` with **Zod** (`z.coerce.number()` for numeric path params) and
  return early with `400` on `safeParse` failure. They never touch Prisma directly.
- Services hold business logic (e.g. `review.service.ts` decides whether to reuse a cached AI summary or generate
  a new one); repositories are thin Prisma wrappers.
- Errors: throw `error/NotFoundError.ts` from a service to get a `404`; anything else falls through to the
  catch-all error middleware in `index.ts`, which returns `500`.
- Prisma uses the **driver adapter** pattern (`@prisma/adapter-pg`), not the default query engine — see
  `repository/prisma.ts`. The Prisma client is generated to a **custom path**, `generated/prisma/`, not
  `node_modules/.prisma`; that directory is gitignored (`packages/server/.gitignore`), so **run
  `bunx prisma generate` after cloning or changing `prisma/schema.prisma`** or imports like
  `from '../generated/prisma/client'` will fail.
- AI summaries (`service/ai.service.ts` + `repository/summary.repository.ts`): a summary is generated via OpenAI
  from up to the 10 most recent reviews using the prompt template in `prompts/summarize-reviews.txt`, then
  persisted with a 7-day `expiresAt` (via `dayjs`) and upserted per `productId`. Subsequent requests reuse the
  cached summary until it expires.

### Client (`packages/client`)

- Data fetching is via **TanStack Query** (`useQuery`/`useMutation`); there is no global client-state store.
  Axios calls live in colocated `*Api.ts` files per feature (e.g. `src/components/products/productsApi.ts`).
- There is **no router**. `App.tsx` is a single component that toggles between the products page and the
  reviews page using local `useState` (`selectedProductId`); "navigation" is just conditional rendering.
- The Vite dev server proxies `/api` to `http://localhost:3000` (`vite.config.ts`) — the server URL is hardcoded
  there, not driven by an env var.
- **Path alias gotcha**: `@` resolves to the **client package root**, not `src/` (see `vite.config.ts` /
  `tsconfig.app.json`: `"@/*": ["./*"]`). shadcn's `components.json` aliases `ui` to `@/components/ui`, which is
  the root-level `packages/client/components/ui/` directory — **not** `src/components/ui/`. The latter contains
  a stray unused duplicate of `button.tsx`; the real, imported one is at `packages/client/components/ui/`.
- UI primitives under `components/ui/` are hand-written shadcn-style components (`button.tsx`, `table.tsx`,
  `dialog.tsx`), built on the `radix-ui` unified package (e.g. `import { Dialog as DialogPrimitive } from 'radix-ui'`)
  and `class-variance-authority` for variants, styled with Tailwind v4 CSS-variable theme tokens defined in
  `src/index.css` (`bg-muted`, `text-primary`, etc.) — there's no `tailwind.config.js`.
- The app is **dark-only by design** — `src/index.css` `:root` holds dark values directly (near-black
  `--background`, vivid violet `--primary`) and there is no light-mode `:root`/`.dark` pair to toggle; the
  `@custom-variant dark` line is unused scaffolding kept for shadcn compatibility. Brand accent colors beyond the
  semantic shadcn tokens are exposed as `--accent-purple`/`--accent-red`/`--accent-yellow` (mapped to
  `bg-accent-purple` etc. via `@theme inline`) and used for things like star ratings, price badges, and the AI
  summary panel. Headings/brand text use the **`font-heading`** utility (`Unbounded`, loaded from Google Fonts in
  `index.css`); body text uses **`font-sans`** (`Plus Jakarta Sans`, also Google Fonts) — the previously-installed
  `@fontsource-variable/figtree` package is no longer imported.
- `components.json` declares `iconLibrary: "hugeicons"`, but in practice all icons used in the code come from
  **`react-icons`** (`react-icons/hi2`, `react-icons/fa`) — follow the existing code, not the config field.
- Feature folders under `src/components/<feature>/` follow a consistent shape: `<feature>Api.ts` (axios calls +
  types), a `*Skeleton.tsx` loading state, and the feature components themselves (see `reviews/` and `products/`
  for the pattern to copy).
- `react-refresh/only-export-components` will flag files (like `button.tsx`) that export a non-component
  alongside a component (e.g. `cva()` variants); the project's convention is an inline
  `// eslint-disable-next-line react-refresh/only-export-components` rather than splitting the file.
