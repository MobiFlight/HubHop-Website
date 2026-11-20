import { useLiveQuery } from "dexie-react-hooks"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import PresetView from "./PresetView"
import { presetTable } from "../../../../services/presetSync"
import { presetUrl, type Sim } from "../../../../lib/presetUrls"
import type { Preset } from "../../../../interfaces/preset"

type PresetDetailProps = {
  sim: Sim
  id: string
}

/** A single preset at /presets/<sim>/<vendor>/<aircraft>/<label>-<id>/ */
const PresetDetail = ({ sim, id }: PresetDetailProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<Preset[]>([])
  const [fetchDone, setFetchDone] = useState(false)

  const cachedPreset = useLiveQuery(() => presetTable(sim).get(id), [id, sim])

  useEffect(() => {
    // fetch the newest version of this one preset and store it in the local cache
    const fetchPreset = async () => {
      setFetchDone(false)
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_HUBHOP_API_BASEURL +
            "/" +
            sim +
            "/presets/" +
            id,
          { redirect: "follow" },
        )
        if (res.ok) {
          const fetchedPreset = await res.json()
          await presetTable(sim).put({ ...fetchedPreset, id })
        } else if (res.status === 404) {
          await presetTable(sim).delete(id)
        } else {
          throw new Error(`Loading preset ${id} failed: ${res.status}`)
        }
        // only a real answer from the server may turn into "does not exist"
        setFetchDone(true)
      } catch (error) {
        console.error(error)
      }
    }

    const fetchHistory = async () => {
      const res = await fetch(
        `https://hubhop-api-mgtm.azure-api.net/api/v1/msfs2020/history/presets/${id}`,
        { redirect: "follow" },
      )
      const fetchedHistory = await res.json()
      return setHistory(fetchedHistory[0]?.history || [])
    }

    async function fetchHistoryRoutine() {
      fetchPreset()
      if (sim === "msfs2020") {
        setLoading(true)
        await fetchHistory().catch((error) => console.error(error))
        setLoading(false)
      }
    }
    fetchHistoryRoutine()
  }, [id, sim])

  // the id finds the preset; vendor, aircraft and label in the URL follow its current values
  const canonicalUrl = cachedPreset && presetUrl(sim, cachedPreset)
  useEffect(() => {
    if (!canonicalUrl) return
    const current = window.location.pathname
    if (current !== canonicalUrl)
      router.replace(canonicalUrl + window.location.search, undefined, {
        shallow: true,
      })
  }, [canonicalUrl, router])

  // undefined keeps PresetView in its loading state until we know the answer
  const filterPreset = useMemo(
    () => (cachedPreset ? [cachedPreset] : fetchDone ? [] : undefined),
    [cachedPreset, fetchDone],
  )

  return (
    <PresetView preset={filterPreset} history={history} loading={loading} />
  )
}

export default PresetDetail
