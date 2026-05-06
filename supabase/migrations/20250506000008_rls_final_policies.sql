-- Final RLS policies with proper security rules
-- Drop the permissive test policies
DROP POLICY IF EXISTS "shows_permissive" ON shows;
DROP POLICY IF EXISTS "ticket_types_permissive" ON ticket_types;
DROP POLICY IF EXISTS "customers_permissive" ON customers;
DROP POLICY IF EXISTS "orders_permissive" ON orders;
DROP POLICY IF EXISTS "order_items_permissive" ON order_items;

-- SHOWS TABLE: Public read-only
CREATE POLICY "shows_allow_public_read" ON shows
  FOR SELECT
  USING (true);

-- TICKET_TYPES TABLE: Public read for visible items only
CREATE POLICY "ticket_types_allow_public_read" ON ticket_types
  FOR SELECT
  USING (is_visible = true);

-- CUSTOMERS TABLE: Service role only (full access)
CREATE POLICY "customers_allow_service_role_select" ON customers
  FOR SELECT
  USING (
    (current_setting('request.jwt.claims'::text)::json->>'role') = 'service_role'
  );

CREATE POLICY "customers_allow_service_role_insert" ON customers
  FOR INSERT
  WITH CHECK (
    (current_setting('request.jwt.claims'::text)::json->>'role') = 'service_role'
  );

CREATE POLICY "customers_allow_service_role_update" ON customers
  FOR UPDATE
  USING (
    (current_setting('request.jwt.claims'::text)::json->>'role') = 'service_role'
  );

CREATE POLICY "customers_allow_service_role_delete" ON customers
  FOR DELETE
  USING (
    (current_setting('request.jwt.claims'::text)::json->>'role') = 'service_role'
  );

-- ORDERS TABLE: Service role only (full access)
CREATE POLICY "orders_allow_service_role_select" ON orders
  FOR SELECT
  USING (
    (current_setting('request.jwt.claims'::text)::json->>'role') = 'service_role'
  );

CREATE POLICY "orders_allow_service_role_insert" ON orders
  FOR INSERT
  WITH CHECK (
    (current_setting('request.jwt.claims'::text)::json->>'role') = 'service_role'
  );

CREATE POLICY "orders_allow_service_role_update" ON orders
  FOR UPDATE
  USING (
    (current_setting('request.jwt.claims'::text)::json->>'role') = 'service_role'
  );

CREATE POLICY "orders_allow_service_role_delete" ON orders
  FOR DELETE
  USING (
    (current_setting('request.jwt.claims'::text)::json->>'role') = 'service_role'
  );

-- ORDER_ITEMS TABLE: Service role only (full access)
CREATE POLICY "order_items_allow_service_role_select" ON order_items
  FOR SELECT
  USING (
    (current_setting('request.jwt.claims'::text)::json->>'role') = 'service_role'
  );

CREATE POLICY "order_items_allow_service_role_insert" ON order_items
  FOR INSERT
  WITH CHECK (
    (current_setting('request.jwt.claims'::text)::json->>'role') = 'service_role'
  );

CREATE POLICY "order_items_allow_service_role_update" ON order_items
  FOR UPDATE
  USING (
    (current_setting('request.jwt.claims'::text)::json->>'role') = 'service_role'
  );

CREATE POLICY "order_items_allow_service_role_delete" ON order_items
  FOR DELETE
  USING (
    (current_setting('request.jwt.claims'::text)::json->>'role') = 'service_role'
  );
