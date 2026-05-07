import Link from 'next/link'
import { cn } from '@/lib/cn'
import { Tag } from '@/components/ui/Tag'
import type { Show } from '@/types/sanity'

interface EventRowProps {
  show: Show
  isPast?: boolean
  isNew?: boolean
}

function ChevronIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className="text-gold/50"
    >
      <path d="M6 2l8 6-8 6" />
    </svg>
  )
}

export function EventRow({ show, isPast = false, isNew = false }: EventRowProps) {
  const d = new Date(show.date)
  const dayNum = String(d.getUTCDate()).padStart(2, '0')
  const dayName = d
    .toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })
    .toUpperCase()

  const href = `/shows/${show.slug.current}`

  const rowContent = (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-4 border-b border-charcoal transition-colors',
        !isPast && 'hover:bg-onyx/50 cursor-pointer',
        isPast && 'cursor-default'
      )}
    >
      {/* Day number */}
      <div className="flex-shrink-0 w-8 text-right">
        <span className="font-playfair text-2xl text-gold leading-none">
          {dayNum}
        </span>
      </div>

      {/* Day name */}
      <div className="flex-shrink-0 w-8">
        <span className="font-montserrat text-[9px] font-semibold tracking-widest uppercase text-gold/60">
          {dayName}
        </span>
      </div>

      {/* Dot separator */}
      <div className="w-1 h-1 rounded-full bg-gold/30 flex-shrink-0" />

      {/* Show name + venue */}
      <div className="flex-1 min-w-0">
        <p className="font-playfair text-base text-champagne truncate">
          {show.name}
        </p>
        {show.venue && (
          <p className="font-montserrat text-[10px] text-champagne/50 mt-0.5 truncate">
            {show.venue.name}
            {show.venue.city && `, ${show.venue.city}`}
            {show.doorsTime && ` · ${show.doorsTime}`}
          </p>
        )}
      </div>

      {/* Right side: tags + chevron */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {isNew && !isPast && <Tag variant="new">New</Tag>}
        <Tag variant={isPast ? 'gray' : 'gold'}>
          {isPast ? 'Completed' : show.genre}
        </Tag>
        {!isPast && <ChevronIcon />}
      </div>
    </div>
  )

  if (isPast) {
    return rowContent
  }

  return <Link href={href}>{rowContent}</Link>
}
