export type Tone = 'neutral' | 'primary' | 'success' | 'expense' | 'warning'

/** Semantic tone → class names. The only place tones map to colour tokens. */
export const toneStyles: Record<Tone, { soft: string; text: string; solid: string }> = {
  neutral: {
    soft: 'bg-muted text-muted-foreground',
    text: 'text-muted-foreground',
    solid: 'bg-foreground text-background',
  },
  primary: {
    soft: 'bg-primary-soft text-primary-dark',
    text: 'text-primary',
    solid: 'bg-primary text-primary-foreground',
  },
  success: {
    soft: 'bg-success-soft text-success-ink',
    text: 'text-success-ink',
    solid: 'bg-success text-primary-foreground',
  },
  expense: {
    soft: 'bg-expense-soft text-expense-ink',
    text: 'text-expense-ink',
    solid: 'bg-expense text-primary-foreground',
  },
  warning: {
    soft: 'bg-warning-soft text-warning',
    text: 'text-warning',
    solid: 'bg-warning text-primary-foreground',
  },
}
