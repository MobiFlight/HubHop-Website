import type { GetStaticPaths, GetStaticProps } from "next"
import Link from "next/link"
import { useEffect } from "react"
import Layout from "@/components/Layout"
import AircraftBreadcrumb from "@/components/sections/aircraft/AircraftBreadcrumb"
import BreadcrumbJsonLd from "@/components/sections/aircraft/BreadcrumbJsonLd"
import NewToMobiFlight from "@/components/sections/aircraft/NewToMobiFlight"
import SystemSection from "@/components/sections/aircraft/SystemSection"
import {
  aircraftList,
  aircraftUrl,
  aircraftIndexUrl,
  aircraftSystemUrl,
  systemDescription,
  systemTitle,
  largeSystems,
  presetsOfAircraft,
  SIM_NAMES,
  systemSheets,
  type AircraftSummary,
  type SystemSheet,
} from "@/lib/aircraftPages"
import {
  presetListUrl,
  SIMS,
  simFromSegment,
  simSegment,
  type Sim,
} from "@/lib/presetUrls"
import { loadPresets } from "@/services/libraryStats"

type SystemPageProps = {
  sim: Sim
  aircraft: AircraftSummary
  system: SystemSheet
}

// only systems too large for the cheat sheet get a page
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await Promise.all(
    SIMS.map(async (sim) => {
      const presets = await loadPresets(sim)
      return aircraftList(presets).flatMap((entry) =>
        largeSystems(
          presetsOfAircraft(presets, entry.vendorSlug, entry.aircraftSlug),
        ).map((system) => ({
          params: {
            sim: simSegment(sim),
            vendor: entry.vendorSlug,
            aircraft: entry.aircraftSlug,
            system,
          },
        })),
      )
    }),
  )
  return { paths: paths.flat(), fallback: false }
}

export const getStaticProps: GetStaticProps<SystemPageProps> = async ({
  params,
}) => {
  const sim = simFromSegment(String(params?.sim))
  if (!sim) return { notFound: true }
  const presets = presetsOfAircraft(
    await loadPresets(sim),
    String(params?.vendor),
    String(params?.aircraft),
  )
  const [aircraft] = aircraftList(presets)
  const system = systemSheets(presets, Infinity).find(
    (entry) => entry.slug === params?.system,
  )
  if (!aircraft || !system) return { notFound: true }
  return { props: { sim, aircraft, system } }
}

/** All presets of one large system of an aircraft */
const SystemPage = ({ sim, aircraft, system }: SystemPageProps) => {
  const name = `${aircraft.vendor} ${aircraft.aircraft}`
  const simName = SIM_NAMES[sim]
  const sheetUrl = aircraftUrl(sim, aircraft.vendorSlug, aircraft.aircraftSlug)

  useEffect(() => {
    document.body.classList.toggle("xplane", sim === "xplane")
  }, [sim])

  return (
    <Layout
      title={systemTitle(sim, aircraft, system)}
      description={systemDescription(sim, aircraft, system)}
      path={aircraftSystemUrl(
        sim,
        aircraft.vendorSlug,
        aircraft.aircraftSlug,
        system.slug,
      )}
    >
      <BreadcrumbJsonLd
        items={[
          { name: "Aircraft", path: aircraftIndexUrl(sim) },
          { name, path: sheetUrl },
          {
            name: system.name,
            path: aircraftSystemUrl(
              sim,
              aircraft.vendorSlug,
              aircraft.aircraftSlug,
              system.slug,
            ),
          },
        ]}
      />
      <main className="container mx-auto flex flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-4">
          <AircraftBreadcrumb sim={sim} {...aircraft} system={system.name} />
          <h1 className="text-4xl font-extrabold md:text-5xl">
            {name} {system.name} <span className="text-primary">presets</span>
          </h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            All {system.total} {system.name} presets of the {name} in {simName}.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <Link
              href={sheetUrl}
              className="font-semibold text-primary hover:underline"
            >
              ← All systems of the {name}
            </Link>
            <Link
              href={presetListUrl({
                sim,
                vendor: aircraft.vendorSlug,
                aircraft: aircraft.aircraftSlug,
                system: system.name,
              })}
              className="font-semibold text-primary hover:underline"
            >
              Open in preset search →
            </Link>
          </div>
        </header>
        <SystemSection system={system} heading={false} />
        <NewToMobiFlight aircraft={`the ${name}`} />
      </main>
    </Layout>
  )
}

export default SystemPage
