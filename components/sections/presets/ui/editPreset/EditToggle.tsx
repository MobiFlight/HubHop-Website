import { IconLock, IconLockOpen } from "@tabler/icons-react"
import { Toggle } from "@/components/ui/toggle"

type EditToggleProps = {
  toggleEdit: boolean
  onToggle: () => void
}

/** Switches a preset between viewing and editing */
const EditToggle = ({ toggleEdit, onToggle }: EditToggleProps) => {
  return (
    <Toggle
      variant="outline"
      pressed={toggleEdit}
      onPressedChange={onToggle}
      className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
    >
      {toggleEdit ? <IconLockOpen /> : <IconLock />}
      {toggleEdit ? "Edit" : "View"}
    </Toggle>
  )
}

export default EditToggle
