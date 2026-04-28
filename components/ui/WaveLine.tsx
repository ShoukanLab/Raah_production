import { cn } from '@/lib/cn'

export interface WaveLineProps {
  className?: string
}

export function WaveLine({ className }: WaveLineProps) {
  return (
    <span
      className={cn(
        'block h-px w-full bg-gradient-to-r from-transparent via-gold to-transparent opacity-50',
        className
      )}
      role="presentation"
      aria-hidden="true"
    />
  )
}
