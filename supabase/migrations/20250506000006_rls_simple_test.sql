-- Temporary: Drop all policies and create simple permissive ones for testing
DROP POLICY IF EXISTS "shows_allow_all_read" ON shows;
DROP POLICY IF EXISTS "ticket_types_allow_read_visible" ON ticket_types;
DROP POLICY IF EXISTS "customers_allow_service_role_only" ON customers;
DROP POLICY IF EXISTS "customers_allow_service_role_insert" ON customers;
DROP POLICY IF EXISTS "customers_allow_service_role_update" ON customers;
DROP POLICY IF EXISTS "customers_allow_service_role_delete" ON customers;
DROP POLICY IF EXISTS "orders_allow_service_role_only" ON orders;
DROP POLICY IF EXISTS "orders_allow_service_role_insert" ON orders;
DROP POLICY IF EXISTS "orders_allow_service_role_update" ON orders;
DROP POLICY IF EXISTS "orders_allow_service_role_delete" ON orders;
DROP POLICY IF EXISTS "order_items_allow_service_role_only" ON order_items;
DROP POLICY IF EXISTS "order_items_allow_service_role_insert" ON order_items;
DROP POLICY IF EXISTS "order_items_allow_service_role_update" ON order_items;
DROP POLICY IF EXISTS "order_items_allow_service_role_delete" ON order_items;

-- Test: Allow all operations on all tables first to verify RLS system is working
CREATE POLICY "shows_permissive" ON shows FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "ticket_types_permissive" ON ticket_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "customers_permissive" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "orders_permissive" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "order_items_permissive" ON order_items FOR ALL USING (true) WITH CHECK (true);
