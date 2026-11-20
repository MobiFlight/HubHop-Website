import Link from "next/link"
import { aircraftUrl, type AircraftSummary } from "@/lib/aircraftPages"
import type { Sim } from "@/lib/presetUrls"

type MoreFromVendorProps = {
  sim: Sim
  vendor: string
  // the vendor's other aircraft
  aircraft: AircraftSummary[]
}

/** Links to the other cheat sheets of the same maker */
const MoreFromVendor = ({ sim, vendor, aircraft }: MoreFromVendorProps) =>
  aircraft.length > 0 && (
    <section aria-labelledby="more-from-vendor" className="flex flex-col gap-3">
      <h2 id="more-from-vendor" className="text-2xl font-extrabold">
        More from {vendor}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {aircraft.map((entry) => (
          <li key={entry.aircraftSlug}>
            <Link
              href={aircraftUrl(sim, entry.vendorSlug, entry.aircraftSlug)}
              className="flex gap-2 rounded-lg border bg-card px-4 py-2 transition-colors hover:border-primary"
            >
              <span className="font-semibold">{entry.aircraft}</span>
              <span className="text-muted-foreground">{entry.presets}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )

export default MoreFromVendor
