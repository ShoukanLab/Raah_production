export const metadata = { title: "Show Details" };

interface ShowDetailPageProps {
  params: { "show-detail": string };
}

export default function ShowDetailPage({ params }: ShowDetailPageProps) {
  const slug = params["show-detail"];

  return (
    <main className="section-container py-16">
      <p className="text-champagne/50 text-sm font-montserrat uppercase tracking-widest">
        {slug}
      </p>
      {/* Show detail content will go here */}
    </main>
  );
}
