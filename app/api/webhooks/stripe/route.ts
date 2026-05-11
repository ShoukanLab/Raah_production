import { NextRequest, NextResponse } from "next/server";
import { constructStripeEvent } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { releaseTickets } from "@/lib/supabase/inventory";
import { sendConfirmation } from "@/lib/resend/sendConfirmation";
import type Stripe from "stripe";
import type { Database } from "@/types/database";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = constructStripeEvent(body, signature);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      }
      case "checkout.session.expired": {
        await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error(`[Stripe webhook] Error processing ${event.type}:`, err);
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ─── Handlers ────────────────────────────────────────────────────────────────

type TicketType = Database["public"]["Tables"]["ticket_types"]["Row"];
type Show = Database["public"]["Tables"]["shows"]["Row"];
type Customer = Database["public"]["Tables"]["customers"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { ticketTypeId, quantity: quantityStr } = session.metadata ?? {};

  if (!ticketTypeId || !quantityStr) {
    throw new Error(`Missing metadata on session ${session.id}`);
  }

  const quantity = parseInt(quantityStr, 10);
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error(`Invalid quantity in metadata for session ${session.id}: ${quantityStr}`);
  }
  const customerEmail = session.customer_details?.email;
  const customerName = session.customer_details?.name || "";

  if (!customerEmail) {
    throw new Error(`Missing customer email on session ${session.id}`);
  }

  const supabase = createServiceRoleClient();

  // Idempotency guard: check if order already exists for this session
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .single();

  if (existingOrder) {
    return; // Already processed this session, skip to avoid duplicate emails
  }

  // Fetch ticket type to get show_id and price
  const { data: ticketType, error: ticketError } = await supabase
    .from("ticket_types")
    .select("id, show_id, name, price")
    .eq("id", ticketTypeId)
    .single<TicketType>();

  if (ticketError || !ticketType) {
    throw new Error(`Ticket type ${ticketTypeId} not found`);
  }

  // Fetch show details from Supabase
  const { data: show, error: showError } = await supabase
    .from("shows")
    .select("id, name, date, venue")
    .eq("id", ticketType.show_id)
    .single<Show>();

  if (showError || !show) {
    throw new Error(`Show not found for ticket type ${ticketTypeId}`);
  }

  // Parse customer name into first and last
  const nameParts = customerName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ");

  // Upsert customer (update if exists, insert if new)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customerResult = await (supabase.from("customers") as any)
    .upsert({ email: customerEmail, first_name: firstName, last_name: lastName }, { onConflict: "email" })
    .select("id")
    .single();

  const customer = customerResult.data as { id: string } | null;
  const customerError = customerResult.error;

  if (customerError || !customer) {
    throw new Error(`Failed to upsert customer: ${customerError?.message}`);
  }

  // Create order
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orderResult = await (supabase.from("orders") as any)
    .insert({ customer_id: customer.id, show_id: show.id, status: "paid", stripe_session_id: session.id })
    .select("id")
    .single();

  const order = orderResult.data as { id: string } | null;
  const orderError = orderResult.error;

  if (orderError || !order) {
    throw new Error(`Failed to create order: ${orderError?.message}`);
  }

  // Create order items
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemResult = await (supabase.from("order_items") as any).insert({
    order_id: order.id,
    ticket_type_id: ticketTypeId,
    quantity,
    price_at_purchase: ticketType.price,
  });

  const itemError = itemResult.error;

  if (itemError) {
    throw new Error(`Failed to create order items: ${itemError.message}`);
  }

  // Send confirmation email (do not throw on failure; order is already written)
  try {
    await sendConfirmation(order.id);
  } catch (err) {
    console.error(`[Stripe webhook] Email failed for order ${order.id}:`, err);
  }
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const { ticketTypeId, quantity: quantityStr } = session.metadata ?? {};

  if (!ticketTypeId || !quantityStr) {
    return; // No metadata to release
  }

  const quantity = parseInt(quantityStr, 10);
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error(`Invalid quantity in metadata for session ${session.id}: ${quantityStr}`);
  }

  const supabase = createServiceRoleClient();

  // Idempotency guard: do not release if order was already paid (session completed)
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .single();

  if (existingOrder) {
    return; // Session already completed, do not release
  }

  try {
    await releaseTickets(ticketTypeId, quantity);
  } catch (err) {
    console.error(
      `[Stripe webhook] Failed to release tickets for expired session ${session.id}:`,
      err
    );
    throw err;
  }
}
