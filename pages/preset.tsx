import { useLiveQuery } from "dexie-react-hooks"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import PresetView from "../components/sections/presets/singlePresetView/PresetView"
import { presetTable } from "../services/presetSync"
import type { Preset } from "../interfaces/preset"

const Preset = () => {
  useEffect(() => {
    document.body.classList.toggle(
      "xplane",
      localStorage.getItem("simType") !== "msfs2020",
    )
  }, [])

  const router = useRouter()
  const { id, simType } = router.query
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<Preset[]>([])

  if (typeof window !== "undefined") {
    localStorage.setItem(
      "simType",
      window.location.href.includes("msfs2020") ? "msfs2020" : "xplane",
    )
  }

  const sim = simType === "xplane" ? "xplane" : "msfs2020"
  const [fetchDone, setFetchDone] = useState(false)

  const cachedPreset = useLiveQuery(
    () => (id ? presetTable(sim).get(id as string) : undefined),
    [id, sim],
  )

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
          await presetTable(sim).delete(id as string)
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
      if (!id || !simType) {
        return
      }
      fetchPreset()
      if (simType === "msfs2020") {
        setLoading(true)
        await fetchHistory().catch((error) => console.error(error))
        setLoading(false)
      }
    }
    fetchHistoryRoutine()
  }, [id, simType, sim])

  // undefined keeps PresetView in its loading state until we know the answer
  const filterPreset = useMemo(
    () => (cachedPreset ? [cachedPreset] : fetchDone ? [] : undefined),
    [cachedPreset, fetchDone],
  )

  return (
    <>
      <PresetView preset={filterPreset} history={history} loading={loading} />
    </>
  )
}

export default Preset
