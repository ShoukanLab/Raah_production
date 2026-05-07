import { createServiceRoleClient } from './server';
import type { Database } from '@/types/database';

type TicketTypeRow = Database['public']['Tables']['ticket_types']['Row'];

export interface TicketTypeWithAvailability extends TicketTypeRow {
  available_quantity: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rpc(client: ReturnType<typeof createServiceRoleClient>, fnName: string, params: any): any {
  return (client as any).rpc(fnName, params);
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
    .select('id, show_id, name, type_tag, price, quantity_total, quantity_sold, description, is_visible, created_at')
    .eq('show_id', showId)
    .eq('is_visible', true)
    .order('created_at', { ascending: true })
    .returns<TicketTypeRow[]>();

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
    .single<{ quantity_total: number; quantity_sold: number }>();

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

  const { data, error } = await rpc(client, 'reserve_ticket_inventory', {
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

  const row = data[0] as { success: boolean; available_quantity: number; error_message: string | null };
  return {
    success: row.success,
    available_quantity: row.available_quantity,
    error_message: row.error_message,
  };
}

export async function releaseTickets(
  ticketTypeId: string,
  quantity: number
): Promise<ReleaseResult> {
  const client = createServiceRoleClient();

  const { data, error } = await rpc(client, 'release_ticket_inventory', {
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

  const row = data[0] as { success: boolean; new_quantity_sold: number; error_message: string | null };
  return {
    success: row.success,
    new_quantity_sold: row.new_quantity_sold,
    error_message: row.error_message,
  };
}
