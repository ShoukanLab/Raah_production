import { cn } from '@/lib/cn'

export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'outline'
  fullWidth?: boolean
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  'aria-label'?: string
}

export function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  className,
  onClick,
  type = 'button',
  disabled = false,
  'aria-label': ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        variant === 'primary' ? 'btn-gold-filled' : 'btn-gold',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        fullWidth && 'w-full',
        className
      )}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
    >
      {children}
    </button>
  )
}
