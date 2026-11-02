import { cn } from '@/lib/utils'
import { toneStyles } from '@/lib/utils/tone'
import { categories, type CategoryKey } from '@/components/financial/categories'

const sizes = {
  sm: 'size-8 [&_svg]:size-4',
  md: 'size-10 [&_svg]:size-5',
  lg: 'size-12 [&_svg]:size-6',
}

interface CategoryIconProps {
  category: CategoryKey
  size?: keyof typeof sizes
  className?: string
}

export function CategoryIcon({ category, size = 'md', className }: CategoryIconProps) {
  const { icon: Icon, tone } = categories[category]
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-xl',
        toneStyles[tone].soft,
        sizes[size],
        className,
      )}
    >
      <Icon strokeWidth={1.75} />
    </span>
  )
}
