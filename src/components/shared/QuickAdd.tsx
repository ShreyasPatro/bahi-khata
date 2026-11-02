import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { categoryKeys, getCategory } from '@/components/financial/categories'
import { DatePicker } from '@/components/shared/DatePicker'
import { FormField } from '@/components/shared/FormField'
import { PrimaryButton } from '@/components/shared/PrimaryButton'
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { quickAddSchema, type QuickAddValues } from '@/lib/validation/quickAdd'

const accounts = [
  'HDFC Savings •• 4821',
  'ICICI Credit •• 1190',
  'Cash in hand',
  'Paytm UPI wallet',
]
const expenseCategories = categoryKeys.filter((key) => key !== 'salary' && key !== 'transfer')

interface QuickAddProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Quick entry: bottom sheet on phones, modal on larger screens. Preview only — nothing is saved. */
export function QuickAdd({ open, onOpenChange }: QuickAddProps) {
  const [kind, setKind] = useState('expense')
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuickAddValues>({
    resolver: zodResolver(quickAddSchema),
    defaultValues: { amount: '', category: '', account: '', note: '', date: new Date() },
  })

  const onSubmit = async (values: QuickAddValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    toast.success(
      `${kind === 'expense' ? 'Expense' : kind === 'income' ? 'Income' : 'Transfer'} of ₹${values.amount} added`,
      {
        description: 'Design preview — nothing was saved.',
      },
    )
    reset()
    onOpenChange(false)
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset()
        onOpenChange(next)
      }}
      title="Add transaction"
      description="Quick entry. Fields validate as you submit."
      footer={
        <PrimaryButton
          type="submit"
          form="quick-add-form"
          fullWidth
          loading={isSubmitting}
          loadingText="Saving…"
        >
          Save transaction
        </PrimaryButton>
      }
    >
      <form
        id="quick-add-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4 pt-1 pb-2"
      >
        <Tabs value={kind} onValueChange={setKind}>
          <TabsList className="grid h-(--h-control-md) w-full grid-cols-3">
            <TabsTrigger value="expense">Expense</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
          </TabsList>
        </Tabs>

        <FormField label="Amount" required error={errors.amount?.message}>
          {(aria) => (
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-title font-semibold text-muted-foreground"
              >
                ₹
              </span>
              <Input
                {...aria}
                {...register('amount')}
                inputMode="decimal"
                autoComplete="off"
                placeholder="0"
                className="h-14 pl-8 text-headline font-semibold tabular-nums md:h-14 md:text-headline"
              />
            </div>
          )}
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Category" required error={errors.category?.message}>
            {({ id, ...aria }) => (
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id={id} className="w-full" {...aria}>
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((key) => (
                        <SelectItem key={key} value={key}>
                          {getCategory(key).label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </FormField>

          <FormField label="Account" required error={errors.account?.message}>
            {({ id, ...aria }) => (
              <Controller
                control={control}
                name="account"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id={id} className="w-full" {...aria}>
                      <SelectValue placeholder="Choose account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account} value={account}>
                          {account}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </FormField>
        </div>

        <FormField label="Date" error={errors.date?.message}>
          {({ id, 'aria-invalid': invalid }) => (
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  id={id}
                  value={field.value}
                  onChange={field.onChange}
                  invalid={Boolean(invalid)}
                />
              )}
            />
          )}
        </FormField>

        <FormField label="Note" hint="Optional" error={errors.note?.message}>
          {(aria) => <Input {...aria} {...register('note')} placeholder="What was it for?" />}
        </FormField>
      </form>
    </ResponsiveDialog>
  )
}
