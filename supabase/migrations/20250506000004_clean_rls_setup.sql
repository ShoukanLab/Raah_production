-- Clean up all existing policies and set them up correctly
-- This migration ensures all tables have the correct RLS policies

-- Drop all existing policies (if any)
DROP POLICY IF EXISTS "shows_allow_public_read" ON shows;
DROP POLICY IF EXISTS "shows_allow_service_role_access" ON shows;
DROP POLICY IF EXISTS "shows_allow_service_role_all" ON shows;

DROP POLICY IF EXISTS "ticket_types_allow_public_read_visible" ON ticket_types;
DROP POLICY IF EXISTS "ticket_types_allow_service_role_access" ON ticket_types;
DROP POLICY IF EXISTS "ticket_types_allow_service_role_all" ON ticket_types;

DROP POLICY IF EXISTS "customers_allow_authenticated_read" ON customers;
DROP POLICY IF EXISTS "customers_allow_authenticated_insert" ON customers;
DROP POLICY IF EXISTS "customers_allow_service_role_access" ON customers;
DROP POLICY IF EXISTS "customers_allow_service_role_all" ON customers;

DROP POLICY IF EXISTS "orders_allow_authenticated_read" ON orders;
DROP POLICY IF EXISTS "orders_allow_authenticated_insert" ON orders;
DROP POLICY IF EXISTS "orders_allow_service_role_access" ON orders;
DROP POLICY IF EXISTS "orders_allow_service_role_all" ON orders;

DROP POLICY IF EXISTS "order_items_allow_authenticated_read" ON order_items;
DROP POLICY IF EXISTS "order_items_allow_authenticated_insert" ON order_items;
DROP POLICY IF EXISTS "order_items_allow_service_role_access" ON order_items;
DROP POLICY IF EXISTS "order_items_allow_service_role_all" ON order_items;

-- SHOWS TABLE: Public read, service role full access
-- Allow anyone (anon or authenticated) to SELECT
CREATE POLICY "shows_public_read" ON shows
  FOR SELECT
  TO public, anon, authenticated
  USING (true);

-- Allow service_role to do anything
CREATE POLICY "shows_service_role_all" ON shows
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- TICKET_TYPES TABLE: Public read (only visible), service role full access
-- Allow anyone to SELECT visible items
CREATE POLICY "ticket_types_public_read" ON ticket_types
  FOR SELECT
  TO public, anon, authenticated
  USING (is_visible = true);

-- Allow service_role to do anything
CREATE POLICY "ticket_types_service_role_all" ON ticket_types
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- CUSTOMERS TABLE: Service role only
-- Allow service_role to do anything
CREATE POLICY "customers_service_role_all" ON customers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ORDERS TABLE: Service role only
-- Allow service_role to do anything
CREATE POLICY "orders_service_role_all" ON orders
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ORDER_ITEMS TABLE: Service role only
-- Allow service_role to do anything
CREATE POLICY "order_items_service_role_all" ON order_items
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
