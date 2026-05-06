-- Add RPC function to release reserved tickets on payment failure
CREATE OR REPLACE FUNCTION release_ticket_inventory(
  p_ticket_type_id UUID,
  p_quantity_to_release INTEGER
)
RETURNS TABLE (
  success BOOLEAN,
  new_quantity_sold INTEGER,
  error_message TEXT
) AS $$
BEGIN
  RETURN QUERY
  UPDATE ticket_types
  SET quantity_sold = GREATEST(0, quantity_sold - p_quantity_to_release)
  WHERE id = p_ticket_type_id
  RETURNING
    TRUE::BOOLEAN as success,
    quantity_sold::INTEGER as new_quantity_sold,
    NULL::TEXT as error_message;
END;
$$ LANGUAGE plpgsql;
