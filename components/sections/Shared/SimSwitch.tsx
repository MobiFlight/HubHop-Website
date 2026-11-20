import { cn } from "cn"
import { Card } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type SimSwitchProps = {
  value: string | null
  onValueChange: (sim: string) => void
  className?: string
}

/** MSFS 2020 / X-Plane switch; the selected sim is orange (MSFS) or blue (X-Plane) */
const SimSwitch = ({ value, onValueChange, className }: SimSwitchProps) => {
  return (
    <Card className={cn("p-2", className)}>
      <ToggleGroup
        type="single"
        value={value ?? ""}
        onValueChange={(sim) => sim && onValueChange(sim)}
        aria-label="Simulator"
        className="w-full"
      >
        <ToggleGroupItem
          value="msfs2020"
          className="flex-1 px-4 text-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          MSFS 2020
        </ToggleGroupItem>
        <ToggleGroupItem
          value="xplane"
          className="flex-1 px-4 text-lg data-[state=on]:bg-xplane data-[state=on]:text-primary-foreground"
        >
          X-Plane
        </ToggleGroupItem>
      </ToggleGroup>
    </Card>
  )
}

export default SimSwitch
