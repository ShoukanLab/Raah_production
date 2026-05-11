import { ContactForm } from '@/components/forms/ContactForm';
import { WaveLine } from '@/components/ui/WaveLine';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { getContactInfo } from '@/lib/sanity';

export const metadata = { title: 'Contact' };

const linkProps = (url: string) =>
  url === '#' ? {} : { target: '_blank' as const, rel: 'noopener noreferrer' as const };

export default async function ContactPage() {
  const contactInfo = await getContactInfo();

  const phone = contactInfo?.phone ?? '+1 (416) 555-0192';
  const email = contactInfo?.email ?? 'hello@raahproduction.ca';
  const location = contactInfo?.location ?? 'Toronto, Ontario';
  const instagramUrl = contactInfo?.instagramUrl ?? '#';
  const twitterUrl = contactInfo?.twitterUrl ?? '#';
  const facebookUrl = contactInfo?.facebookUrl ?? '#';

  return (
    <main className="bg-void pb-24">
      {/* Hero Section */}
      <section className="px-6 py-12 max-w-2xl mx-auto">
        <EyebrowLabel>Get in Touch</EyebrowLabel>
        <h1 className="font-playfair italic text-4xl text-white mt-4 leading-tight">
          Let's Make<br />Something<br />Unforgettable
        </h1>
        <div className="mt-4 w-24">
          <WaveLine />
        </div>
        <p className="font-montserrat text-sm text-champagne/60 mt-4 leading-relaxed">
          Reach out to book our production services, inquire about upcoming shows, or collaborate on your next event.
        </p>
      </section>

      {/* Info Cards */}
      <section className="px-6 py-4 flex flex-col gap-3 max-w-2xl mx-auto">
        {/* Phone */}
        <div className="flex items-center gap-4 bg-onyx border border-charcoal rounded-[6px] px-[18px] py-4">
          <div className="w-9 h-9 rounded-[4px] bg-gold/[0.08] border border-gold/15 flex items-center justify-center flex-shrink-0 text-gold">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <div>
            <p className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] text-t4 mb-1">
              Phone
            </p>
            <p className="font-montserrat text-sm text-white font-medium">{phone}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-4 bg-onyx border border-charcoal rounded-[6px] px-[18px] py-4">
          <div className="w-9 h-9 rounded-[4px] bg-gold/[0.08] border border-gold/15 flex items-center justify-center flex-shrink-0 text-gold">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <div>
            <p className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] text-t4 mb-1">
              Email
            </p>
            <p className="font-montserrat text-sm text-white font-medium">{email}</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-4 bg-onyx border border-charcoal rounded-[6px] px-[18px] py-4">
          <div className="w-9 h-9 rounded-[4px] bg-gold/[0.08] border border-gold/15 flex items-center justify-center flex-shrink-0 text-gold">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div>
            <p className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] text-t4 mb-1">
              Based In
            </p>
            <p className="font-montserrat text-sm text-white font-medium">{location}</p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="px-6 py-6 max-w-2xl mx-auto">
        <p className="font-playfair text-lg text-white mb-1">Send a Message</p>
        <p className="font-montserrat text-xs text-t3 mb-6">We typically respond within 24 hours.</p>
        <ContactForm />
      </section>

      {/* Social Links */}
      <section className="px-6 py-6 max-w-2xl mx-auto">
        <p className="font-montserrat text-[9px] font-bold uppercase tracking-[0.2em] text-t4 mb-3">
          Follow Raah Production
        </p>
        <div className="flex gap-2.5">
          {/* Instagram */}
          <a
            href={instagramUrl}
            {...linkProps(instagramUrl)}
            className="flex-1 flex items-center justify-center gap-2 bg-onyx border border-charcoal rounded-[4px] py-3.5 hover:border-gold/30 transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-t2"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <circle cx="17.5" cy="6.5" r="1.5" />
            </svg>
            <span className="font-montserrat text-[11px] font-semibold tracking-[0.1em] text-t2">
              Instagram
            </span>
          </a>

          {/* Twitter/X */}
          <a
            href={twitterUrl}
            {...linkProps(twitterUrl)}
            className="flex-1 flex items-center justify-center gap-2 bg-onyx border border-charcoal rounded-[4px] py-3.5 hover:border-gold/30 transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-t2"
            >
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2s9 5 20 5a9.5 9.5 0 0 0-9-5.5c4.75 2.25 7-7 7-11.667z" />
            </svg>
            <span className="font-montserrat text-[11px] font-semibold tracking-[0.1em] text-t2">
              X / Twitter
            </span>
          </a>

          {/* Facebook */}
          <a
            href={facebookUrl}
            {...linkProps(facebookUrl)}
            className="flex-1 flex items-center justify-center gap-2 bg-onyx border border-charcoal rounded-[4px] py-3.5 hover:border-gold/30 transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-t2"
            >
              <path d="M18 2h-3a6 6 0 0 0-6 6v4a6 6 0 0 0 6 6h3m0-11v5m-6-5v5" />
            </svg>
            <span className="font-montserrat text-[11px] font-semibold tracking-[0.1em] text-t2">
              Facebook
            </span>
          </a>
        </div>
      </section>
    </main>
  );
}
