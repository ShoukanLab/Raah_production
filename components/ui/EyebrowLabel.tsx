import { cn } from '@/lib/cn'

export interface EyebrowLabelProps {
  children: React.ReactNode
  className?: string
}

export function EyebrowLabel({ children, className }: EyebrowLabelProps) {
  return (
    <p
      className={cn(
        'font-montserrat text-xs font-semibold tracking-widest uppercase text-gold/70',
        className
      )}
    >
      {children}
    </p>
  )
}
