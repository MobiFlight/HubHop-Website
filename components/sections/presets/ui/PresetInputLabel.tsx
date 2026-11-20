import { useId } from "react"
import { cn } from "cn"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type PresetPreviewLabelProps = {
  title: string
  edit?: boolean
  onValueChange?: (value: string) => void
  editData?: string | number | null
  codeOrDescriptionBox?: boolean
  /** In edit mode, offer only these values (select) instead of free text */
  options?: readonly string[]
  /** monospace, for preset code */
  mono?: boolean
}

/** A preset field: read-only while viewing, editable in edit mode */
const PresetPreviewLabel = ({
  title,
  edit,
  onValueChange,
  editData,
  codeOrDescriptionBox,
  options,
  mono,
}: PresetPreviewLabelProps) => {
  const id = useId()
  const value = String(editData ?? "")

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{title}</Label>
      {edit && options ? (
        <Select value={value} onValueChange={(v) => onValueChange?.(v)}>
          <SelectTrigger id={id} className="w-full" aria-label={title}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : codeOrDescriptionBox ? (
        <Textarea
          id={id}
          aria-label={title}
          rows={5}
          readOnly={!edit}
          className={cn("wrap-break-word", mono && "font-mono")}
          value={value}
          onChange={(e) => onValueChange?.(e.target.value)}
        />
      ) : (
        <Input
          id={id}
          aria-label={title}
          readOnly={!edit}
          className={cn(mono && "font-mono")}
          value={value}
          onChange={(e) => onValueChange?.(e.target.value)}
        />
      )}
    </div>
  )
}

export default PresetPreviewLabel
