import type { GetStaticProps } from "next"
import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import Hero from "../components/sections/home/Hero"
import HowItWorks from "../components/sections/home/HowItWorks"
import RecentChanges from "../components/sections/home/RecentChanges"
import StatsStrip from "../components/sections/home/StatsStrip"
import { db } from "../services/db"
import { loadLibraryStats, type LibraryStats } from "../services/libraryStats"
import { isSim, type Sim } from "../lib/presetUrls"
import type { Statistics } from "../interfaces/preset"

const statsUrl: Record<Sim, string | undefined> = {
  msfs2020: process.env.NEXT_PUBLIC_HUBHOP_API_STATS_MSFS,
  xplane: process.env.NEXT_PUBLIC_HUBHOP_API_STATS_XPLANE,
}

type HomeProps = {
  library: LibraryStats
}

// the numbers about the whole library are baked in at build time; the
// homepage itself never downloads the full preset list
export const getStaticProps: GetStaticProps<HomeProps> = async () => ({
  props: { library: await loadLibraryStats() },
})

const Home = ({ library }: HomeProps) => {
  const [sim, setSim] = useState<Sim>("msfs2020")
  const [stats, setStats] = useState<Statistics | null>(null)

  useEffect(() => {
    db.presets.count()
    db.presetsMsfs.count()
    db.presetsXplane.count()
    // the last used sim; read after the first render, so it matches the static HTML
    const stored = localStorage.getItem("simType")
    if (isSim(stored)) setSim(stored)
  }, [])

  useEffect(() => {
    const effect = { active: true }
    setStats(null)
    fetch(statsUrl[sim] ?? "", { redirect: "follow" })
      .then((res) => {
        if (!res.ok) throw new Error(`Loading statistics failed: ${res.status}`)
        return res.json()
      })
      .then((data: Statistics) => effect.active && setStats(data))
      .catch((error) => console.error(error))
    return () => {
      effect.active = false
    }
  }, [sim])

  const changeSim = (newSim: Sim) => {
    setSim(newSim)
    localStorage.setItem("simType", newSim)
  }

  return (
    <Layout title="Home | Hubhop by Mobiflight">
      <main className="flex flex-col gap-20 pb-24">
        <Hero
          sim={sim}
          onSimChange={changeSim}
          presetCount={library[sim].presets}
          stats={stats}
        />
        <StatsStrip library={library[sim]} stats={stats} />
        <div className="container mx-auto flex flex-wrap gap-8 px-6">
          <RecentChanges sim={sim} stats={stats} />
          <HowItWorks />
        </div>
      </main>
    </Layout>
  )
}

export default Home
