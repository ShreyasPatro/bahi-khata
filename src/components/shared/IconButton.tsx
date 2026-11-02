import type { ComponentProps, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export interface IconButtonProps extends Omit<
  ComponentProps<typeof Button>,
  'children' | 'aria-label'
> {
  /** Required: icon-only buttons have no visible text. Also shown as a tooltip. */
  label: string
  icon: ReactNode
  tooltip?: boolean
}

export function IconButton({
  label,
  icon,
  tooltip = true,
  variant = 'ghost',
  size = 'icon',
  ...props
}: IconButtonProps) {
  const button = (
    <Button variant={variant} size={size} aria-label={label} {...props}>
      {icon}
    </Button>
  )
  if (!tooltip) return button
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
