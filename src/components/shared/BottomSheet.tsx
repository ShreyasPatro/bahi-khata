import type { ReactNode } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export interface BottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  /** Hide the title visually while keeping it for assistive tech. */
  hideTitle?: boolean
  children?: ReactNode
  footer?: ReactNode
  className?: string
}

/** Mobile-first modal surface anchored to the bottom edge, safe-area aware. */
export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  hideTitle,
  children,
  footer,
  className,
}: BottomSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={cn(
          'max-h-[92dvh] gap-0 rounded-t-3xl border-t-0 p-0 shadow-overlay duration-(--duration-slow)',
          className,
        )}
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-border"
        />
        <SheetHeader className={cn('px-5 pt-3 pb-2 text-left', hideTitle && 'sr-only')}>
          <SheetTitle className="text-title font-semibold">{title}</SheetTitle>
          {description ? (
            <SheetDescription className="text-body-sm text-muted-foreground">
              {description}
            </SheetDescription>
          ) : (
            <SheetDescription className="sr-only">{title}</SheetDescription>
          )}
        </SheetHeader>
        {children && (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
            {children}
          </div>
        )}
        {footer && (
          <div className="border-t bg-popover px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
        {!footer && <div className="pb-safe" />}
      </SheetContent>
    </Sheet>
  )
}
