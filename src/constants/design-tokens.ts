/**
 * TypeScript mirror of the tokens that code (not CSS) needs.
 * Colour values are CSS variable references so `src/styles/tokens.css` stays the single source.
 */

export const breakpoints = {
  sm: 430,
  md: 768,
  lg: 1024,
  xl: 1440,
} as const

export const mediaQueries = {
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
} as const

export const motion = {
  fast: 120,
  base: 200,
  slow: 320,
} as const

/** Chart series colours, resolved by the browser from the CSS tokens. */
export const chartColors = {
  primary: 'var(--chart-1)',
  primarySoft: 'var(--chart-2)',
  success: 'var(--chart-3)',
  warning: 'var(--chart-4)',
  expense: 'var(--chart-5)',
  grid: 'var(--border)',
  axis: 'var(--subtle-foreground)',
} as const

export const CURRENCY = {
  locale: 'en-IN',
  code: 'INR',
  symbol: '₹',
} as const

export const BRAND = {
  name: 'Bahi',
  tagline: 'Every rupee, accounted for.',
} as const
