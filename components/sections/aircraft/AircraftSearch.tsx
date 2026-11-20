import { IconSearch } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { aircraftUrl, type AircraftSummary } from "@/lib/aircraftPages"
import { presetListUrl, type Sim } from "@/lib/presetUrls"

type AircraftSearchProps = {
  sim: Sim
  aircraft: AircraftSummary
}

/**
 * Searches the aircraft's presets in the preset search. A plain form: the
 * browser opens /presets/<sim>/<vendor>/<aircraft>/?search=…, also without JavaScript.
 */
const AircraftSearch = ({ sim, aircraft }: AircraftSearchProps) => {
  const name = `${aircraft.vendor} ${aircraft.aircraft}`
  const id = `search-${aircraftUrl(sim, aircraft.vendorSlug, aircraft.aircraftSlug).replace(/\W+/g, "-")}`
  return (
    <form
      role="search"
      method="get"
      action={presetListUrl({
        sim,
        vendor: aircraft.vendorSlug,
        aircraft: aircraft.aircraftSlug,
      })}
      className="flex max-w-3xl items-center gap-3 rounded-2xl border bg-card py-2 pr-2 pl-5 focus-within:ring-4 focus-within:ring-primary/30"
    >
      <IconSearch aria-hidden="true" className="size-5 shrink-0 text-primary" />
      <label htmlFor={id} className="sr-only">
        Search the {name} presets
      </label>
      <Input
        id={id}
        name="search"
        type="search"
        placeholder={`Search ${aircraft.presets.toLocaleString("en-US")} ${name} presets`}
        className="h-11 min-w-0 flex-1 border-0 bg-transparent text-base shadow-none focus-visible:ring-0 md:text-base dark:bg-transparent"
      />
      <Button type="submit" size="lg" className="h-11 px-5">
        Search
      </Button>
    </form>
  )
}

export default AircraftSearch
