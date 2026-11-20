import { IconCheck, IconLoader2 } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

type SavePresetButtonProps = {
  disabled: boolean
}

const SavePresetButton = ({ disabled }: SavePresetButtonProps) => {
  return (
    <Button disabled={disabled} className="w-full xl:w-fit">
      {disabled ? <IconLoader2 className="animate-spin" /> : <IconCheck />}
      Save
    </Button>
  )
}

export default SavePresetButton
