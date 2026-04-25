import { NextRequest, NextResponse } from "next/server";
import { constructStripeEvent } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase";
import { sendOrderConfirmation } from "@/lib/resend";
import type Stripe from "stripe";

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

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent, supabase);
        break;
      }
      case "payment_intent.payment_failed": {
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent, supabase);
        break;
      }
      case "charge.refunded": {
        await handleRefund(event.data.object as Stripe.Charge, supabase);
        break;
      }
      default:
        // Unhandled event types are not errors
        break;
    }
  } catch (err) {
    console.error(`[Stripe webhook] Error processing ${event.type}:`, err);
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ─── Handlers ────────────────────────────────────────────────────────────────

async function handlePaymentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: ReturnType<typeof createAdminClient>
) {
  const { data: order, error } = await supabase
    .from("orders")
    .update({ status: "paid", stripe_payment_intent_id: paymentIntent.id })
    .eq("stripe_payment_intent_id", paymentIntent.id)
    .select(
      `
      *,
      customers ( email, first_name, last_name ),
      shows ( name, date, venue_name, city )
    `
    )
    .single();

  if (error || !order) {
    throw new Error(`Order not found for payment_intent ${paymentIntent.id}`);
  }

  const customer = order.customers as { email: string; first_name: string; last_name: string };
  const show = order.shows as { name: string; date: string; venue_name: string; city: string };

  await sendOrderConfirmation({
    to: customer.email,
    customerName: `${customer.first_name} ${customer.last_name}`,
    orderNumber: order.order_number,
    showName: show.name,
    showDate: new Date(show.date).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    venue: `${show.venue_name}, ${show.city}`,
    ticketCount: 1, // TODO: sum from order_items
    totalAmount: `£${(order.total_pence / 100).toFixed(2)}`,
  });
}

async function handlePaymentFailed(
  paymentIntent: Stripe.PaymentIntent,
  supabase: ReturnType<typeof createAdminClient>
) {
  await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("stripe_payment_intent_id", paymentIntent.id);
}

async function handleRefund(
  charge: Stripe.Charge,
  supabase: ReturnType<typeof createAdminClient>
) {
  if (!charge.payment_intent) return;
  await supabase
    .from("orders")
    .update({ status: "refunded", stripe_charge_id: charge.id })
    .eq("stripe_payment_intent_id", charge.payment_intent);
}
