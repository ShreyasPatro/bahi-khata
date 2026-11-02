import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface SegmentedControlProps<T extends string> {
  value: T
  onValueChange: (value: T) => void
  options: { value: T; label: string }[]
  /** Accessible name for the group, e.g. "Filter transactions". */
  label: string
  className?: string
}

/**
 * Filter-style tabs that switch a view in place and have no separate panels.
 * (Real tab panels should use Tabs + TabsContent so aria-controls stays valid.)
 */
export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
  label,
  className,
}: SegmentedControlProps<T>) {
  return (
    <Tabs value={value} onValueChange={(next) => onValueChange(next as T)} className={className}>
      <TabsList aria-label={label} className={cn('w-full md:w-fit')}>
        {options.map((option) => (
          <TabsTrigger key={option.value} value={option.value} aria-controls={undefined}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
