import Link from "next/link"
import AircraftBreadcrumb from "@/components/sections/aircraft/AircraftBreadcrumb"
import {
  formatDate,
  sheetIntro,
  SIM_NAMES,
  type AircraftSheet,
} from "@/lib/aircraftPages"
import { presetListUrl, type Sim } from "@/lib/presetUrls"

const format = (value: number) => value.toLocaleString("en-US")

type SheetHeaderProps = {
  sim: Sim
  sheet: AircraftSheet
}

/** Breadcrumb, title and what the data says about the aircraft */
const SheetHeader = ({ sim, sheet }: SheetHeaderProps) => (
  <header className="flex flex-col gap-4">
    <AircraftBreadcrumb sim={sim} {...sheet} />
    <h1 className="text-4xl font-extrabold md:text-5xl">
      {sheet.vendor} {sheet.aircraft}{" "}
      <span className="text-primary">preset cheat sheet</span>
    </h1>
    <p className="max-w-3xl text-lg text-muted-foreground">
      {sheetIntro(sheet)} Copy a code from here, or get them all in MobiFlight
      with Extras › HubHop › Download Latest Presets.
    </p>
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
      <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        <div className="flex gap-1">
          <dt>Sim:</dt>
          <dd className="font-semibold text-foreground">{SIM_NAMES[sim]}</dd>
        </div>
        {sheet.lastChange && (
          <div className="flex gap-1">
            <dt>Last change:</dt>
            <dd className="font-semibold text-foreground">
              {formatDate(sheet.lastChange)}
            </dd>
          </div>
        )}
        {sheet.topContributors.length > 0 && (
          <div className="flex gap-1">
            <dt>Top contributors:</dt>
            <dd>
              {sheet.topContributors.map((contributor, index) => (
                <span key={contributor.name}>
                  {index > 0 && " · "}
                  <strong className="text-foreground">
                    {contributor.name}
                  </strong>{" "}
                  ({format(contributor.presets)})
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>
      <Link
        href={presetListUrl({
          sim,
          vendor: sheet.vendorSlug,
          aircraft: sheet.aircraftSlug,
        })}
        className="text-sm font-semibold text-primary hover:underline"
      >
        Open in preset search →
      </Link>
    </div>
  </header>
)

export default SheetHeader
