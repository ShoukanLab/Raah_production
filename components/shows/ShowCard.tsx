import Link from 'next/link'
import { cn } from '@/lib/cn'
import { Tag } from '@/components/ui/Tag'
import { getStatusLabel } from '@/lib/showStatus'
import type { Show } from '@/types/sanity'

interface ShowCardProps {
  show: Show
  isPast?: boolean
  className?: string
}

function formatDateStrip(iso: string) {
  const d = new Date(iso)
  return {
    month: d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase(),
    day: String(d.getUTCDate()).padStart(2, '0'),
    weekday: d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }).toUpperCase(),
  }
}

export function ShowCard({ show, isPast = false, className }: ShowCardProps) {
  const dateStrip = formatDateStrip(show.date)
  const href = `/shows/${show.slug.current}`

  const cardContent = (
    <div
      className={cn(
        'flex items-center gap-4 px-4 py-4 border-b border-charcoal transition-colors hover:bg-onyx/50',
        className
      )}
    >
      {/* Date strip — left */}
      <div className="flex-shrink-0 w-12 text-center">
        <div className="text-[10px] font-bold text-gold tracking-widest">
          {dateStrip.month}
        </div>
        <div className="h-px w-6 mx-auto bg-gold/30 my-1" />
        <div className="text-sm font-semibold text-gold">{dateStrip.day}</div>
        <div className="h-px w-6 mx-auto bg-gold/30 my-1" />
        <div className="text-[10px] font-bold text-gold/70 tracking-widest">
          {dateStrip.weekday}
        </div>
      </div>

      {/* Show info — center */}
      <div className="flex-1">
        <h3 className="font-playfair text-lg text-champagne">{show.name}</h3>
        {show.venue && (
          <p className="font-montserrat text-xs text-champagne/60 mt-0.5">
            {show.venue.name}
            {show.venue.city && `, ${show.venue.city}`}
          </p>
        )}
      </div>

      {/* Tag + chevron — right */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <Tag variant={isPast || show.status === 'sold_out' ? 'gray' : 'gold'}>
          {isPast ? 'Completed' : getStatusLabel(show.status)}
        </Tag>
        <svg
          aria-hidden="true"
          focusable="false"
          className="w-5 h-5 text-gold/70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  )

  if (isPast) {
    return <div>{cardContent}</div>
  }

  return (
    <Link href={href} className="block">
      {cardContent}
    </Link>
  )
}
