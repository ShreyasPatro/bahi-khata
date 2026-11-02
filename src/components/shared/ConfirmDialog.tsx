import { PrimaryButton } from '@/components/shared/PrimaryButton'
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog'

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  /** Use for irreversible actions (delete, settle). */
  destructive?: boolean
  loading?: boolean
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <PrimaryButton variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {cancelLabel}
          </PrimaryButton>
          <PrimaryButton
            variant={destructive ? 'destructive' : 'default'}
            loading={loading}
            onClick={onConfirm}
            autoFocus={!destructive}
          >
            {confirmLabel}
          </PrimaryButton>
        </div>
      }
    />
  )
}
