-- Add explicit service_role policies to allow webhook and API access
-- Service role is used for: Stripe webhooks, server-side operations, admin APIs
-- Note: In Supabase, service_role is NOT a superuser and needs explicit policies

-- For shows: Already has public read policy, add service_role for completeness
CREATE POLICY "shows_allow_service_role_all" ON shows
  FOR ALL
  USING (auth.role() = 'service_role');

-- For ticket_types: Already has public read policy, add service_role for completeness
CREATE POLICY "ticket_types_allow_service_role_all" ON ticket_types
  FOR ALL
  USING (auth.role() = 'service_role');

-- For customers: Service role only (no public access)
CREATE POLICY "customers_allow_service_role_all" ON customers
  FOR ALL
  USING (auth.role() = 'service_role');

-- For orders: Service role only (no public access)
CREATE POLICY "orders_allow_service_role_all" ON orders
  FOR ALL
  USING (auth.role() = 'service_role');

-- For order_items: Service role only (no public access)
CREATE POLICY "order_items_allow_service_role_all" ON order_items
  FOR ALL
  USING (auth.role() = 'service_role');
