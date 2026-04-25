# Raah Production

Premium live music experiences platform — Next.js 14, Sanity v3, Supabase, Stripe, Resend.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| CMS | Sanity v3 |
| Database | Supabase (PostgreSQL) |
| Payments | Stripe |
| Email | Resend |
| Styling | Tailwind CSS |
| Language | TypeScript |

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
cp .env.local.example .env.local
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity dashboard → Project settings |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` (default) |
| `SANITY_API_TOKEN` | Sanity dashboard → API → Tokens (Editor or Write access) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Project Settings → API (keep secret!) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe dashboard → Developers → API keys |
| `STRIPE_SECRET_KEY` | Stripe dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | See Stripe webhooks setup below |
| `RESEND_API_KEY` | Resend dashboard → API Keys |
| `RESEND_FROM_EMAIL` | A verified sender address in Resend |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` in development |

### 3. Supabase — run the schema

1. Open your Supabase project → SQL Editor → New query
2. Paste the contents of `database/schema.sql` and run it
3. All tables, RLS policies, indexes, and triggers will be created

### 4. Sanity — initialise the studio

If this is a brand-new Sanity project:

```bash
# From the project root
npx sanity init --project <YOUR_PROJECT_ID> --dataset production
```

Then start the embedded studio (runs at `http://localhost:3333`):

```bash
npm run sanity
```

The Shows schema is already wired up in `sanity/schemaTypes/show.ts`.

### 5. Stripe — local webhook forwarding

Install the Stripe CLI, then forward events to your local server:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret it prints and set it as `STRIPE_WEBHOOK_SECRET` in `.env.local`.

### 6. Start the dev server

```bash
npm run dev
# → http://localhost:3000
```

---

## Project Structure

```
raah-production/
├── app/
│   ├── layout.tsx                  Root layout (fonts, metadata)
│   ├── page.tsx                    Home page
│   ├── (pages)/
│   │   ├── shows/                  Show listings
│   │   ├── schedule/               Calendar view
│   │   ├── contact/                Contact form
│   │   └── [show-detail]/          Dynamic show detail page
│   └── api/
│       ├── webhooks/
│       │   ├── stripe/route.ts     Stripe payment events
│       │   └── resend/route.ts     Email delivery events
│       └── sanity/
│           └── revalidate/route.ts On-demand ISR revalidation
├── components/
│   ├── nav/                        Navigation components
│   ├── cards/                      Show / artist card components
│   ├── forms/                      Checkout, contact forms
│   └── ui/                         Shared primitives (Button, Input…)
├── lib/
│   ├── sanity.ts                   Sanity client + urlFor helper
│   ├── supabase.ts                 Supabase browser + admin clients
│   ├── stripe.ts                   Stripe client + webhook verifier
│   └── resend.ts                   Resend client + email helpers
├── types/
│   ├── database.ts                 Supabase table types (keep in sync)
│   └── sanity.ts                   Sanity document types
├── styles/
│   └── globals.css                 Tailwind + Raah design tokens
├── sanity/
│   ├── sanity.config.ts            Sanity Studio configuration
│   └── schemaTypes/
│       ├── index.ts
│       └── show.ts                 Show document schema
└── database/
    └── schema.sql                  Supabase DDL (run once)
```

---

## Design Tokens

```
Void       #0A0A0A   (page background)
Onyx       #111111   (card backgrounds)
Charcoal   #1A1A1A   (input backgrounds, dividers)
Gold       #C9A96E   (primary accent)
Champagne  #E8D5B0   (body text)
```

**Fonts** (loaded via Google Fonts in `globals.css`):

| Role | Font |
|---|---|
| Logo / display | Pinyon Script |
| Headings (h1–h3) | Playfair Display |
| Sub-headings (h4–h6) | Cormorant Garamond |
| UI / body | Montserrat |

Tailwind classes: `font-pinyon`, `font-playfair`, `font-cormorant`, `font-montserrat`

---

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in Vercel
3. Add all environment variables from `.env.local.example`
4. Set `NEXT_PUBLIC_APP_URL` to your production domain
5. Register the production Stripe webhook:
   - Endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
6. Register the Sanity revalidation webhook:
   - Endpoint: `https://yourdomain.com/api/sanity/revalidate`
   - Filter: `_type == "show"`
   - Secret: add as `SANITY_WEBHOOK_SECRET` env var

---

## Scripts

```bash
npm run dev          # Next.js dev server (port 3000)
npm run build        # Production build
npm run start        # Run production build locally
npm run lint         # ESLint
npm run type-check   # TypeScript (no emit)
npm run sanity       # Sanity Studio dev server (port 3333)
```
