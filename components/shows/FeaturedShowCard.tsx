import Link from 'next/link'
import { cn } from '@/lib/cn'
import { Tag } from '@/components/ui/Tag'
import { urlFor } from '@/lib/sanity'
import type { Show } from '@/types/sanity'

interface FeaturedShowCardProps {
  show: Show
  className?: string
}

export function FeaturedShowCard({ show, className }: FeaturedShowCardProps) {
  const href = `/shows/${show.slug.current}`

  const posterUrl = show.poster
    ? urlFor(show.poster).width(800).url()
    : null

  const getBadgeText = () => {
    if (show.status === 'selling_fast') return 'Selling Fast'
    if (show.status === 'sold_out') return 'Sold Out'
    return null
  }

  const badgeText = getBadgeText()
  const badgeVariant = show.status === 'sold_out' ? 'gray' : 'gold'

  const formatDateLocal = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'America/Edmonton',
    })
  }

  return (
    <Link href={href} className="block">
      <div
        className={cn(
          'relative overflow-hidden rounded-sm h-64 group',
          className
        )}
      >
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          role="img"
          aria-label={show.poster?.alt ?? `${show.name} event poster`}
          style={
            posterUrl
              ? { backgroundImage: `url(${posterUrl})` }
              : {
                  backgroundImage:
                    'linear-gradient(135deg, var(--color-charcoal) 0%, var(--color-onyx) 100%)',
                }
          }
        />

        {/* Dark overlay gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void/90" />

        {/* Spotlight glow at top */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-radial from-gold/[12] to-transparent pointer-events-none" />

        {/* Badge — top right */}
        {badgeText && (
          <div className="absolute top-4 right-4 z-10">
            <Tag variant={badgeVariant}>{badgeText}</Tag>
          </div>
        )}

        {/* Content — bottom, overlaid */}
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <h2 className="font-playfair text-2xl text-white leading-tight mb-2">
            {show.name}
          </h2>

          <p className="font-montserrat text-xs text-champagne/70 mb-4">
            {formatDateLocal(show.date)}
            {show.venue && (
              <>
                {' '}• {show.venue.name}
                {show.venue.city && `, ${show.venue.city}`}
              </>
            )}
          </p>
        </div>
      </div>
    </Link>
  )
}
