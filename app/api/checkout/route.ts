import { NextRequest, NextResponse } from 'next/server';
import { stripe, type Stripe } from '@/lib/stripe';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { reserveTickets, releaseTickets } from '@/lib/supabase/inventory';

interface CheckoutRequest {
  ticketTypeId: string;
  quantity: number;
  showSlug: string;
}

interface CheckoutResponse {
  success: boolean;
  data?: { url: string };
  error?: string;
}

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<NextResponse<CheckoutResponse>> {
  try {
    const body = await req.json() as unknown;
    const { ticketTypeId, quantity, showSlug } = body as CheckoutRequest;

    // Validate inputs
    if (!ticketTypeId || typeof ticketTypeId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid ticketTypeId' },
        { status: 400 }
      );
    }

    if (!quantity || typeof quantity !== 'number' || quantity < 1 || quantity > 10 || !Number.isInteger(quantity)) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be an integer between 1 and 10' },
        { status: 400 }
      );
    }

    if (!showSlug || typeof showSlug !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid showSlug' },
        { status: 400 }
      );
    }

    // Fetch ticket type from Supabase
    const client = createServiceRoleClient();
    const { data: ticketType, error: ticketError } = await client
      .from('ticket_types')
      .select('id, name, price, quantity_total, quantity_sold')
      .eq('id', ticketTypeId)
      .single<{ id: string; name: string; price: number; quantity_total: number; quantity_sold: number }>();

    if (ticketError || !ticketType) {
      return NextResponse.json(
        { success: false, error: 'Ticket type not found' },
        { status: 404 }
      );
    }

    // Reserve tickets atomically
    const reservationResult = await reserveTickets(ticketTypeId, quantity);
    if (!reservationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: reservationResult.error_message || 'Unable to reserve tickets'
        },
        { status: 400 }
      );
    }

    // Build base URL from request headers
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const host = req.headers.get('host') || 'localhost:3000';
    const origin = `${proto}://${host}`;

    // Create Stripe Checkout Session
    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'cad',
              product_data: {
                name: ticketType.name || 'Ticket',
              },
              unit_amount: Math.round((ticketType.price as number) * 100),
            },
            quantity,
          },
        ],
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/shows/${showSlug}`,
        metadata: {
          ticketTypeId,
          quantity: String(quantity),
          showSlug,
        },
      });
    } catch (stripeError) {
      // Release the reservation if Stripe session creation fails
      await releaseTickets(ticketTypeId, quantity);

      console.error('Stripe session creation error:', stripeError);
      return NextResponse.json(
        { success: false, error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { url: session.url || '' },
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
