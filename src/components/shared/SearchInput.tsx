import { Search, X } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface SearchInputProps extends Omit<
  ComponentProps<typeof Input>,
  'value' | 'onChange' | 'type'
> {
  value: string
  onValueChange: (value: string) => void
  label?: string
}

export function SearchInput({
  value,
  onValueChange,
  label = 'Search',
  className,
  placeholder,
  ...props
}: SearchInputProps) {
  return (
    <div role="search" className={cn('relative', className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        aria-label={label}
        placeholder={placeholder ?? `${label}…`}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className="pr-10 pl-9 [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onValueChange('')}
          className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
