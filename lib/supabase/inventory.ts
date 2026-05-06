import { createServiceRoleClient } from './server';
import type { Database } from '@/types/database';

export interface TicketTypeWithAvailability
  extends Database['public']['Tables']['ticket_types']['Row'] {
  available_quantity: number;
}

export interface ReservationResult {
  success: boolean;
  available_quantity: number;
  error_message: string | null;
}

export interface ReleaseResult {
  success: boolean;
  new_quantity_sold: number;
  error_message: string | null;
}

export async function getTicketTypes(
  showId: string
): Promise<TicketTypeWithAvailability[]> {
  const client = createServiceRoleClient();

  const { data, error } = await client
    .from('ticket_types')
    .select('*')
    .eq('show_id', showId)
    .eq('is_visible', true)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch ticket types: ${error.message}`);
  }

  return (data || []).map((ticket) => ({
    ...ticket,
    available_quantity: ticket.quantity_total - ticket.quantity_sold,
  }));
}

export async function checkAvailability(
  ticketTypeId: string,
  quantity: number
): Promise<boolean> {
  const client = createServiceRoleClient();

  const { data, error } = await client
    .from('ticket_types')
    .select('quantity_total, quantity_sold')
    .eq('id', ticketTypeId)
    .single();

  if (error || !data) {
    return false;
  }

  const availableQuantity = data.quantity_total - data.quantity_sold;
  return availableQuantity >= quantity;
}

export async function reserveTickets(
  ticketTypeId: string,
  quantity: number
): Promise<ReservationResult> {
  const client = createServiceRoleClient();

  const { data, error } = await client.rpc('reserve_ticket_inventory', {
    p_ticket_type_id: ticketTypeId,
    p_requested_quantity: quantity,
  });

  if (error) {
    throw new Error(`Failed to reserve tickets: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return {
      success: false,
      available_quantity: 0,
      error_message: 'Reservation RPC returned no data',
    };
  }

  const result = data[0];
  return {
    success: result.success,
    available_quantity: result.available_quantity,
    error_message: result.error_message,
  };
}

export async function releaseTickets(
  ticketTypeId: string,
  quantity: number
): Promise<ReleaseResult> {
  const client = createServiceRoleClient();

  const { data, error } = await client.rpc('release_ticket_inventory', {
    p_ticket_type_id: ticketTypeId,
    p_quantity_to_release: quantity,
  });

  if (error) {
    throw new Error(`Failed to release tickets: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return {
      success: false,
      new_quantity_sold: 0,
      error_message: 'Release RPC returned no data',
    };
  }

  const result = data[0];
  return {
    success: result.success,
    new_quantity_sold: result.new_quantity_sold,
    error_message: result.error_message,
  };
}
