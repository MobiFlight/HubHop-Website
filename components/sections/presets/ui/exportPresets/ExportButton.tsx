import { IconLoader2 } from "@tabler/icons-react"
import { cn } from "cn"
import { buttonVariants } from "@/components/ui/button"

type ExportButtonProps = {
  text: string
  loading: boolean
  disabled: boolean
}

// looks like a button; the surrounding element handles the click
const ExportButton = ({ text, loading, disabled }: ExportButtonProps) => {
  return (
    <span
      className={cn(
        buttonVariants({ variant: disabled ? "secondary" : "default" }),
        "w-full",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      {loading && <IconLoader2 className="animate-spin" />}
      {text}
    </span>
  )
}

export default ExportButton
