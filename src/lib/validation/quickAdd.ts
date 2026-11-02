import { z } from 'zod'

/** Visual-state schema for the quick-add preview form. Not a persisted ledger schema. */
export const quickAddSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, 'Enter an amount')
    .refine((value) => Number.isFinite(Number(value)), 'Use numbers only')
    .refine((value) => Number(value) > 0, 'Amount must be greater than zero'),
  category: z.string().min(1, 'Choose a category'),
  account: z.string().min(1, 'Choose an account'),
  date: z.date({ error: 'Pick a date' }),
  note: z.string().max(80, 'Keep notes under 80 characters').optional(),
})

export type QuickAddValues = z.infer<typeof quickAddSchema>
