import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { getAllShows, getShowBySlug } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity/image'
import { ExternalTicketButton } from '@/components/shows/ExternalTicketButton'
import { ShowAddToCalendar } from '@/components/shows/ShowAddToCalendar'
import { EyebrowLabel } from '@/components/ui/EyebrowLabel'
import { Tag } from '@/components/ui/Tag'
import type { PortableTextBlock } from '@/types/sanity'

export const revalidate = 60

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const shows = await getAllShows()
  return shows.map((show) => ({
    slug: show.slug.current,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params
  const show = await getShowBySlug(slug)

  if (!show) {
    return {
      title: 'Show Not Found',
    }
  }

  const description = show.venue
    ? `${show.name} at ${show.venue.name}${show.venue.city ? `, ${show.venue.city}` : ''}`
    : show.name

  return {
    title: show.name,
    description,
  }
}

function formatLongDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function formatTime(timeString: string | undefined): string {
  if (!timeString) return 'TBA'
  return timeString
}

export default async function ShowPage({ params }: PageProps) {
  const { slug } = params
  const show = await getShowBySlug(slug)

  if (!show) {
    notFound()
  }

  return (
    <main className="bg-void pb-24">
      {/* Back Navigation */}
      <section className="px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-montserrat text-xs uppercase tracking-widest text-gold hover:text-champagne transition-colors"
        >
          <span aria-hidden="true">←</span>
          <span>All Shows</span>
        </Link>
      </section>

      {/* Hero Section */}
      <section className="relative px-6 py-12 mt-6">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/10 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Badge Row */}
          <div className="flex items-center gap-3 mb-4">
            {show.genre && <Tag variant="gold">{show.genre}</Tag>}
            {show.status && show.status !== 'upcoming' && (
              <Tag variant={show.status === 'sold_out' ? 'gray' : 'gold'}>
                {show.status === 'sold_out' && 'Sold Out'}
                {show.status === 'selling_fast' && 'Selling Fast'}
                {show.status === 'completed' && 'Completed'}
              </Tag>
            )}
          </div>

          {/* Title */}
          <h1 className="font-playfair text-4xl leading-tight text-white mb-4">{show.name}</h1>

          {/* Divider */}
          <div className="h-px w-16 bg-gradient-to-r from-gold to-transparent" />
        </div>
      </section>

      {/* Meta Row */}
      <section className="px-6 py-8 border-b border-charcoal">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {/* Date */}
            <div>
              <EyebrowLabel>Date</EyebrowLabel>
              <p className="font-cormorant text-lg text-champagne mt-2">
                {formatLongDate(show.date)}
              </p>
            </div>

            {/* Doors Time */}
            <div>
              <EyebrowLabel>Doors</EyebrowLabel>
              <p className="font-cormorant text-lg text-champagne mt-2">
                {formatTime(show.doorsTime)}
              </p>
            </div>

            {/* Venue */}
            <div>
              <EyebrowLabel>Venue</EyebrowLabel>
              <p className="font-cormorant text-lg text-champagne mt-2">
                {show.venue ? `${show.venue.name}${show.venue.city ? `, ${show.venue.city}` : ''}` : 'TBA'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {show.description && show.description.length > 0 && (
        <section className="px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <EyebrowLabel>About</EyebrowLabel>
            <div className="mt-6">
              <PortableText value={show.description} />
            </div>
          </div>
        </section>
      )}

      {/* Official Poster Section */}
      {show.poster && (
        <section className="px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <EyebrowLabel>Official Poster</EyebrowLabel>
            <div className="mt-6 border border-gold/20 p-2 bg-onyx">
              <Image
                src={urlFor(show.poster).width(600).url()}
                alt={`${show.name} poster`}
                width={600}
                height={900}
                className="w-full h-auto"
                priority={false}
              />
            </div>
          </div>
        </section>
      )}

      {/* Lineup Section */}
      {show.lineup && show.lineup.length > 0 && (
        <section className="px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <EyebrowLabel>Lineup</EyebrowLabel>
            <ol className="mt-6 space-y-4">
              {show.lineup.map((item, index) => (
                <li key={item._key} className="flex gap-4">
                  <span className="font-playfair text-xl text-gold flex-shrink-0 w-8">{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-cormorant text-lg text-champagne">{item.artistName}</p>
                    {item.role && (
                      <p className="font-montserrat text-xs text-champagne/60 uppercase tracking-widest mt-0.5">
                        {item.role}
                      </p>
                    )}
                  </div>
                  {item.setTime && (
                    <span className="font-montserrat text-sm text-gold flex-shrink-0">{item.setTime}</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Ticket Section */}
      <section className="px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <ExternalTicketButton ticketUrl={show.ticketUrl} />
        </div>
      </section>

      {/* Add to Calendar Section */}
      <section className="px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <EyebrowLabel>Add to Calendar</EyebrowLabel>
          <div className="mt-6">
            <ShowAddToCalendar
              showName={show.name}
              showDate={show.date}
              venueName={show.venue?.name || 'Unknown Venue'}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
