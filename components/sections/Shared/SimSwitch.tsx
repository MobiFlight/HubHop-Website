import { cn } from "cn"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type SimSwitchProps = {
  value: string | null
  onValueChange: (sim: string) => void
  // e.g. the width: as wide as its labels by default, w-full to fill a column
  className?: string
}

// the selected sim is shown by one highlight that slides behind both options,
// orange for MSFS and blue for X-Plane; the options keep no background of their own
const itemClass =
  "relative z-10 px-4 font-semibold transition-colors data-[state=on]:bg-transparent data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-transparent data-[state=on]:hover:text-primary-foreground"

/** MSFS / X-Plane switch, the same on every page */
const SimSwitch = ({ value, onValueChange, className }: SimSwitchProps) => (
  <ToggleGroup
    type="single"
    value={value ?? ""}
    onValueChange={(sim) => sim && onValueChange(sim)}
    aria-label="Simulator"
    spacing={0}
    // two equal columns, so the highlight moves by exactly its own width
    className={cn(
      "relative grid w-fit min-w-56 grid-cols-2 rounded-lg border bg-card p-1",
      className,
    )}
  >
    <span
      aria-hidden="true"
      className={cn(
        "absolute top-1 left-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] rounded-md transition-[translate,background-color] duration-200 ease-out motion-reduce:transition-none",
        value === "xplane" ? "translate-x-full bg-xplane" : "bg-primary",
        !value && "hidden",
      )}
    />
    <ToggleGroupItem value="msfs2020" className={itemClass}>
      MSFS
    </ToggleGroupItem>
    <ToggleGroupItem value="xplane" className={itemClass}>
      X-Plane
    </ToggleGroupItem>
  </ToggleGroup>
)

export default SimSwitch
