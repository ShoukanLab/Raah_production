import { ContactForm } from '@/components/forms/ContactForm';
import { getContactInfo } from '@/lib/sanity';

export const metadata = { title: 'Contact' };

const linkProps = (url: string) =>
  url === '#' ? {} : { target: '_blank' as const, rel: 'noopener noreferrer' as const };

export default async function ContactPage() {
  const contactInfo = await getContactInfo();

  const phone = contactInfo?.phone ?? '+1 (825) 965-9855';
  const email = contactInfo?.email ?? 'raahprod@gmail.com';
  const location = contactInfo?.location ?? 'Edmonton, Alberta';
  const instagramUrl = contactInfo?.instagramUrl ?? 'https://www.instagram.com/raah.production?igsh=N3ZuajdiNmpocXEz';

  return (
    <main className="bg-void pb-24">
      {/* Hero Section */}
      <section className="px-6 pt-16 pb-8 max-w-2xl mx-auto text-center">
        <h1 className="font-playfair text-4xl text-white leading-tight">
          Let's make something<br />
          <span className="italic text-gold">unforgettable.</span>
        </h1>
        <p className="font-montserrat text-sm text-t2 mt-4 leading-relaxed">
          Bookings, press, and collaborations — start a conversation below.
        </p>
      </section>

      {/* Contact Info Cards (3-column grid) */}
      <section className="px-6 py-4 grid grid-cols-3 gap-3 max-w-2xl mx-auto">
        {/* Phone */}
        <div className="bg-onyx border border-charcoal rounded-lg p-4 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold">
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
            <p className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] text-t3 mb-1">
              Phone
            </p>
            <p className="font-montserrat text-sm text-white font-medium">{phone}</p>
          </div>
        </div>

        {/* Email */}
        <div className="bg-onyx border border-charcoal rounded-lg p-4 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold">
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
            <p className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] text-t3 mb-1">
              Email
            </p>
            <p className="font-montserrat text-sm text-white font-medium break-words">{email}</p>
          </div>
        </div>

        {/* Studio */}
        <div className="bg-onyx border border-charcoal rounded-lg p-4 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold">
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
            <p className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] text-t3 mb-1">
              Studio
            </p>
            <p className="font-montserrat text-sm text-white font-medium">{location}</p>
          </div>
        </div>
      </section>

      {/* Contact Form Section (Card) */}
      <section className="px-6 py-6 max-w-2xl mx-auto">
        <div className="bg-onyx border border-charcoal rounded-xl p-6">
          <h2 className="font-playfair text-2xl text-white mb-2">Send a Message</h2>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            <p className="font-montserrat text-xs text-t2">Typically replies within 24 hours</p>
          </div>
          <ContactForm />
        </div>
      </section>

{/* Social Links */}
      <section className="px-6 py-6 max-w-2xl mx-auto">
        <p className="font-montserrat text-[9px] font-bold uppercase tracking-[0.2em] text-t3 text-center mb-4">
          Follow Raah Production
        </p>
        <div className="flex justify-center">
          {/* Instagram */}
          <a
            href={instagramUrl}
            {...linkProps(instagramUrl)}
            className="w-10 h-10 rounded-full border border-charcoal flex items-center justify-center text-t2 hover:border-gold/30 hover:text-gold transition-colors"
            aria-label="Instagram"
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
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <circle cx="17.5" cy="6.5" r="1.5" />
            </svg>
          </a>
        </div>
      </section>
    </main>
  );
}
