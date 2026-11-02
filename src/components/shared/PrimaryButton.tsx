import { Loader2 } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface PrimaryButtonProps extends Omit<ComponentProps<typeof Button>, 'variant'> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  loading?: boolean
  loadingText?: string
  icon?: ReactNode
  fullWidth?: boolean
}

/** The standard call-to-action: 44px touch target, loading state, optional leading icon. */
export function PrimaryButton({
  children,
  loading = false,
  loadingText,
  icon,
  fullWidth = false,
  size = 'lg',
  disabled,
  className,
  ...props
}: PrimaryButtonProps) {
  return (
    <Button
      size={size}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(fullWidth && 'w-full', className)}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : icon}
      {loading && loadingText ? loadingText : children}
    </Button>
  )
}
