-- Drop all existing policies
DROP POLICY IF EXISTS "shows_public_read" ON shows;
DROP POLICY IF EXISTS "shows_service_role_all" ON shows;
DROP POLICY IF EXISTS "ticket_types_public_read" ON ticket_types;
DROP POLICY IF EXISTS "ticket_types_service_role_all" ON ticket_types;
DROP POLICY IF EXISTS "customers_service_role_all" ON customers;
DROP POLICY IF EXISTS "orders_service_role_all" ON orders;
DROP POLICY IF EXISTS "order_items_service_role_all" ON order_items;

-- SHOWS TABLE: Public read only (using JWT role claims)
CREATE POLICY "shows_allow_all_read" ON shows
  FOR SELECT
  USING (true);

-- TICKET_TYPES TABLE: Public read for visible items only
CREATE POLICY "ticket_types_allow_read_visible" ON ticket_types
  FOR SELECT
  USING (is_visible = true);

-- CUSTOMERS TABLE: Service role only
-- Extract role from JWT claims: service_role, authenticated, or anon
CREATE POLICY "customers_allow_service_role_only" ON customers
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

-- ORDERS TABLE: Service role only
CREATE POLICY "orders_allow_service_role_only" ON orders
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

-- ORDER_ITEMS TABLE: Service role only
CREATE POLICY "order_items_allow_service_role_only" ON order_items
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
