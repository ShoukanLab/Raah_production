-- ─── Raah Production — Supabase Schema ───────────────────────────────────────
-- Run in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- Order matters: parent tables before child tables.

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── Enums ───────────────────────────────────────────────────────────────────

create type show_status as enum (
  'draft',
  'on_sale',
  'sold_out',
  'cancelled',
  'completed'
);

create type order_status as enum (
  'pending',
  'paid',
  'refunded',
  'cancelled'
);

-- ─── Shows ───────────────────────────────────────────────────────────────────

create table if not exists shows (
  id              uuid primary key default gen_random_uuid(),
  sanity_id       text unique,                    -- links to Sanity document _id
  name            text not null,
  slug            text not null unique,
  date            timestamptz not null,
  doors_open      timestamptz,
  venue_name      text not null,
  venue_address   text,
  city            text not null,
  capacity        integer not null check (capacity > 0),
  description     text,
  status          show_status not null default 'draft',
  poster_url      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── Ticket Types ─────────────────────────────────────────────────────────────

create table if not exists ticket_types (
  id              uuid primary key default gen_random_uuid(),
  show_id         uuid not null references shows(id) on delete cascade,
  name            text not null,                  -- e.g. "General Admission", "VIP"
  description     text,
  price_pence     integer not null check (price_pence >= 0),
  quantity        integer not null check (quantity > 0),
  quantity_sold   integer not null default 0 check (quantity_sold >= 0),
  sale_starts_at  timestamptz,
  sale_ends_at    timestamptz,
  created_at      timestamptz not null default now(),
  constraint quantity_check check (quantity_sold <= quantity)
);

-- ─── Customers ───────────────────────────────────────────────────────────────

create table if not exists customers (
  id                  uuid primary key default gen_random_uuid(),
  email               text not null unique,
  first_name          text not null,
  last_name           text not null,
  stripe_customer_id  text unique,
  created_at          timestamptz not null default now()
);

-- ─── Orders ──────────────────────────────────────────────────────────────────

create table if not exists orders (
  id                          uuid primary key default gen_random_uuid(),
  order_number                text not null unique,
  customer_id                 uuid not null references customers(id),
  show_id                     uuid not null references shows(id),
  total_pence                 integer not null check (total_pence >= 0),
  status                      order_status not null default 'pending',
  stripe_payment_intent_id    text unique,
  stripe_charge_id            text unique,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

-- ─── Order Items ─────────────────────────────────────────────────────────────

create table if not exists order_items (
  id                  uuid primary key default gen_random_uuid(),
  order_id            uuid not null references orders(id) on delete cascade,
  ticket_type_id      uuid not null references ticket_types(id),
  quantity            integer not null check (quantity > 0),
  unit_price_pence    integer not null check (unit_price_pence >= 0),
  created_at          timestamptz not null default now()
);

-- ─── Updated-at trigger ──────────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger shows_updated_at
  before update on shows
  for each row execute procedure set_updated_at();

create trigger orders_updated_at
  before update on orders
  for each row execute procedure set_updated_at();

-- ─── Order number generator ──────────────────────────────────────────────────
-- Produces values like RAAH-20240501-00042

create sequence if not exists order_number_seq start 1;

create or replace function generate_order_number()
returns text language plpgsql as $$
declare
  seq_val bigint;
begin
  seq_val := nextval('order_number_seq');
  return 'RAAH-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(seq_val::text, 5, '0');
end;
$$;

-- ─── Row-Level Security ───────────────────────────────────────────────────────

alter table shows         enable row level security;
alter table ticket_types  enable row level security;
alter table customers     enable row level security;
alter table orders        enable row level security;
alter table order_items   enable row level security;

-- Public read: shows that are on sale or completed
create policy "shows: public read on_sale/completed"
  on shows for select
  using (status in ('on_sale', 'sold_out', 'completed'));

-- Public read: ticket types for visible shows
create policy "ticket_types: public read"
  on ticket_types for select
  using (
    exists (
      select 1 from shows s
      where s.id = ticket_types.show_id
        and s.status in ('on_sale', 'sold_out', 'completed')
    )
  );

-- Customers can read/update their own row
create policy "customers: own row"
  on customers for all
  using (id = (select auth.uid()::uuid));

-- Orders: customers see their own
create policy "orders: own row"
  on orders for select
  using (customer_id = (select auth.uid()::uuid));

-- Order items: visible through own orders
create policy "order_items: through own orders"
  on order_items for select
  using (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id
        and o.customer_id = (select auth.uid()::uuid)
    )
  );

-- ─── Indexes ─────────────────────────────────────────────────────────────────

create index if not exists shows_date_idx            on shows(date);
create index if not exists shows_status_idx          on shows(status);
create index if not exists ticket_types_show_idx     on ticket_types(show_id);
create index if not exists orders_customer_idx       on orders(customer_id);
create index if not exists orders_show_idx           on orders(show_id);
create index if not exists order_items_order_idx     on order_items(order_id);
