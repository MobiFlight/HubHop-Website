import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"
import Layout from "../../components/Layout"
import PresetList from "../../components/sections/presets/Presets"
import PresetDetail from "../../components/sections/presets/singlePresetView/PresetDetail"
import {
  isSim,
  parsePresetsPath,
  presetListUrl,
  slugify,
} from "../../lib/presetUrls"

const description =
  "Get the preset for your favorite aircraft from Hubhop. The database is a community driven project. If you find events/variables of your favorite aircraft, please share them on Hubhop too."

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
    <Layout title="Presets | Hubhop by Mobiflight">
      <Head>
        <meta name="title" content="Presets | Hubhop by Mobiflight" />
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hubhop.mobiflight.com/" />
        <meta property="og:title" content="Presets | Hubhop by Mobiflight" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="@/assets/logo-big.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://hubhop.mobiflight.com/" />
        <meta
          property="twitter:title"
          content="Presets | Hubhop by Mobiflight"
        />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content="@/assets/logo-big.png" />
      </Head>
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
