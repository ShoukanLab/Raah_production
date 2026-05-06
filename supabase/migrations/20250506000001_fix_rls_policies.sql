-- Drop overly permissive authenticated policies from customers, orders, and order_items
-- These tables should only be accessible via service role key (which bypasses RLS entirely)
-- By removing all policies, anonymous users will be denied, while service role will work

DROP POLICY IF EXISTS "customers_allow_authenticated_read" ON customers;
DROP POLICY IF EXISTS "customers_allow_authenticated_insert" ON customers;
DROP POLICY IF EXISTS "orders_allow_authenticated_read" ON orders;
DROP POLICY IF EXISTS "orders_allow_authenticated_insert" ON orders;
DROP POLICY IF EXISTS "order_items_allow_authenticated_read" ON order_items;
DROP POLICY IF EXISTS "order_items_allow_authenticated_insert" ON order_items;

-- Verify final policy state for shows (public read-only)
-- Policy: shows_allow_public_read already exists and is correct

-- Verify final policy state for ticket_types (public read only visible)
-- Policy: ticket_types_allow_public_read_visible already exists and is correct

-- Note: customers, orders, and order_items now have RLS enabled but NO policies
-- This means:
-- - Anonymous (anon key) users: DENIED on all operations
-- - Service role key: BYPASSES RLS and can read/write freely (default Supabase behavior)
-- - Authenticated users: DENIED on all operations (cannot access these tables)
