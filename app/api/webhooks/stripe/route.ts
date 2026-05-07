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
  // TODO: Implement checkout.session.completed handler
  // This webhook is currently written for Payment Intent flow but needs to handle Checkout Sessions
  console.log('[Stripe webhook] payment_intent.succeeded:', paymentIntent.id);
}

async function handlePaymentFailed(
  paymentIntent: Stripe.PaymentIntent,
  supabase: ReturnType<typeof createAdminClient>
) {
  // TODO: Implement checkout.session.completed handler
  console.log('[Stripe webhook] payment_intent.payment_failed:', paymentIntent.id);
}

async function handleRefund(
  charge: Stripe.Charge,
  supabase: ReturnType<typeof createAdminClient>
) {
  // TODO: Implement refund handler
  console.log('[Stripe webhook] charge.refunded:', charge.id);
}
