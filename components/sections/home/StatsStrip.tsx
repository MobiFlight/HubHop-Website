import { Skeleton } from "@/components/ui/skeleton"
import type { Statistics } from "../../../interfaces/preset"
import type { SimLibraryStats } from "../../../services/libraryStats"

const format = (value: number) => value.toLocaleString("en-US")

type StatProps = {
  value: React.ReactNode
  label: React.ReactNode
  highlight?: boolean
}

const Stat = ({ value, label, highlight = false }: StatProps) => (
  <div className="flex flex-col gap-1 bg-card px-7 py-6">
    <dt className="order-2 text-muted-foreground">{label}</dt>
    <dd
      className={`text-4xl font-extrabold tracking-tight ${highlight ? "text-primary" : ""}`}
    >
      {value}
    </dd>
  </div>
)

type StatsStripProps = {
  library: SimLibraryStats
  // live statistics of the sim; null while loading
  stats: Statistics | null
}

/** Library size from the build, most covered aircraft and top contributor live */
const StatsStrip = ({ library, stats }: StatsStripProps) => {
  const aircraft = stats?.aircrafts[0]
  const contributor = stats?.contributors[0]
  const loading = <Skeleton className="h-10 w-24" />
  return (
    <section aria-label="HubHop in numbers" className="container mx-auto px-6">
      <dl className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-px overflow-hidden rounded-2xl border bg-border">
        <Stat value={format(library.presets)} label="presets in the library" />
        <Stat
          value={format(library.contributors)}
          label="community contributors"
        />
        <Stat
          value={aircraft ? format(aircraft.presetCount) : loading}
          label={
            aircraft
              ? `presets for the ${aircraft._id.vendor} ${aircraft._id.aircraft} — the most covered aircraft`
              : "presets for the most covered aircraft"
          }
        />
        <Stat
          highlight
          value={contributor ? format(contributor.contributions) : loading}
          label={
            contributor
              ? `presets by ${contributor._id}, top contributor`
              : "presets by the top contributor"
          }
        />
      </dl>
    </section>
  )
}

export default StatsStrip
