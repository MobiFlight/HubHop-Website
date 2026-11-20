import Link from "next/link"
import { IconAppWindow } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { presetUrl, type Sim } from "../../../../lib/presetUrls"

type OpenPresetButtonProps = {
  sim: Sim
  preset: { id: string; vendor: string; aircraft: string; label: string }
}

const OpenPresetButton = ({ sim, preset }: OpenPresetButtonProps) => {
  return (
    <Button asChild>
      <Link href={presetUrl(sim, preset)} target="_blank">
        <IconAppWindow />
        View Details
      </Link>
    </Button>
  )
}

export default OpenPresetButton
