-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Shows table
CREATE TABLE shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sanity_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  venue TEXT NOT NULL,
  capacity INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ticket types table
CREATE TABLE ticket_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id UUID NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type_tag TEXT,
  price NUMERIC(10, 2) NOT NULL,
  quantity_total INTEGER NOT NULL,
  quantity_sold INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  show_id UUID NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  stripe_session_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  ticket_type_id UUID NOT NULL REFERENCES ticket_types(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price_at_purchase NUMERIC(10, 2) NOT NULL
);

-- Create indexes for common queries
CREATE INDEX idx_shows_date ON shows(date);
CREATE INDEX idx_shows_sanity_id ON shows(sanity_id);
CREATE INDEX idx_ticket_types_show_id ON ticket_types(show_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_show_id ON orders(show_id);
CREATE INDEX idx_orders_stripe_session_id ON orders(stripe_session_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_customers_email ON customers(email);

-- Enable RLS on all tables
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shows (public read-only)
CREATE POLICY "shows_allow_public_read" ON shows
  FOR SELECT
  USING (TRUE);

-- RLS Policies for ticket_types (public read only visible)
CREATE POLICY "ticket_types_allow_public_read_visible" ON ticket_types
  FOR SELECT
  USING (is_visible = TRUE);

-- RLS Policies for customers (authenticated only)
CREATE POLICY "customers_allow_authenticated_read" ON customers
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "customers_allow_authenticated_insert" ON customers
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for orders (authenticated only)
CREATE POLICY "orders_allow_authenticated_read" ON orders
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "orders_allow_authenticated_insert" ON orders
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for order_items (authenticated only)
CREATE POLICY "order_items_allow_authenticated_read" ON order_items
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "order_items_allow_authenticated_insert" ON order_items
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Atomic inventory RPC function (prevents overselling)
CREATE OR REPLACE FUNCTION reserve_ticket_inventory(
  p_ticket_type_id UUID,
  p_requested_quantity INTEGER
)
RETURNS TABLE (
  success BOOLEAN,
  available_quantity INTEGER,
  error_message TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH do_update AS (
    UPDATE ticket_types
    SET quantity_sold = quantity_sold + p_requested_quantity
    WHERE id = p_ticket_type_id
      AND (quantity_total - quantity_sold) >= p_requested_quantity
    RETURNING quantity_total, (quantity_sold + p_requested_quantity) AS new_sold
  )
  SELECT
    (SELECT COUNT(*) > 0 FROM do_update)::BOOLEAN,
    COALESCE((SELECT (quantity_total - new_sold) FROM do_update), 0)::INTEGER,
    CASE WHEN (SELECT COUNT(*) FROM do_update) > 0 THEN NULL::TEXT ELSE 'Not enough inventory available'::TEXT END;
END;
$$ LANGUAGE plpgsql;
