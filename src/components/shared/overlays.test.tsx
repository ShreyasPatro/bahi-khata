import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { FormField } from '@/components/shared/FormField'
import { SearchInput } from '@/components/shared/SearchInput'

function ConfirmHarness({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(true)
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={setOpen}
      title="Delete?"
      description="Cannot be undone."
      confirmLabel="Delete"
      destructive
      onConfirm={onConfirm}
    />
  )
}

describe('ConfirmDialog', () => {
  it('confirms and cancels', async () => {
    const onConfirm = vi.fn()
    render(<ConfirmHarness onConfirm={onConfirm} />)
    expect(screen.getByRole('dialog', { name: 'Delete?' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onConfirm).toHaveBeenCalledOnce()
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('FormField', () => {
  it('links the label, wires aria-invalid and announces the error', () => {
    render(
      <FormField label="Amount" error="Enter an amount">
        {(aria) => <input {...aria} />}
      </FormField>,
    )
    const input = screen.getByLabelText('Amount')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Enter an amount')
    expect(screen.getByRole('alert')).toHaveTextContent('Enter an amount')
  })
})

describe('SearchInput', () => {
  it('reports changes and clears', async () => {
    const onValueChange = vi.fn()
    render(<SearchInput value="abc" onValueChange={onValueChange} label="Search people" />)
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(onValueChange).toHaveBeenCalledWith('')
  })
})
