import { chartColors } from '@/constants/design-tokens'

export const donutPalette = [
  chartColors.primary,
  chartColors.primarySoft,
  chartColors.success,
  chartColors.warning,
  chartColors.expense,
]

export function donutColor(index: number): string {
  return donutPalette[index % donutPalette.length] ?? chartColors.primary
}
