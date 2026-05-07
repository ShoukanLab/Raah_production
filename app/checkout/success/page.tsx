import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServiceRoleClient } from '@/lib/supabase/server';
import AddToCalendar from '@/components/checkout/AddToCalendar';
import { WaveLine } from '@/components/ui/WaveLine';
import type { Database } from '@/types/database';

export const metadata = {
  title: 'Booking Confirmed — Raah Production',
};

type Customer = Database['public']['Tables']['customers']['Row'];
type Show = Database['public']['Tables']['shows']['Row'];

type OrderWithJoins = {
  id: string;
  customer_id: string;
  show_id: string;
  status: string;
  customers: Pick<Customer, 'id' | 'email' | 'first_name' | 'last_name'> | null;
  shows: Pick<Show, 'id' | 'name' | 'date' | 'venue'> | null;
};

type OrderItemRow = {
  id: string;
  quantity: number;
  price_at_purchase: number;
  ticket_type_id: string;
};

type TicketTypeRow = {
  id: string;
  name: string;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  let sessionId = searchParams.session_id;
  if (Array.isArray(sessionId)) {
    sessionId = sessionId[0];
  }
  if (!sessionId) {
    redirect('/');
  }

  const supabase = createServiceRoleClient();

  const { data: order } = await supabase
    .from('orders')
    .select(
      'id, customer_id, show_id, status, customers(id, email, first_name, last_name), shows(id, name, date, venue)'
    )
    .eq('stripe_session_id', sessionId)
    .single<OrderWithJoins>();

  if (!order || order.status !== 'paid') {
    return <ProcessingState sessionId={sessionId} />;
  }

  const { data: orderItems } = await supabase
    .from('order_items')
    .select<'id, quantity, price_at_purchase, ticket_type_id', OrderItemRow>('id, quantity, price_at_purchase, ticket_type_id')
    .eq('order_id', order.id);

  if (!orderItems || orderItems.length === 0) {
    return <ProcessingState sessionId={sessionId} />;
  }

  const orderItem = orderItems[0];

  const { data: ticketType } = await supabase
    .from('ticket_types')
    .select<'id, name', TicketTypeRow>('id, name')
    .eq('id', orderItem.ticket_type_id)
    .single<TicketTypeRow>();

  if (!order.customers || !order.shows) {
    return <ProcessingState sessionId={sessionId} />;
  }

  const customer = order.customers;
  const show = order.shows;
  const ticketTypeName = ticketType?.name || 'Ticket';
  const quantity = orderItem.quantity;
  const pricePerTicket = orderItem.price_at_purchase;
  const total = (pricePerTicket * quantity).toFixed(2);
  const customerName = [customer.first_name, customer.last_name]
    .filter(Boolean)
    .join(' ') || 'Guest';

  const showDate = new Date(show.date).toLocaleDateString('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="bg-void min-h-screen flex items-center py-16">
      <section className="section-container flex-1">
        <div className="max-w-md mx-auto">
          {/* Icon + Heading */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/20 rounded-full mb-6">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="font-playfair text-4xl text-white mb-3">You're In!</h1>
            <p className="text-champagne/70 font-montserrat text-sm">
              A confirmation has been sent to <span className="text-gold">{customer.email}</span>
            </p>
          </div>

          {/* Order Details Card */}
          <div className="card-dark p-6 mb-8">
            <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-gold/70 mb-4">
              Order Details
            </p>

            <h2 className="font-playfair text-2xl text-white mb-1">{show.name}</h2>
            <p className="font-montserrat text-sm text-champagne/80 mb-1">{showDate}</p>
            <p className="font-montserrat text-sm text-t2 mb-6">{show.venue}</p>

            <WaveLine />

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm font-montserrat">
                <span className="text-t2">{ticketTypeName}</span>
                <span className="text-white">× {quantity}</span>
              </div>
              <div className="flex justify-between items-baseline gap-4 pt-2">
                <span className="font-montserrat text-xs text-t2 uppercase tracking-widest">
                  Total
                </span>
                <span className="font-playfair text-xl text-gold">${total} CAD</span>
              </div>
            </div>

            <WaveLine />

            <div className="mt-6">
              <p className="font-montserrat text-xs text-t2 uppercase tracking-widest mb-2">
                Order Ref
              </p>
              <p className="font-montserrat text-xs text-champagne/60 break-all">{order.id}</p>
            </div>
          </div>

          {/* Calendar CTA */}
          <AddToCalendar
            showName={show.name}
            showDate={show.date}
            venue={show.venue}
            orderId={order.id}
          />

          {/* Back to Shows */}
          <div className="text-center">
            <Link href="/shows" className="font-montserrat text-sm text-t2 hover:text-gold transition-colors">
              ← Back to Shows
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProcessingState({ sessionId }: { sessionId: string }) {
  return (
    <main className="bg-void min-h-screen flex items-center">
      <section className="section-container flex-1 text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-6">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gold animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth={2}
                fill="none"
                opacity={0.3}
              />
              <path
                d="M12 2c-5.52 0-10 4.48-10 10"
                stroke="currentColor"
                strokeWidth={2}
                fill="none"
              />
            </svg>
          </div>
          <h1 className="font-playfair text-3xl text-white mb-3">Confirming Your Order…</h1>
          <p className="text-champagne/60 font-montserrat text-sm mb-8">
            Your payment was received. We're confirming your booking — check your email shortly.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-gold text-void font-montserrat font-semibold uppercase tracking-wider text-sm rounded-sm hover:bg-gold/90 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
