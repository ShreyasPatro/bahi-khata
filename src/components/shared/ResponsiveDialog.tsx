import { BottomSheet, type BottomSheetProps } from '@/components/shared/BottomSheet'
import { Modal } from '@/components/shared/Modal'
import { useIsDesktop } from '@/hooks/useMediaQuery'

export type ResponsiveDialogProps = BottomSheetProps & { size?: 'sm' | 'md' | 'lg' }

/** Bottom sheet on phones, centered modal from the tablet breakpoint up. */
export function ResponsiveDialog({ size, ...props }: ResponsiveDialogProps) {
  const isDesktop = useIsDesktop()
  if (isDesktop) {
    return (
      <Modal
        open={props.open}
        onOpenChange={props.onOpenChange}
        title={props.title}
        description={props.description}
        footer={props.footer}
        className={props.className}
        size={size}
      >
        {props.children}
      </Modal>
    )
  }
  return <BottomSheet {...props} />
}
