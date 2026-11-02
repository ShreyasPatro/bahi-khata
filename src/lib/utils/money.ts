import { CURRENCY } from '@/constants/design-tokens'

export interface FormatMoneyOptions {
  /** Fraction digits. `auto` shows paise only when the amount has them. */
  decimals?: 0 | 2 | 'auto'
  /** Lakh / crore short form, e.g. ₹12.5 L. */
  compact?: boolean
  /** Prefix positive amounts with "+". Negative amounts always use a true minus sign. */
  showSign?: boolean
}

const MINUS = '−'

const formatters = {
  0: new Intl.NumberFormat(CURRENCY.locale, { maximumFractionDigits: 0 }),
  2: new Intl.NumberFormat(CURRENCY.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
}

export interface MoneyParts {
  sign: '' | '+' | typeof MINUS
  symbol: string
  whole: string
  fraction: string
  suffix: string
}

/** Presentation-only formatting. Ledger arithmetic is out of scope for the design system. */
export function getMoneyParts(amount: number, options: FormatMoneyOptions = {}): MoneyParts {
  const { decimals = 'auto', compact = false, showSign = false } = options
  const abs = Math.abs(amount)
  const sign = amount < 0 ? MINUS : showSign && amount > 0 ? '+' : ''

  if (compact && abs >= 1_000) {
    const [value, suffix] =
      abs >= 1_00_00_000
        ? [abs / 1_00_00_000, ' Cr']
        : abs >= 1_00_000
          ? [abs / 1_00_000, ' L']
          : [abs / 1_000, 'K']
    const text = value.toFixed(value >= 100 ? 0 : 1).replace(/\.0$/, '')
    return { sign, symbol: CURRENCY.symbol, whole: text, fraction: '', suffix }
  }

  const hasPaise = Math.round(abs * 100) % 100 !== 0
  const digits = decimals === 'auto' ? (hasPaise ? 2 : 0) : decimals
  const [whole = '0', fraction = ''] = formatters[digits].format(abs).split('.')
  return { sign, symbol: CURRENCY.symbol, whole, fraction, suffix: '' }
}

export function formatMoney(amount: number, options?: FormatMoneyOptions): string {
  const { sign, symbol, whole, fraction, suffix } = getMoneyParts(amount, options)
  return `${sign}${symbol}${whole}${fraction ? `.${fraction}` : ''}${suffix}`
}

/** Spoken form for screen readers, e.g. "minus 1,250 rupees". */
export function spokenMoney(amount: number, options?: FormatMoneyOptions): string {
  const { sign, whole, fraction, suffix } = getMoneyParts(amount, options)
  const prefix = sign === MINUS ? 'minus ' : sign === '+' ? 'plus ' : ''
  const unit =
    suffix.trim() === 'L'
      ? ' lakh'
      : suffix.trim() === 'Cr'
        ? ' crore'
        : suffix.trim() === 'K'
          ? ' thousand'
          : ''
  return `${prefix}${whole}${fraction ? ` point ${fraction}` : ''}${unit} rupees`
}
