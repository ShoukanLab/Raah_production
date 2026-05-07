import Link from 'next/link';

interface CancelPageProps {
  searchParams: { show?: string };
}

export const metadata = {
  title: 'Payment Cancelled — Raah Production',
};

export default function CheckoutCancelPage({ searchParams }: CancelPageProps) {
  const showSlug = searchParams.show || '';

  return (
    <main className="bg-void min-h-screen flex items-center">
      <section className="section-container py-12 flex-1">
        <div className="max-w-md mx-auto text-center">
          {/* Cancel Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-900/20 rounded-full mb-6">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-playfair text-4xl text-white mb-3">Payment Cancelled</h1>

          {/* Message */}
          <p className="text-champagne/80 font-montserrat text-sm mb-8">
            Your payment was not processed. No charges have been made to your account.
          </p>

          {/* CTA */}
          <Link
            href={showSlug ? `/shows/${showSlug}` : '/'}
            className="inline-block px-8 py-3 bg-gold text-void font-montserrat font-semibold uppercase tracking-wider text-sm rounded-sm hover:bg-gold/90 transition-colors"
          >
            ← {showSlug ? 'Back to Show' : 'Back to Home'}
          </Link>
        </div>
      </section>
    </main>
  );
}
