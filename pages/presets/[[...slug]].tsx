import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"
import Layout from "@/components/Layout"
import PresetList from "@/components/sections/presets/Presets"
import PresetDetail from "@/components/sections/presets/singlePresetView/PresetDetail"
import {
  isSim,
  parsePresetsPath,
  presetListUrl,
  slugify,
} from "@/lib/presetUrls"

const description =
  "Search the community presets for MSFS and X-Plane by aircraft, system and code, and connect your home cockpit hardware with MobiFlight."

const queryValue = (value: string | string[] | undefined) =>
  typeof value === "string" && value ? value : undefined

/**
 * Every URL below /presets/ (see lib/presetUrls.ts). The static export writes
 * this page once; staticwebapp.config.json serves it for all of these paths.
 */
const Presets = () => {
  const router = useRouter()
  const segments = (router.query.slug as string[] | undefined) ?? []
  // the path is only known on the client, once the router is ready
  const route = router.isReady ? parsePresetsPath(segments) : undefined
  const sim = route && "sim" in route && isSim(route.sim) ? route.sim : null

  // other components read the sim from localStorage; set it before they render
  if (sim && typeof window !== "undefined") localStorage.setItem("simType", sim)

  // links from before used /presets/msfs2020/…; keep their filters
  const movedTo = route?.kind === "moved" ? route.path : undefined
  useEffect(() => {
    if (movedTo) router.replace(movedTo + window.location.search)
  }, [movedTo, router])

  useEffect(() => {
    if (sim) document.body.classList.toggle("xplane", sim === "xplane")
  }, [sim])

  // /presets/ opens the last used sim; old links /presets/?vendor=…&aircraft=… keep their filters
  useEffect(() => {
    if (route?.kind !== "default") return
    const { query } = router
    const stored = localStorage.getItem("simType")
    const vendor = queryValue(query.vendor)
    const aircraft = queryValue(query.aircraft)
    router.replace(
      presetListUrl({
        sim: isSim(query.sim) ? query.sim : isSim(stored) ? stored : "msfs2020",
        vendor: vendor && slugify(vendor),
        aircraft: aircraft && slugify(aircraft),
        search: queryValue(query.search),
        system: queryValue(query.system),
        presetType: queryValue(query.presetType),
        codeType: queryValue(query.codeType),
      }),
    )
  }, [route?.kind, router])

  if (route?.kind === "preset")
    return <PresetDetail key={route.id} sim={route.sim} id={route.id} />

  return (
    <Layout title="Presets | Hubhop by Mobiflight" description={description}>
      {route?.kind === "list" ? (
        <PresetList
          sim={route.sim}
          vendor={route.vendor}
          aircraft={route.aircraft}
        />
      ) : route?.kind === "unknownSim" || route?.kind === "notFound" ? (
        <div className="container mx-auto flex min-h-screen flex-col gap-3 p-3">
          <h1 className="text-2xl font-semibold">Page not found</h1>
          <p>
            {route.kind === "unknownSim"
              ? `HubHop has no presets for "${route.sim}".`
              : "This address doesn't point to presets."}
          </p>
          <Link href="/presets/" className="text-primary hover:underline">
            Show all presets
          </Link>
        </div>
      ) : null}
    </Layout>
  )
}

export default Presets
