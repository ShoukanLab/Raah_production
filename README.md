# Raah Production

Marketing site for Raah Production, a Toronto-based live music and concert production company — Next.js 14, Sanity v3, Supabase, Resend.

Show content (details, lineups, posters) is managed in an embedded Sanity Studio at `/studio`. Ticket purchases currently route to an external ticketing link per show (`ExternalTicketButton`) rather than an in-house checkout.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| CMS | Sanity v3 (embedded studio at `/studio`) |
| Database | Supabase (PostgreSQL) — show records, linked to Sanity via `sanity_id` |
| Email | Resend — contact form notifications |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Tests | Vitest |

---

## Pages & Routes

| Route | Purpose |
|---|---|
| `/` | Home |
| `/shows` | Show listings |
| `/shows/[slug]` | Show detail — lineup, poster, external ticket link |
| `/contact` | Contact form (sends via Resend) |
| `/studio` | Embedded Sanity Studio (content editing) |
| `/api/contact` | Contact form submission handler |
| `/api/sanity/revalidate` | On-demand ISR revalidation webhook from Sanity |

---

## Local Development

### 1. Clone & install

```bash
git clone <repo-url> raah-production
cd raah-production
npm install
```

### 2. Environment variables

Copy the example file and fill in each value:

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity dashboard → Project settings |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` (default) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | e.g. `2024-01-01` |
| `SANITY_API_TOKEN` | Sanity dashboard → API → Tokens (read access) |
| `SANITY_WEBHOOK_SECRET` | Set when configuring the revalidation webhook |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Project Settings → API (server-only, keep secret) |
| `RESEND_API_KEY` | Resend dashboard → API Keys |
| `RESEND_FROM_EMAIL` | A verified sender address in Resend |
| `RESEND_FROM_NAME` | Display name for outgoing emails |
| `CONTACT_TO_EMAIL` | Inbox that receives contact form submissions |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` in development |

### 3. Supabase — run the schema

1. Open your Supabase project → SQL Editor → New query
2. Paste the contents of `database/schema.sql` and run it

Ongoing schema changes after the baseline are tracked as migrations in `supabase/migrations/`.

### 4. Sanity — content schema

The Show schema lives in `sanity/schemaTypes/show.ts` (plus `contactInfo.ts` for contact page content). The studio runs embedded inside the Next.js app — no separate deployment or dev server needed.

### 5. Start the dev server

```bash
npm run dev
# → http://localhost:3000
# Studio → http://localhost:3000/studio
```

---

## Project Structure

```
raah-production/
├── app/
│   ├── layout.tsx                     Root layout (fonts, metadata)
│   ├── page.tsx                       Home page
│   ├── sitemap.ts / robots.ts         SEO
│   ├── (pages)/
│   │   ├── shows/                     Show listing
│   │   ├── shows/[slug]/              Show detail page
│   │   └── contact/                   Contact page
│   ├── studio/[[...tool]]/            Embedded Sanity Studio
│   └── api/
│       ├── contact/route.ts           Contact form → Resend
│       └── sanity/revalidate/route.ts On-demand ISR revalidation
├── components/
│   ├── nav/                           Navigation
│   ├── layout/                        Shared layout pieces
│   ├── cards/                         Show card components
│   ├── shows/                         Show detail components (tickets, calendar)
│   ├── checkout/                      Add-to-calendar helper
│   ├── forms/                         Contact form
│   ├── about/                         About page content
│   └── ui/                            Shared primitives
├── lib/
│   ├── sanity/                        Sanity client, queries, image builder
│   ├── supabase/                      Supabase browser + server clients
│   ├── resend.ts                      Resend client + email helpers
│   ├── showStatus.ts                  Show status label mapping
│   └── cn.ts                          classnames helper
├── types/
│   ├── database.ts                    Supabase table types
│   └── sanity.ts                      Sanity document types
├── sanity/
│   ├── sanity.config.ts               Sanity Studio configuration
│   └── schemaTypes/                   show.ts, contactInfo.ts, index.ts
├── supabase/
│   └── migrations/                    Incremental schema migrations
├── middleware.ts                      Supabase auth session refresh
└── database/
    └── schema.sql                     Supabase DDL (baseline)
```

---

## Design Tokens

```
Void       #0A0A0A   (page background)
Onyx       #111111   (card backgrounds)
Charcoal   #1A1A1A   (input backgrounds, dividers)
Border     #222222   (default borders)
Gold       #C9A96E   (primary accent)
Champagne  #E8D5B0   (secondary accent)
```

**Fonts** (loaded via Google Fonts):

| Role | Font |
|---|---|
| Logo | Pinyon Script |
| Headings, artist names, prices | Playfair Display |
| Subheadings, poster copy | Cormorant Garamond |
| UI — nav, buttons, labels, body | Montserrat |

---

## Deployment (Vercel)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full step-by-step guide. In short:

1. Push to GitHub, import the repo in Vercel (production branch `main`)
2. Add all environment variables from `.env.example`
3. Register the Sanity revalidation webhook:
   - Endpoint: `https://yourdomain.com/api/sanity/revalidate`
   - Filter: `_type == "show"`
   - Secret: `SANITY_WEBHOOK_SECRET`

---

## Scripts

```bash
npm run dev          # Next.js dev server (port 3000), studio at /studio
npm run build        # Production build
npm run start        # Run production build locally
npm run lint         # ESLint
npm run type-check   # TypeScript (no emit)
npm test             # Vitest
```
