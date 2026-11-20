import { useRouter } from "next/router"
import { useEffect } from "react"
import Layout from "../components/Layout"
import { isSim, simSegment } from "../lib/presetUrls"

/**
 * Old preset links (/preset/?simType=…&id=…, used by MobiFlight Connector and
 * in Discord) forward to /presets/<sim>/…/<id>/. Vendor, aircraft and label
 * aren't known here; the preset page corrects them once the preset is loaded.
 */
const OldPresetLink = () => {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return
    const { simType, id } = router.query
    if (typeof id !== "string" || !id) {
      router.replace("/presets/")
      return
    }
    const stored = localStorage.getItem("simType")
    const sim = isSim(simType) ? simType : isSim(stored) ? stored : "msfs2020"
    router.replace(`/presets/${simSegment(sim)}/-/-/${encodeURIComponent(id)}/`)
  }, [router])

  return (
    <Layout title="Preset | Hubhop by Mobiflight">
      <p role="status" className="min-h-screen p-3">
        Opening preset…
      </p>
    </Layout>
  )
}

export default OldPresetLink
