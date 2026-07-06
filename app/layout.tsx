import type { Metadata } from "next";
import "@/styles/globals.css";
import { PageShell } from "@/components/layout";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://raahproduction.ca";
const siteDescription =
  "Premium live music experiences. Discover upcoming shows, secure your tickets, and lose yourself in the sound.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Raah Production",
    template: "%s | Raah Production",
  },
  description: siteDescription,
  keywords: ["live music", "concerts", "shows", "tickets", "Raah Production", "Canada"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "Raah Production",
    title: "Raah Production",
    description: siteDescription,
    url: "/",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raah Production",
    description: siteDescription,
    images: ["/opengraph-image"],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Raah Production",
  url: siteUrl,
  logo: `${siteUrl}/opengraph-image`,
  sameAs: ["https://www.instagram.com/raah.production?igsh=N3ZuajdiNmpocXEz"],
  address: {
    "@type": "PostalAddress",
    addressCountry: "CA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="m-0 p-0 bg-void text-champagne">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
