-- Grant necessary permissions on tables for RLS to work properly
-- Without these grants, even permissive RLS policies will be denied

-- Public (which includes anon and authenticated) should be able to:
-- - SELECT from shows and ticket_types (public read)
-- - Not have any other permissions on other tables

-- Grant SELECT on shows and ticket_types to anon (via public role)
GRANT SELECT ON shows TO anon;
GRANT SELECT ON ticket_types TO anon;

-- Grant SELECT on shows and ticket_types to authenticated users
GRANT SELECT ON shows TO authenticated;
GRANT SELECT ON ticket_types TO authenticated;

-- Grant full permissions to service_role on all tables
GRANT ALL ON shows TO service_role;
GRANT ALL ON ticket_types TO service_role;
GRANT ALL ON customers TO service_role;
GRANT ALL ON orders TO service_role;
GRANT ALL ON order_items TO service_role;

-- Also ensure the public role has appropriate permissions
GRANT SELECT ON shows TO public;
GRANT SELECT ON ticket_types TO public;
