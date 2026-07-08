# Raah Production — Project Context for Claude Code

> Place this file at the root of the repo as `CLAUDE.md`. Claude Code reads it automatically at the start of every session. Reference it whenever building any part of this project.

---

## What This Project Is

**Raah Production** is a Toronto-based live music and concert production company. This website serves two purposes:

1. **Marketing presence** — showcase upcoming and past shows, lineup info, venue details, and event posters
2. **Direct ticket sales platform** — users discover shows and purchase tickets entirely within the Raah ecosystem (no Eventbrite, no third-party redirects)

The direct ticketing decision is the most important architectural choice. It is why Supabase and Stripe exist in this stack alongside Sanity.

---

## Tech Stack

| Layer | Tool | Purpose |
|---|---|---|
| Framework | Next.js 14 (App Router) | Core application, routing, server components |
| Content CMS | Sanity v3 | Show content — names, descriptions, lineups, posters |
| Transactional DB | Supabase (PostgreSQL) | Orders, ticket inventory, customers |
| Payments | Stripe Checkout | Ticket purchases |
| Email | Resend | Order confirmation emails triggered by Stripe webhook |
| Styling | Tailwind CSS | Utility-first, with custom design tokens |
| Hosting | Vercel | Deployment and CI/CD |

---

## Design System

The aesthetic is **dark luxury** — void blacks with gold and champagne accents. Every UI decision should feel premium, not generic.

### Color Tokens
```css
--void:       #0A0A0A   /* deepest background */
--onyx:       #111111   /* card backgrounds */
--charcoal:   #1A1A1A   /* secondary surfaces */
--border:     #222222   /* default borders */
--gold:       #C9A96E   /* primary accent — CTAs, highlights, labels */
--champagne:  #E8D5B0   /* secondary accent — softer gold moments */
--white:      #FFFFFF
--t1:         #FFFFFF   /* primary text */
--t2:         #888888   /* secondary text */
--t3:         #555555   /* muted text */
--t4:         #333333   /* hint text */
```

### Typography
```
--font-logo:    'Pinyon Script'      → logo only
--font-display: 'Playfair Display'  → headings, artist names, prices
--font-sub:     'Cormorant Garamond'→ subheadings, poster copy
--font-ui:      'Montserrat'        → all UI — buttons, labels, nav, body
```
Google Fonts import:
```
Pinyon Script | Cormorant Garamond:ital,wght@0,300;1,300 | Playfair Display:ital,wght@0,400;0,600;1,400 | Montserrat:wght@300;400;500;600;700
```

### UI Patterns
- Buttons: gold background (`#C9A96E`), void text, `border-radius: 2px`, `letter-spacing: 0.2em`, uppercase Montserrat
- Cards: `--onyx` background, `1px solid rgba(201,169,110,0.18)` border for featured; `1px solid #222` for standard
- Section labels: `9px`, `font-weight: 700`, `letter-spacing: 0.2em`, uppercase, `--t4` color
- Gold gradients: `linear-gradient(to right, var(--gold), transparent)` for decorative rule lines
- Spotlight effects: `radial-gradient(ellipse at top, rgba(201,169,110,0.1) 0%, transparent 70%)`

---

## Pages & Routes

### Public
| Route | Page | Notes |
|---|---|---|
| `/` | Home | Hero, upcoming shows list, past shows |
| `/shows/[slug]` | Show Detail | Full event info, lineup, poster, ticket purchase |
| `/schedule` | Schedule | Full calendar view |
| `/contact` | Contact | Contact form, info, social links |

### Staff (protected)
| Route | Page | Notes |
|---|---|---|
| `/staff` | Dashboard | Orders table, filterable by show |
| `/staff/login` | Login | Email/password, Supabase Auth |
| `/staff/shows/[showId]/attendees` | Attendee List | Door check-in list |
| `/staff/shows/[showId]/tickets` | Ticket Management | Create/edit ticket types per show |

---

## Database Schema (Supabase / PostgreSQL)

### `shows`
```sql
id             uuid primary key default gen_random_uuid()
sanity_id      text unique not null   -- bridges Sanity content to Supabase data
name           text not null
date           timestamptz not null
venue          text not null
capacity       integer
created_at     timestamptz default now()
```

### `ticket_types`
```sql
id             uuid primary key default gen_random_uuid()
show_id        uuid references shows(id) on delete cascade
name           text not null          -- e.g. "General Admission", "VIP"
type_tag       text                   -- 'GA' | 'VIP' | 'early_bird' | 'other'
price          numeric(10,2) not null
quantity_total integer not null
quantity_sold  integer not null default 0
description    text
is_visible     boolean default true   -- controls public visibility
created_at     timestamptz default now()
```

### `orders`
```sql
id                 uuid primary key default gen_random_uuid()
customer_id        uuid references customers(id)
show_id            uuid references shows(id)
status             text default 'pending'  -- 'pending' | 'paid' | 'refunded'
stripe_session_id  text unique
created_at         timestamptz default now()
```

### `order_items`
```sql
id                uuid primary key default gen_random_uuid()
order_id          uuid references orders(id)
ticket_type_id    uuid references ticket_types(id)
quantity          integer not null
price_at_purchase numeric(10,2) not null  -- snapshot of price at time of purchase
```

### `customers`
```sql
id          uuid primary key default gen_random_uuid()
email       text unique not null
first_name  text
last_name   text
created_at  timestamptz default now()
```

### Critical: Atomic Inventory RPC
**Never update `quantity_sold` directly.** Always use a Supabase RPC function to prevent overselling race conditions. The RPC must:
1. Check `quantity_total - quantity_sold >= requested_quantity`
2. Increment `quantity_sold` atomically if available
3. Return an error if not enough inventory
This RPC must be implemented before Stripe integration begins.

---

## Data Flow (Full Purchase Journey)

```
User visits /shows/[slug]
  → Next.js fetches show content from Sanity via GROQ
  → sanity_id used to fetch ticket_types from Supabase

User clicks "Reserve Tickets"
  → Supabase RPC called atomically (reserve inventory)
  → On success: Stripe Checkout Session created
  → User redirected to Stripe hosted checkout

Stripe payment completes
  → Stripe fires webhook to /api/webhooks/stripe
  → Webhook verifies Stripe signature
  → Order written to Supabase (orders + order_items + customer upsert)
  → Status updated to 'paid'
  → Resend triggered: confirmation email sent to customer

User lands on /success page
  → Order confirmed, ticket details shown
```

---

## Content Architecture (Sanity)

Sanity handles all **editorial content** — the things Raah staff update regularly:
- Show name, date, venue, description
- Lineup (artists, roles, set times)
- Event poster image
- Ticket type descriptions (display copy only — not pricing/inventory)

Supabase handles all **transactional data** — the things the system writes:
- Orders and order items
- Customer records
- Ticket inventory (`quantity_sold`)

The `sanity_id` field on the `shows` table is the bridge between the two. When a show page loads, Next.js fetches content from Sanity by slug, then uses `sanity_id` to query Supabase for live ticket availability.

---

## Build Order (Milestones)

### Milestone 1 — Project Scaffold
- Initialize Next.js 14 App Router with TypeScript
- Configure Tailwind with custom design tokens (colors, fonts)
- Set up folder structure: `app/`, `components/`, `lib/`, `sanity/`, `supabase/`
- Import Google Fonts
- Create shared layout with nav and bottom nav

### Milestone 2 — Sanity CMS
- Install and configure Sanity v3
- Define `show` schema: title, slug, date, venue, description, lineup array, poster image
- Write GROQ queries: all upcoming shows, single show by slug
- Set up Sanity client in Next.js (`/lib/sanity.ts`)
- Connect home page and show detail page to live Sanity data

### Milestone 3 — Supabase Setup
- Create all 5 tables per schema above
- Write and test the atomic inventory RPC
- Set up Supabase client helpers for server components (`@supabase/ssr`)
- Seed initial `shows` rows with `sanity_id` values matching Sanity documents
- **Ticket type management UI** — staff can create/edit ticket types per show (do not hardcode)

### Milestone 4 — Stripe Checkout
- Stripe Checkout session creation (`/api/checkout`)
- Session must include: `ticket_type_id`, `show_id`, `quantity`, `price`
- Call atomic RPC before creating the session — fail fast if inventory is gone
- Stripe webhook handler (`/api/webhooks/stripe`) — this is the most complex piece, give it its own PR
- Webhook must verify Stripe signature, write order to Supabase, update status to 'paid'
- Success page (`/success`) and cancel page (`/cancel`)
- Handle free events edge case: if `price === 0`, bypass Stripe

### Milestone 5 — Resend Emails
- Triggered from the Stripe webhook after order is confirmed
- Email template: order confirmation with show details, ticket type, quantity, total
- Use Resend SDK with a Raah-branded HTML template
- Test with Resend's test API key before going live

### Milestone 6 — Frontend Pages
- Home page: hero, upcoming shows list (featured card + regular cards), past shows
- Show detail: hero, meta (date/time/venue), description, poster section, lineup, ticket card
- Schedule page: month-grouped event list
- Contact page: contact info cards, enquiry form, social links
- All pages must match the mobile prototype design exactly

### Milestone 7 — Staff Dashboard
Build order within this milestone:
1. **7-01** — Supabase Auth setup (email/password, single shared staff account)
2. **7-02** — Next.js middleware protecting all `/staff/*` routes
3. **7-03** — `/staff/login` page
4. **7-04** — Main dashboard: orders table with show filter and customer search
5. **7-05** — Inventory summary: sold vs remaining vs revenue per show
6. **7-06** — Attendee list per show (`/staff/shows/[showId]/attendees`)
7. **7-07** — CSV export of attendee list for door check-in
8. **7-08** — Staff logout
9. **#23** — Ticket type management: create, edit, delete ticket tiers per show

---

## Key Rules & Warnings

### Never do this
- **Never update `quantity_sold` directly** — only via the atomic Supabase RPC
- **Never hardcode ticket types** — they must be created through the staff dashboard UI
- **Never commit credentials** — all keys go in `.env.local` (Supabase URL/anon key, Stripe secret/webhook secret, Resend API key)
- **Never skip Stripe signature verification** in the webhook handler

### Always do this
- **Verify the Stripe webhook signature** on every incoming event before processing
- **Use `sanity_id`** to link Sanity show documents to Supabase show rows
- **Use server components** for data fetching wherever possible (Next.js App Router)
- **Use `price_at_purchase`** in `order_items` — never recalculate price from `ticket_types` after the fact
- **Check `is_visible`** when rendering ticket types on the public show detail page

### Staff dashboard scope (deliberately limited)
The staff dashboard is intentionally minimal. Do not add:
- Show creation or editing (that's Sanity Studio)
- Refund processing (that's Stripe's dashboard)
- Multi-user roles or permissions (a shared login is sufficient for Raah's team size)

---

## Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # server-only, webhook use

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=               # server-only
STRIPE_WEBHOOK_SECRET=           # server-only, verify webhook signatures

RESEND_API_KEY=                  # server-only

NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=                # server-only, for mutations if needed
```

---

## Folder Structure (Target)

```
/
├── app/
│   ├── layout.tsx                 # root layout, fonts, nav
│   ├── page.tsx                   # home page
│   ├── shows/
│   │   └── [slug]/page.tsx        # show detail
│   ├── schedule/page.tsx
│   ├── contact/page.tsx
│   ├── staff/
│   │   ├── layout.tsx             # staff layout (auth check)
│   │   ├── page.tsx               # orders dashboard
│   │   ├── login/page.tsx
│   │   └── shows/[showId]/
│   │       ├── attendees/page.tsx
│   │       └── tickets/page.tsx   # ticket type management
│   ├── api/
│   │   ├── checkout/route.ts      # create Stripe session
│   │   └── webhooks/
│   │       └── stripe/route.ts    # Stripe webhook handler
│   ├── success/page.tsx
│   └── cancel/page.tsx
├── components/
│   ├── ui/                        # shared UI: Button, Badge, Card
│   ├── shows/                     # ShowCard, FeaturedCard, ShowDetail
│   ├── tickets/                   # TicketCard, QuantitySelector
│   └── staff/                     # OrdersTable, InventorySummary, AttendeeList
├── lib/
│   ├── sanity.ts                  # Sanity client + GROQ queries
│   ├── supabase/
│   │   ├── client.ts              # browser client
│   │   └── server.ts              # server client (SSR)
│   └── stripe.ts                  # Stripe client
├── sanity/
│   └── schemas/
│       └── show.ts                # Sanity show schema
├── middleware.ts                  # protects /staff/* routes
├── .env.local                     # never commit
└── CLAUDE.md                      # this file
```

---

## Reference: Mobile Prototype

A full mobile prototype (`raah-full-prototype.html`) exists in the project files. It shows the exact visual design for all four public pages: Home, Show Detail, Schedule, and Contact. When building frontend components, match this prototype precisely — layout, spacing, typography scale, colors, and interaction patterns (card hover states, bottom nav active states, etc.).

Key prototype details:
- Phone viewport: 393px wide
- Bottom navigation: Shows / Schedule / Contact
- Featured show card has a taller visual area with a glow effect and "Selling Fast" badge
- Regular show cards use a date strip on the left (month/day/weekday)
- Show detail includes: hero, meta row, description, official poster section, lineup list, ticket card
- Ticket card has a wave rule divider, large price display, and two CTAs (Reserve + Add to Calendar)
