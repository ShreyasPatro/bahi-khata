import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const surfaceVariants = cva('rounded-2xl border bg-card text-card-foreground', {
  variants: {
    padding: { none: '', sm: 'p-3', md: 'p-4 md:p-5', lg: 'p-5 md:p-6' },
    elevation: { flat: '', card: 'shadow-card', raised: 'shadow-raised' },
    interactive: {
      true: 'transition-shadow duration-(--duration-base) ease-soft hover:shadow-raised',
      false: '',
    },
  },
  defaultVariants: { padding: 'md', elevation: 'card', interactive: false },
})

export interface SurfaceProps extends ComponentProps<'div'>, VariantProps<typeof surfaceVariants> {}

/** Base card container used by every financial card and panel. */
export function Surface({ className, padding, elevation, interactive, ...props }: SurfaceProps) {
  return (
    <div
      className={cn(surfaceVariants({ padding, elevation, interactive }), className)}
      {...props}
    />
  )
}
