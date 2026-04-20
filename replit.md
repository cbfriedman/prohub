# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### ProHub (`artifacts/prohub`)

Imported from https://github.com/cbfriedman/prohub.git

A PR/media platform built with Next.js 16 (App Router). Standard Next.js structure, fully compatible with Vercel deployment.

**Stack:**
- Next.js 16 (App Router, Turbopack)
- Supabase (auth + database via `@supabase/ssr`)
- Stripe (payments)
- Upstash Redis (rate limiting / caching)
- AI SDK (`ai`, `@ai-sdk/react`)
- Tailwind CSS v4 + shadcn/ui
- Zustand (state management)

**Required environment variables** (must be set before the app is functional):
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase public anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-side)
- `STRIPE_SECRET_KEY` — Stripe secret key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `UPSTASH_REDIS_REST_URL` — Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN` — Upstash Redis REST token
- AI provider key (e.g. `OPENAI_API_KEY`)

**Notes:**
- Scripts (`next dev`, `next build`, `next start`) are standard and unmodified — Vercel-ready
- Replit binds the server to `0.0.0.0` via the `HOSTNAME` env var in `artifact.toml`, not in the script
- `allowedDevOrigins` in `next.config.mjs` is conditional on `REPL_ID` — only active inside Replit
