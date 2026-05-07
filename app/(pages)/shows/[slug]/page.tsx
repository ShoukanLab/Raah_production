import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getShowBySlug } from '@/lib/sanity/queries';
import { getTicketTypes } from '@/lib/supabase/inventory';
import { urlFor } from '@/lib/sanity/image';
import { TicketSelector } from '@/components/shows/TicketSelector';

interface ShowDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ShowDetailPageProps): Promise<Metadata> {
  const show = await getShowBySlug(params.slug);

  if (!show) {
    return {
      title: 'Show Not Found',
    };
  }

  return {
    title: `${show.name} | Raah Production`,
    description: show.description?.[0]?.children?.[0]?.text || 'Live music event',
  };
}

export default async function ShowDetailPage({ params }: ShowDetailPageProps) {
  const show = await getShowBySlug(params.slug);

  if (!show) {
    notFound();
  }

  // Fetch ticket types if supabaseShowId exists
  let ticketTypes: Awaited<ReturnType<typeof getTicketTypes>> = [];
  if (show.supabaseShowId) {
    try {
      ticketTypes = await getTicketTypes(show.supabaseShowId);
    } catch (error) {
      console.error('Error fetching ticket types:', error);
    }
  }

  const showDate = new Date(show.date);
  const isUpcoming = showDate > new Date();

  return (
    <main className="bg-void">
      {/* Hero Section with Poster */}
      {show.poster && (
        <section className="relative h-96 overflow-hidden">
          <img
            src={urlFor(show.poster).width(1200).url()}
            alt={show.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void" />
        </section>
      )}

      {/* Content Section */}
      <section className="section-container py-12">
        <div className="max-w-2xl mx-auto">
          {/* Show Name */}
          <h1 className="font-playfair text-5xl text-white mb-2">{show.name}</h1>
          <div className="h-px w-20 bg-gradient-to-r from-gold to-transparent mb-8" />

          {/* Meta Information */}
          <div className="space-y-2 mb-8 font-montserrat text-sm text-t2">
            <div className="flex items-center gap-2">
              <span className="text-gold">📅</span>
              <span>
                {showDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            {show.doorsTime && (
              <div className="flex items-center gap-2">
                <span className="text-gold">🚪</span>
                <span>Doors: {show.doorsTime}</span>
              </div>
            )}
            {show.venue && (
              <div className="flex items-center gap-2">
                <span className="text-gold">📍</span>
                <span>
                  {show.venue.name}
                  {show.venue.city && ` • ${show.venue.city}`}
                </span>
              </div>
            )}
            {show.genre && (
              <div className="flex items-center gap-2">
                <span className="text-gold">🎵</span>
                <span>{show.genre}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {show.description && show.description.length > 0 && (
            <div className="space-y-4 mb-12 text-champagne/80 font-montserrat text-sm leading-relaxed">
              {show.description.map((block) => (
                <p key={block._key}>
                  {block.children.map((child) => child.text).join('')}
                </p>
              ))}
            </div>
          )}

          {/* Lineup */}
          {show.lineup && show.lineup.length > 0 && (
            <div className="mb-12">
              <h2 className="font-playfair text-2xl text-white mb-6">Lineup</h2>
              <div className="space-y-3">
                {show.lineup.map((artist) => (
                  <div
                    key={artist._key}
                    className="border-l-2 border-gold/50 pl-4 py-2"
                  >
                    <p className="font-montserrat text-white">{artist.artistName}</p>
                    {artist.role && (
                      <p className="font-montserrat text-xs text-t2">
                        {artist.role}
                        {artist.setTime && ` • ${artist.setTime}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ticket Section */}
          <div className="border-t border-charcoal pt-12">
            <h2 className="font-playfair text-2xl text-white mb-8">Get Tickets</h2>

            {isUpcoming && ticketTypes.length > 0 ? (
              <TicketSelector ticketTypes={ticketTypes} showSlug={show.slug.current} />
            ) : (
              <div className="text-center py-8">
                {show.status === 'sold_out' ? (
                  <div>
                    <p className="text-champagne/60 font-montserrat text-sm mb-2">
                      Sold Out
                    </p>
                    <p className="text-t3 font-montserrat text-xs">
                      This show is fully booked. Check back for future events.
                    </p>
                  </div>
                ) : !isUpcoming ? (
                  <div>
                    <p className="text-champagne/60 font-montserrat text-sm mb-2">
                      Event Completed
                    </p>
                    <p className="text-t3 font-montserrat text-xs">
                      Tickets are no longer available for this show.
                    </p>
                  </div>
                ) : (
                  <p className="text-champagne/60 font-montserrat text-sm">
                    Tickets not yet available
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
