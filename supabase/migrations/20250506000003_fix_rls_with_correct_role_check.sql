-- Drop incorrect policies and replace with correct role checks
-- The issue with the previous migrations is that auth.role() doesn't properly
-- recognize the service_role key in Supabase. We need to use the TO clause instead.
DROP POLICY IF EXISTS "shows_allow_service_role_all" ON shows;
DROP POLICY IF EXISTS "ticket_types_allow_service_role_all" ON ticket_types;
DROP POLICY IF EXISTS "customers_allow_service_role_all" ON customers;
DROP POLICY IF EXISTS "orders_allow_service_role_all" ON orders;
DROP POLICY IF EXISTS "order_items_allow_service_role_all" ON order_items;

-- For shows: Allow public read (already exists), and service_role full access
CREATE POLICY "shows_allow_service_role_access" ON shows
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- For ticket_types: Allow public read for visible items (already exists), and service_role full access
CREATE POLICY "ticket_types_allow_service_role_access" ON ticket_types
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- For customers: Service role only (no public access)
CREATE POLICY "customers_allow_service_role_access" ON customers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- For orders: Service role only (no public access)
CREATE POLICY "orders_allow_service_role_access" ON orders
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- For order_items: Service role only (no public access)
CREATE POLICY "order_items_allow_service_role_access" ON order_items
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
