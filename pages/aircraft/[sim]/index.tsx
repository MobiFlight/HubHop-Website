import type { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"
import Layout from "@/components/Layout"
import SimSwitch from "@/components/sections/Shared/SimSwitch"
import {
  aircraftIndexUrl,
  aircraftList,
  aircraftUrl,
  byMaker,
  SIM_NAMES,
  type AircraftSummary,
} from "@/lib/aircraftPages"
import {
  isSim,
  SIMS,
  simFromSegment,
  simSegment,
  type Sim,
} from "@/lib/presetUrls"
import { loadPresets } from "@/services/libraryStats"

type AircraftIndexProps = {
  sim: Sim
  aircraft: AircraftSummary[]
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: SIMS.map((sim) => ({ params: { sim: simSegment(sim) } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps<AircraftIndexProps> = async ({
  params,
}) => {
  const sim = simFromSegment(String(params?.sim))
  if (!sim) return { notFound: true }
  return { props: { sim, aircraft: aircraftList(await loadPresets(sim)) } }
}

const format = (value: number) => value.toLocaleString("en-US")

/** All aircraft of a sim, grouped by maker; each links to its cheat sheet */
const AircraftIndex = ({ sim, aircraft }: AircraftIndexProps) => {
  const router = useRouter()
  const simName = SIM_NAMES[sim]
  const makers = byMaker(aircraft)
  const title = `${simName} aircraft with MobiFlight presets | HubHop`

  useEffect(() => {
    document.body.classList.toggle("xplane", sim === "xplane")
  }, [sim])

  return (
    <Layout title={title}>
      <Head>
        <meta
          name="description"
          content={`Preset cheat sheets for ${format(aircraft.length)} ${simName} aircraft: every MobiFlight event and variable, by system.`}
        />
      </Head>
      <main className="container mx-auto flex flex-col gap-8 px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold">
              {simName} aircraft{" "}
              <span className="text-primary">preset cheat sheets</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {format(aircraft.length)} aircraft from {makers.size} makers. Pick
              yours to see every preset by system.
            </p>
          </div>
          <SimSwitch
            value={sim}
            onValueChange={(value) =>
              isSim(value) && router.push(aircraftIndexUrl(value))
            }
          />
        </div>
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...makers].map(([vendorSlug, entries]) => (
            <section
              key={vendorSlug}
              id={vendorSlug}
              aria-labelledby={`${vendorSlug}-heading`}
              className="flex scroll-mt-4 flex-col gap-2"
            >
              <h2 id={`${vendorSlug}-heading`} className="text-xl font-bold">
                {entries[0].vendor}
              </h2>
              <ul className="flex flex-col gap-1">
                {entries.map((entry) => (
                  <li key={entry.aircraftSlug}>
                    <Link
                      href={aircraftUrl(sim, vendorSlug, entry.aircraftSlug)}
                      className="flex justify-between gap-3 rounded-md px-2 py-1 hover:bg-card"
                    >
                      <span className="text-primary">{entry.aircraft}</span>
                      <span className="text-sm text-muted-foreground">
                        {format(entry.presets)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </Layout>
  )
}

export default AircraftIndex
