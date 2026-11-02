import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const sizes = { sm: 'size-8 text-caption', md: 'size-10 text-body-sm', lg: 'size-12 text-body' }

interface PersonAvatarProps {
  name: string
  size?: keyof typeof sizes
  className?: string
}

function initialsOf(name: string): string {
  const parts = name
    .replace(/\(.*?\)/g, '')
    .trim()
    .split(/\s+/)
  return (
    (parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '')
  ).toUpperCase()
}

export function PersonAvatar({ name, size = 'md', className }: PersonAvatarProps) {
  return (
    <Avatar className={cn(sizes[size], className)} aria-hidden="true">
      <AvatarFallback className="bg-primary-soft font-semibold text-primary-dark">
        {initialsOf(name)}
      </AvatarFallback>
    </Avatar>
  )
}
