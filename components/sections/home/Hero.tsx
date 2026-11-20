import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { IconSearch } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import HubGraphic from "./HubGraphic"
import SimSwitch from "../Shared/SimSwitch"
import {
  isSim,
  presetListUrl,
  slugify,
  type Sim,
} from "../../../lib/presetUrls"
import { todaysActivity } from "../../../lib/recentActivity"
import { track } from "../../../services/analytics"
import type { Statistics } from "../../../interfaces/preset"

const searchExample: Record<Sim, string> = {
  msfs2020: "Fenix A320 APU",
  xplane: "C172 beacon",
}

type HeroProps = {
  sim: Sim
  onSimChange: (sim: Sim) => void
  // number of presets of the sim, from the build
  presetCount: number
  // live statistics of the sim; null while loading
  stats: Statistics | null
}

const Hero = ({ sim, onSimChange, presetCount, stats }: HeroProps) => {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const activity = stats ? todaysActivity(stats.presetsAdded) : undefined
  const popular = stats?.aircrafts.slice(0, 4)

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const search = query.trim()
    track("home_search_submit", { sim, has_query: search !== "" })
    router.push(presetListUrl({ sim, search }))
  }

  return (
    <section className="container mx-auto flex flex-wrap items-center gap-12 px-6 pt-16 pb-16 md:pt-24">
      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-6">
        {/* keeps its space, so the headline doesn't jump when the note appears */}
        <div className="min-h-9">
          {activity && (
            <p className="flex items-center gap-2 self-start rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-primary motion-safe:animate-pulse-dot"
              />
              {activity.count} new preset{activity.count > 1 ? "s" : ""} for the{" "}
              {activity.vendor} {activity.aircraft} today
            </p>
          )}
        </div>
        <h1 className="text-5xl leading-none font-extrabold tracking-tight text-primary md:text-6xl">
          Create, Share, Improve
        </h1>
        <p className="max-w-xl text-xl text-muted-foreground">
          The community library of events and variables that connects your
          cockpit hardware to the sim. Find the preset for any switch, in any
          aircraft — then use it straight from MobiFlight.
        </p>

        <form role="search" onSubmit={submit} className="flex flex-col gap-3">
          <SimSwitch
            value={sim}
            onValueChange={(value) => isSim(value) && onSimChange(value)}
          />
          <div className="flex items-center gap-3 rounded-2xl border bg-card py-2 pr-2 pl-5 shadow-lg ring-4 ring-primary/10 focus-within:ring-primary/30">
            <IconSearch aria-hidden="true" className="size-6 text-primary" />
            <label htmlFor="home-search" className="sr-only">
              Search presets
            </label>
            <Input
              id="home-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${presetCount.toLocaleString("en-US")} presets — try “${searchExample[sim]}”`}
              className="h-12 min-w-0 flex-1 border-0 bg-transparent text-lg shadow-none focus-visible:ring-0 md:text-lg dark:bg-transparent"
            />
            <Button type="submit" size="lg" className="h-12 px-6 text-base">
              Search
            </Button>
          </div>
          {popular === undefined ? (
            <Skeleton className="h-11 w-3/4" />
          ) : (
            popular.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="mr-1 text-muted-foreground">Popular:</span>
                {popular.map(({ _id: { vendor, aircraft } }) => (
                  <Link
                    key={`${vendor} ${aircraft}`}
                    href={presetListUrl({
                      sim,
                      vendor: slugify(vendor),
                      aircraft: slugify(aircraft),
                    })}
                    onClick={() =>
                      track("popular_aircraft_click", {
                        aircraft: `${vendor} ${aircraft}`,
                      })
                    }
                    className="flex min-h-11 items-center rounded-full border bg-card px-3 transition-colors hover:border-primary hover:text-primary"
                  >
                    {vendor} {aircraft}
                  </Link>
                ))}
              </div>
            )
          )}
        </form>
        <a
          href="https://www.mobiflight.com/en/index.html"
          target="_blank"
          className="self-start text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          Created and sponsored by Mobiflight and the Mobiflight community
        </a>
      </div>
      <div className="flex min-w-0 flex-[1_1_360px] justify-center">
        <HubGraphic />
      </div>
    </section>
  )
}

export default Hero
