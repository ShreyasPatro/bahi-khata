import { formatMoney, spokenMoney } from '@/lib/utils/money'

describe('formatMoney', () => {
  it('uses Indian digit grouping', () => {
    expect(formatMoney(1234567)).toBe('₹12,34,567')
  })

  it('shows paise only when present in auto mode', () => {
    expect(formatMoney(1250)).toBe('₹1,250')
    expect(formatMoney(1250.5)).toBe('₹1,250.50')
  })

  it('uses a true minus sign and optional plus sign', () => {
    expect(formatMoney(-480)).toBe('−₹480')
    expect(formatMoney(480, { showSign: true })).toBe('+₹480')
  })

  it('compacts into thousands, lakhs and crores', () => {
    expect(formatMoney(12500, { compact: true })).toBe('₹12.5K')
    expect(formatMoney(345000, { compact: true })).toBe('₹3.5 L')
    expect(formatMoney(25000000, { compact: true })).toBe('₹2.5 Cr')
  })

  it('produces a spoken form', () => {
    expect(spokenMoney(-1250)).toBe('minus 1,250 rupees')
  })
})
