import { cn } from '@/lib/cn'

export interface TagProps {
  children: React.ReactNode
  variant?: 'gold' | 'gray'
  className?: string
}

export function Tag({ children, variant = 'gold', className }: TagProps) {
  return (
    <span
      className={cn(
        'font-montserrat text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 border rounded-sm',
        variant === 'gold'
          ? 'border-gold/40 text-gold bg-gold/5'
          : 'border-charcoal text-champagne/40 bg-charcoal/30',
        className
      )}
    >
      {children}
    </span>
  )
}
