import Link from 'next/link';

interface SuccessPageProps {
  searchParams: { session_id?: string };
}

export const metadata = {
  title: 'Booking Confirmed — Raah Production',
};

export default function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id || '';

  return (
    <main className="bg-void min-h-screen flex items-center">
      <section className="section-container py-12 flex-1">
        <div className="max-w-md mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/20 rounded-full mb-6">
              <svg
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
          </div>

          {/* Heading */}
          <h1 className="font-playfair text-4xl text-white mb-3">You're In!</h1>

          {/* Subheading */}
          <p className="text-champagne/80 font-montserrat text-sm mb-8">
            Your booking is confirmed. Check your email for order details.
          </p>

          {/* Session ID (for reference) */}
          {sessionId && (
            <div className="bg-charcoal rounded-sm px-4 py-3 mb-8">
              <p className="text-t3 font-montserrat text-xs uppercase tracking-widest mb-1">
                Session ID
              </p>
              <p className="font-montserrat text-xs text-t2 break-all">{sessionId}</p>
            </div>
          )}

          {/* CTA */}
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-gold text-void font-montserrat font-semibold uppercase tracking-wider text-sm rounded-sm hover:bg-gold/90 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
