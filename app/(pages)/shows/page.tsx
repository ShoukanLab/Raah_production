import type { Metadata } from "next";

const description =
  "Upcoming live music events and concerts from Raah Production, Toronto's live music and concert production company.";

export const metadata: Metadata = {
  title: "Shows",
  description,
  alternates: {
    canonical: "/shows",
  },
  openGraph: {
    title: "Shows | Raah Production",
    description,
    url: "/shows",
  },
};

export default function ShowsPage() {
  return (
    <main className="section-container py-16">
      <h1 className="font-playfair text-4xl text-champagne mb-2">Upcoming Shows</h1>
      <span className="divider-gold" />
      {/* Show listings will go here */}
    </main>
  );
}
