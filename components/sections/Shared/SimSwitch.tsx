import { cn } from "cn"
import { Card } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type SimSwitchProps = {
  value: string | null
  onValueChange: (sim: string) => void
  // default: full width in a card (preset list, stats); compact: inline (homepage)
  size?: "default" | "compact"
  className?: string
}

/** MSFS / X-Plane switch; the selected sim is orange (MSFS) or blue (X-Plane) */
const SimSwitch = ({
  value,
  onValueChange,
  size = "default",
  className,
}: SimSwitchProps) => {
  const compact = size === "compact"
  const item = compact ? "px-4 font-semibold" : "flex-1 px-4 text-lg"
  const toggle = (
    <ToggleGroup
      type="single"
      value={value ?? ""}
      onValueChange={(sim) => sim && onValueChange(sim)}
      aria-label="Simulator"
      variant={compact ? "outline" : "default"}
      className={compact ? cn("self-start", className) : "w-full"}
    >
      <ToggleGroupItem
        value="msfs2020"
        className={cn(
          item,
          "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
        )}
      >
        MSFS
      </ToggleGroupItem>
      <ToggleGroupItem
        value="xplane"
        className={cn(
          item,
          "data-[state=on]:bg-xplane data-[state=on]:text-primary-foreground",
        )}
      >
        X-Plane
      </ToggleGroupItem>
    </ToggleGroup>
  )
  return compact ? (
    toggle
  ) : (
    <Card className={cn("p-2", className)}>{toggle}</Card>
  )
}

export default SimSwitch
