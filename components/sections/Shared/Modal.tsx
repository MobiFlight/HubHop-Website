import { cn } from "cn"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ModalProps = {
  children: React.ReactNode
  title: string
  onClose: () => void
  /** false: only the close button closes the dialog (no outside click or Escape) */
  dismissible?: boolean
  className?: string
}

/** shadcn Dialog with HubHop defaults; rendered while open */
const Modal = ({
  children,
  title,
  onClose,
  dismissible = true,
  className,
}: ModalProps) => {
  const keepOpen = (event: Event) => {
    if (!dismissible) event.preventDefault()
  }
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn("max-h-[90vh] overflow-y-auto sm:max-w-fit", className)}
        onInteractOutside={keepOpen}
        onEscapeKeyDown={keepOpen}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default Modal
