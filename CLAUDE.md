# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Quick Commands

### Development
```bash
npm run dev              # Start Next.js dev server (http://localhost:3000)
npm run sanity          # Start Sanity Studio (http://localhost:3333)
```

### Build & Deploy
```bash
npm run build           # Production build
npm run start           # Run production build locally (test before deploying)
```

### Validation
```bash
npm run lint            # ESLint
npm run type-check      # TypeScript type checking (no emit)
```

### Testing
No test suite is currently configured. When adding tests, use:
- **Unit/integration**: Jest or Vitest
- **E2E tests**: Playwright for critical user flows

---

## Architecture Overview

### Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (strict mode) |
| CMS | Sanity v3 |
| Database | Supabase (PostgreSQL) with RLS policies |
| Payments | Stripe |
| Email | Resend |
| Styling | Tailwind CSS + custom design tokens |

### Directory Structure

**`app/`** — Next.js App Router (RSC-first)
- `layout.tsx` — Root layout with metadata
- `page.tsx` — Home page
- `(pages)/` — Grouped routes (shows, schedule, contact, [show-detail])
- `api/` — Route handlers
  - `webhooks/` — Stripe and Resend webhook handlers
  - `sanity/revalidate` — ISR revalidation on CMS changes

**`lib/`** — Client initialization & helpers
- `sanity.ts` — Sanity client + `urlFor()` image URL helper
- `supabase.ts` — Supabase clients (browser `anon` + server-only `admin`)
- `stripe.ts` — Stripe client + webhook verification
- `resend.ts` — Resend email client

**`components/`** — React components
- `nav/` — Navigation components
- `cards/` — Show and artist card components
- `forms/` — Checkout and contact forms
- `ui/` — Shared primitives (Button, Input, etc.)

**`types/`** — TypeScript type definitions
- `database.ts` — Supabase table types (auto-generated, keep in sync with schema)
- `sanity.ts` — Sanity document types

**`sanity/`** — CMS configuration
- `sanity.config.ts` — Studio configuration
- `schemaTypes/show.ts` — Show document schema

**`styles/`** — Global styles
- `globals.css` — Tailwind directives + design tokens

**`database/`** — Database schema
- `schema.sql` — Supabase DDL (run once at `npx supabase db push`)

### Design Tokens

Brand colors (Tailwind classes):
- `bg-void` / `text-void`: #0A0A0A (page background)
- `bg-onyx` / `text-onyx`: #111111 (card backgrounds)
- `bg-charcoal` / `text-charcoal`: #1A1A1A (inputs, dividers)
- `text-gold`: #C9A96E (primary accent)
- `text-champagne`: #E8D5B0 (body text)

Fonts (via Google Fonts in `globals.css`):
- `font-pinyon` — Pinyon Script (logo, display)
- `font-playfair` — Playfair Display (h1–h3)
- `font-cormorant` — Cormorant Garamond (h4–h6)
- `font-montserrat` — Montserrat (UI, body)

---

## Key Patterns

### Environment Variables

Required vars (see `.env.local.example`):
- `NEXT_PUBLIC_SANITY_PROJECT_ID` — Sanity project ID
- `SANITY_API_TOKEN` — Sanity write token (server-only)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key (respects RLS)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase admin key (server-only, bypasses RLS)
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe keys
- `STRIPE_WEBHOOK_SECRET` — Stripe CLI webhook signing secret
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` — Resend email service
- `NEXT_PUBLIC_APP_URL` — App domain (for webhooks and redirects)

All required vars throw on startup if missing (see `lib/sanity.ts`, `lib/supabase.ts`).

### Supabase Client Usage

Two clients are available:

**Browser/RSC context** — uses anon key, respects RLS policies:
```typescript
import { supabase } from '@/lib/supabase'
// Safe in Server Components, Browser Components, and Client Components

const { data } = await supabase.from('shows').select('*')
```

**Server-only** — uses service role key, bypasses RLS:
```typescript
// Only in Server Actions and API routes
import { createAdminClient } from '@/lib/supabase'

const admin = createAdminClient()
const { data } = await admin.from('shows').insert({ /* ... */ })
```

Attempting to import `createAdminClient` in a Client Component will cause an error.

### Data Model

**Shows** — Synced from Sanity (primary source of truth)
- `id`, `sanity_id`, `name`, `slug`, `date`, `doors_open`, `venue_name`, `venue_address`, `city`, `capacity`, `description`, `poster_url`
- `status`: `draft | on_sale | sold_out | cancelled | completed`

**Ticket Types** — Associated with shows
- `id`, `show_id`, `name`, `price_pence`, `quantity`, `quantity_sold`, `sale_starts_at`, `sale_ends_at`

**Orders** — Store Stripe payment records
- RLS policy: users can only query their own orders

Types are auto-generated in `types/database.ts`. Regenerate after schema changes with:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
```

### Webhook Handlers

**Stripe** (`app/api/webhooks/stripe/route.ts`)
- Verifies webhook signature with `STRIPE_WEBHOOK_SECRET`
- Handles: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
- Should upsert orders in Supabase and send confirmation emails via Resend

**Resend** (`app/api/webhooks/resend/route.ts`)
- Logs email delivery events and bounces

**Sanity Revalidation** (`app/api/sanity/revalidate/route.ts`)
- Triggered on CMS document publish/unpublish
- Revalidates ISR cache for affected pages

---

## Development Notes

### TypeScript Path Aliases

All imports use `@/` prefix (configured in `tsconfig.json`):
```typescript
import { sanityClient } from '@/lib/sanity'
import type { Database } from '@/types/database'
```

### Styling

Tailwind is the primary styling approach. Custom design tokens are defined in `globals.css` as CSS variables and exported as Tailwind classes. Avoid inline styles.

### Metadata & SEO

Root metadata is set in `app/layout.tsx`. Use Next.js `generateMetadata()` in page files to override for specific routes.

### ISR Revalidation

Use Next.js on-demand ISR when Sanity content changes:
```typescript
// In Server Component
import { revalidatePath } from 'next/cache'

await revalidatePath('/shows')
```

The Sanity webhook automatically triggers this for show documents.

### Image Handling

Use Sanity's `urlFor()` helper to construct image URLs:
```typescript
import { urlFor } from '@/lib/sanity'

const imageUrl = urlFor(show.posterUrl).width(400).url()
```

---

## Before You Start

- **Check `.env.local.example`** — Ensure all required env vars are set
- **Run type-check** — `npm run type-check` catches many issues early
- **Review schema files** — `types/database.ts` and `sanity/schemaTypes/show.ts` define the data model
- **Understand RLS** — Supabase uses Row-Level Security; queries from the browser client respect policies
