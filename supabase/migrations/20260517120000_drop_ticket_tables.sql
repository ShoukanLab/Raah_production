-- Drop in dependency order (child tables first)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS ticket_types CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Drop RPCs
DROP FUNCTION IF EXISTS reserve_ticket_inventory(UUID, INTEGER);
DROP FUNCTION IF EXISTS release_ticket_inventory(UUID, INTEGER);
