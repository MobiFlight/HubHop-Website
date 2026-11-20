import type { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"
import { useEffect } from "react"
import Layout from "../../../../../components/Layout"
import MoreFromVendor from "../../../../../components/sections/aircraft/MoreFromVendor"
import NewToMobiFlight from "../../../../../components/sections/aircraft/NewToMobiFlight"
import SheetHeader from "../../../../../components/sections/aircraft/SheetHeader"
import SystemSection from "../../../../../components/sections/aircraft/SystemSection"
import {
  aircraftList,
  aircraftSheet,
  aircraftSystemUrl,
  isIndexed,
  presetsOfAircraft,
  SIM_NAMES,
  SYSTEM_PREVIEW,
  type AircraftSheet,
  type AircraftSummary,
} from "../../../../../lib/aircraftPages"
import {
  SIMS,
  simFromSegment,
  simSegment,
  type Sim,
} from "../../../../../lib/presetUrls"
import { loadPresets } from "../../../../../services/libraryStats"

type CheatSheetProps = {
  sim: Sim
  sheet: AircraftSheet
  // the vendor's other aircraft
  related: AircraftSummary[]
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await Promise.all(
    SIMS.map(async (sim) =>
      aircraftList(await loadPresets(sim)).map((entry) => ({
        params: {
          sim: simSegment(sim),
          vendor: entry.vendorSlug,
          aircraft: entry.aircraftSlug,
        },
      })),
    ),
  )
  return { paths: paths.flat(), fallback: false }
}

export const getStaticProps: GetStaticProps<CheatSheetProps> = async ({
  params,
}) => {
  const sim = simFromSegment(String(params?.sim))
  if (!sim) return { notFound: true }
  const all = await loadPresets(sim)
  const vendorSlug = String(params?.vendor)
  const aircraftSlug = String(params?.aircraft)
  const presets = presetsOfAircraft(all, vendorSlug, aircraftSlug)
  if (presets.length === 0) return { notFound: true }
  const related = aircraftList(all).filter(
    (entry) =>
      entry.vendorSlug === vendorSlug && entry.aircraftSlug !== aircraftSlug,
  )
  return { props: { sim, sheet: aircraftSheet(presets), related } }
}

const format = (value: number) => value.toLocaleString("en-US")

/** The cheat sheet of an aircraft: every system with its inputs and outputs */
const CheatSheet = ({ sim, sheet, related }: CheatSheetProps) => {
  const name = `${sheet.vendor} ${sheet.aircraft}`
  const simName = SIM_NAMES[sim]
  const topSystems = [...sheet.systems]
    .sort((a, b) => b.total - a.total)
    .slice(0, 3)
    .map((system) => system.name)

  useEffect(() => {
    document.body.classList.toggle("xplane", sim === "xplane")
  }, [sim])

  return (
    <Layout
      title={`${name} MobiFlight presets — cheat sheet for every switch (${simName})`}
    >
      <Head>
        <meta
          name="description"
          content={`${format(sheet.presets)} MobiFlight presets for the ${name} in ${simName}, by system: ${topSystems.join(", ")} and more. Copy the code for every switch, knob and light.`}
        />
        {!isIndexed(sheet.presets) && <meta name="robots" content="noindex" />}
      </Head>
      <main className="container mx-auto flex flex-col gap-10 px-6 py-10">
        <SheetHeader
          sim={sim}
          sheet={sheet}
          systemCount={sheet.systems.length}
        />
        <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
          <nav
            aria-label="Systems"
            className="lg:sticky lg:top-4 lg:self-start"
          >
            <ul className="flex flex-wrap gap-1 lg:flex-col">
              {sheet.systems.map((system) => (
                <li key={system.slug}>
                  <a
                    href={`#${system.slug}`}
                    className="flex justify-between gap-3 rounded-md px-2 py-1 text-primary hover:bg-card"
                  >
                    {system.name}
                    <span className="text-muted-foreground">
                      {system.total}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex min-w-0 flex-col gap-10">
            {sheet.systems.map((system) => (
              <SystemSection
                key={system.slug}
                system={system}
                allPresetsUrl={
                  system.total > SYSTEM_PREVIEW
                    ? aircraftSystemUrl(
                        sim,
                        sheet.vendorSlug,
                        sheet.aircraftSlug,
                        system.slug,
                      )
                    : undefined
                }
              />
            ))}
          </div>
        </div>
        <MoreFromVendor sim={sim} vendor={sheet.vendor} aircraft={related} />
        <NewToMobiFlight aircraft={`the ${name}`} />
      </main>
    </Layout>
  )
}

export default CheatSheet
