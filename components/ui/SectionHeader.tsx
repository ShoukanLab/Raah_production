import { cn } from '@/lib/cn'
import { WaveLine } from './WaveLine'

export interface SectionHeaderProps {
  title: string
  count?: number
  className?: string
}

export function SectionHeader({
  title,
  count,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      <div className="flex items-baseline gap-3 mb-2">
        <h2 className="font-playfair text-4xl text-champagne">{title}</h2>
        {count !== undefined && (
          <span className="font-montserrat text-sm text-gold/70 tracking-widest uppercase">
            {count}
          </span>
        )}
      </div>
      <WaveLine className="w-16" />
    </div>
  )
}
