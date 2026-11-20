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

// the selected sim is shown by one highlight that slides behind both options,
// orange for MSFS and blue for X-Plane; the options keep no background of their own
const itemClass =
  "relative z-10 transition-colors data-[state=on]:bg-transparent data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-transparent data-[state=on]:hover:text-primary-foreground"

/** MSFS / X-Plane switch */
const SimSwitch = ({
  value,
  onValueChange,
  size = "default",
  className,
}: SimSwitchProps) => {
  const compact = size === "compact"
  const item = cn(itemClass, compact ? "px-4 font-semibold" : "text-lg")
  const toggle = (
    <ToggleGroup
      type="single"
      value={value ?? ""}
      onValueChange={(sim) => sim && onValueChange(sim)}
      aria-label="Simulator"
      spacing={0}
      // two equal columns, so the highlight moves by exactly its own width
      className={cn(
        "relative grid grid-cols-2",
        compact ? cn("self-start rounded-md border p-1", className) : "w-full",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] rounded-md transition-[translate,background-color] duration-200 ease-out motion-reduce:transition-none",
          !compact && "left-0 h-full w-1/2",
          value === "xplane" ? "translate-x-full bg-xplane" : "bg-primary",
          !value && "hidden",
        )}
      />
      <ToggleGroupItem value="msfs2020" className={item}>
        MSFS
      </ToggleGroupItem>
      <ToggleGroupItem value="xplane" className={item}>
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
