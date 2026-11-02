import { AlertCircle } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FieldControlProps {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: true
}

interface FormFieldProps {
  label: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
  /** Render prop: spread the supplied props onto the control to wire label, hint and error. */
  children: (control: FieldControlProps) => ReactNode
}

/** Label + control + hint/error, with ids and ARIA wired up. */
export function FormField({ label, hint, error, required, className, children }: FormFieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const hasMessage = Boolean(error ?? hint)

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={id} className="text-body-sm font-medium">
        {label}
        {required && (
          <span className="text-expense-ink" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </Label>
      {children({
        id,
        'aria-describedby': hasMessage ? messageId : undefined,
        'aria-invalid': error ? true : undefined,
      })}
      {error ? (
        <p
          id={messageId}
          role="alert"
          className="flex items-center gap-1 text-caption font-medium text-expense-ink"
        >
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={messageId} className="text-caption text-muted-foreground">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
