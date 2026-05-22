import { Metadata } from 'next';
import { AboutContent } from '@/components/about/AboutContent';

export const metadata: Metadata = {
  title: 'About',
  description: 'Raah Production creates unforgettable live music experiences in Edmonton — from intimate qawali nights to large-scale concerts. Culture, community, and sound, all in one place.',
  keywords: 'Raah Production, YEG events, Edmonton live music, Edmonton concert production, qawali Edmonton, live music Edmonton, concert production Edmonton, Edmonton entertainment, live experience YEG, Edmonton event production company',
  openGraph: {
    title: 'About Raah Production | Live Music & Concert Production in Edmonton',
    description: 'From intimate qawali nights to large-scale concerts — Raah Production crafts live music experiences that stay with you long after the night ends.',
    url: 'https://raahproduction.ca/about',
    siteName: 'Raah Production',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Raah Production | Edmonton Live Music',
    description: 'Culture. Community. Sound. Raah Production — building unforgettable live music experiences in Edmonton.',
  },
  alternates: {
    canonical: 'https://raahproduction.ca/about',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Raah Production',
  url: 'https://raahproduction.ca',
  description: 'Raah Production creates unforgettable live music experiences in Edmonton, from intimate qawali nights to large-scale concerts.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Edmonton',
    addressRegion: 'AB',
    addressCountry: 'CA',
  },
  areaServed: {
    '@type': 'City',
    name: 'Edmonton',
  },
  knowsAbout: [
    'Live Music Production',
    'Concert Production',
    'Qawali Music',
    'Event Production',
    'Live Entertainment',
  ],
  slogan: 'Where Sound Travels',
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AboutContent />
    </>
  );
}
