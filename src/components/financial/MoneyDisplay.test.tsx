import { render, screen } from '@testing-library/react'
import { MoneyDisplay } from '@/components/financial/MoneyDisplay'

describe('MoneyDisplay', () => {
  it('exposes a spoken amount to assistive tech and hides the visual digits', () => {
    const { container } = render(<MoneyDisplay amount={-1250} />)
    expect(screen.getByText('minus 1,250 rupees')).toHaveClass('sr-only')
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0)
  })

  it('colours positive amounts as income when tone is auto', () => {
    const { container } = render(<MoneyDisplay amount={500} tone="auto" showSign />)
    expect(container.firstElementChild).toHaveClass('text-success-ink')
  })

  it('keeps its type size when a tone colour is applied (tailwind-merge regression)', () => {
    const { container } = render(
      <MoneyDisplay
        amount={10}
        size="display"
        tone="inverse"
        className="text-primary-foreground"
      />,
    )
    expect(container.firstElementChild).toHaveClass('text-display')
    expect(container.firstElementChild).toHaveClass('text-primary-foreground')
  })
})
