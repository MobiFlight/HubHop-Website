import Head from "next/head"
import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import { Skeleton } from "@/components/ui/skeleton"
import SimSwitch from "../components/sections/Shared/SimSwitch"
import GeneralStats from "../components/sections/stats/GeneralStats"
import TableStats from "../components/sections/stats/TableStats"
import { presetTable, syncSim } from "../services/presetSync"
import type { Preset, Statistics } from "../interfaces/preset"

const Stats = () => {
  const [presets, setPresets] = useState<Preset[]>([])
  const [stats, setStats] = useState<Statistics | null>(null)
  const [simType, setSimType] = useState<string | null>(null)

  useEffect(() => {
    // Initialize simType based on localStorage if available
    if (typeof window !== "undefined") {
      setSimType(localStorage.getItem("simType") || "msfs2020")
    }
  }, [])

  useEffect(() => {
    // Fetch stats and presets based on simType, once it is known
    if (!simType) return
    setStats(null)
    setPresets([])
    const statsUrl =
      simType === "msfs2020"
        ? process.env.NEXT_PUBLIC_HUBHOP_API_STATS_MSFS
        : process.env.NEXT_PUBLIC_HUBHOP_API_STATS_XPLANE
    const sim = simType === "xplane" ? "xplane" : "msfs2020"
    let cancelled = false

    fetch(statsUrl || "", { redirect: "follow" })
      .then((res) => res.json())
      .then((data: Statistics) => !cancelled && setStats(data))

    syncSim(sim)
      .catch((error) => console.error(error))
      .then(() => presetTable(sim).toArray())
      .then((data) => !cancelled && setPresets(data))

    return () => {
      cancelled = true
    }
  }, [simType])

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.classList.toggle("xplane", simType === "xplane")
    }
  }, [simType])

  const sim = simType === "xplane" ? "xplane" : "msfs2020"

  const changeSimType = (newSimType: string) => {
    setSimType(newSimType)
    localStorage.setItem("simType", newSimType)
  }

  return (
    <Layout title="Stats | Hubhop by Mobiflight">
      <Head>
        <meta name="title" content="Stats | Hubhop by Mobiflight" />
        <meta
          name="description"
          content="Get the preset for your favorite aircraft from Hubhop. The database is a community driven project. If you find events/variables of your favorite aircraft, please share them on Hubhop too."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hubhop.mobiflight.com/" />
        <meta property="og:title" content="Stats | Hubhop by Mobiflight" />
        <meta
          property="og:description"
          content="Get the preset for your favorite aircraft from Hubhop. The database is a community driven project. If you find events/variables of your favorite aircraft, please share them on Hubhop too."
        />
        <meta property="og:image" content="@/assets/logo-big.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://hubhop.mobiflight.com/" />
        <meta property="twitter:title" content="Stats | Hubhop by Mobiflight" />
        <meta
          property="twitter:description"
          content="Get the preset for your favorite aircraft from Hubhop. The database is a community driven project. If you find events/variables of your favorite aircraft, please share them on Hubhop too."
        />
        <meta property="twitter:image" content="@/assets/logo-big.png" />
      </Head>
      <div className="mb-5 min-h-screen p-3">
        <div className="container mx-auto mb-3">
          <SimSwitch value={simType} onValueChange={changeSimType} />
        </div>
        <GeneralStats presets={presets} stats={stats} sim={sim} />
        {presets.length ? (
          <div className="container mx-auto mt-5">
            <h2 className="text-2xl font-semibold">Latest added presets</h2>
            <TableStats
              data={stats?.presetsAdded ?? []}
              added={true}
              sim={sim}
            />
          </div>
        ) : (
          <div className="container mx-auto mt-5">
            <h2 className="text-2xl font-semibold">Latest added presets</h2>
            <Skeleton className="mt-5 h-48 w-full" />
          </div>
        )}
        {presets.length ? (
          <div className="container mx-auto mt-5">
            <h2 className="text-2xl font-semibold">Latest updated presets</h2>
            <TableStats
              data={stats?.presetsUpdated ?? []}
              added={false}
              sim={sim}
            />
          </div>
        ) : (
          <div className="container mx-auto mt-5">
            <h2 className="text-2xl font-semibold">Latest updated presets</h2>
            <Skeleton className="mt-5 h-48 w-full" />
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Stats
