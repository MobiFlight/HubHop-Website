import { useEffect, useRef, useState } from "react"
import PresetFilter from "./presetTable/PresetFilter"
import PresetTable from "./presetTable/PresetTable"
import ExportPresetsModal from "./ui/exportPresets/ExportPresetsModal"
import AddPresetsModal from "./ui/addPreset/AddPresetsModal"
import PromoSlot from "../Shared/PromoSlot"
import SimSwitch from "../Shared/SimSwitch"
import { Skeleton } from "@/components/ui/skeleton"
import { getAccessToken } from "../../../services/msalFunctions"
import { msalInstance, msalReady } from "../../../services/msal"
import { db } from "../../../services/db"
import { syncSim } from "../../../services/presetSync"
import { useLiveQuery } from "dexie-react-hooks"

import { useRouter } from "next/router"
import type { Preset } from "../../../interfaces/preset"
import { type Facet, sortedUnique } from "../../../lib/presetFacets"
import type { PromotionContext } from "../../../lib/promotions"
import {
  comparePresets,
  presetRelevance,
  searchTerms,
} from "../../../lib/presetSearch"

// wait this long after the last keystroke before searching
const SEARCH_DELAY_MS = 250

type PresetListSkeletonProps = {
  status: string
  children: React.ReactNode
}

/** Placeholder of the preset list while presets download */
const PresetListSkeleton = ({ status, children }: PresetListSkeletonProps) => (
  <div className="min-h-screen p-3" aria-busy="true">
    <p role="status" className="mb-3 font-semibold">
      {status}
    </p>
    <div className="flex flex-col gap-3 md:flex-row">
      <div className="flex w-full flex-col gap-3 md:w-96">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-96 w-full" />
        {children}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {Array.from({ length: 12 }, (_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  </div>
)

const Presets = () => {
  const [loading, setLoading] = useState(false)
  const [presetsMsfs, setPresetsMsfs] = useState<Preset[]>([])
  const [presetsXplane, setPresetsXplane] = useState<Preset[]>([])
  const [filteredPresets, setFilteredPresets] = useState(
    typeof localStorage !== "undefined" &&
      localStorage.getItem("searchFilter") !== null
      ? localStorage.getItem("searchFilter") || ""
      : "",
  )
  // what is typed in the search box; filteredPresets follows it after a delay
  const [searchText, setSearchText] = useState(filteredPresets)
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [filteredVendors, setFilteredVendors] = useState(
    typeof localStorage !== "undefined" &&
      localStorage.getItem("vendorFilter") !== null
      ? localStorage.getItem("vendorFilter") || ""
      : "",
  )
  const [filteredAircrafts, setFilteredAircrafts] = useState(
    typeof localStorage !== "undefined" &&
      localStorage.getItem("aircraftFilter") !== null
      ? localStorage.getItem("aircraftFilter") || ""
      : "",
  )
  const [filteredSystems, setFilteredSystems] = useState(
    typeof localStorage !== "undefined" &&
      localStorage.getItem("systemFilter") !== null
      ? localStorage.getItem("systemFilter") || ""
      : "",
  )
  const [filteredPresetTypes, setFilteredPresetTypes] = useState(
    typeof localStorage !== "undefined" &&
      localStorage.getItem("presetTypeFilter") !== null
      ? localStorage.getItem("presetTypeFilter") || ""
      : "",
  )
  const [filteredCodeTypes, setFilteredCodeTypes] = useState(
    typeof localStorage !== "undefined" &&
      localStorage.getItem("codeTypeFilter") !== null
      ? localStorage.getItem("codeTypeFilter") || ""
      : "",
  )

  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [showMyPresets, setShowMyPresets] = useState(false)
  const [showReportedPresets, setShowReportedPresets] = useState(false)
  const [simType, setSimType] = useState(
    typeof localStorage !== "undefined" && localStorage.getItem("simType")
      ? localStorage.getItem("simType")
      : "msfs2020",
  )
  const [presets, setPresets] = useState<Preset[]>([])
  const [filterOpen, setFilterOpen] = useState(true)
  const [loadingStatus, setLoadingStatus] = useState("")

  const xplanePresets = useLiveQuery(() => db.presetsXplane.toArray())
  const msfsPresets = useLiveQuery(() => db.presetsMsfs.toArray())

  useEffect(() => {
    if (!xplanePresets) return undefined
    if (!msfsPresets) return undefined
    setPresetsXplane(xplanePresets)
    setPresetsMsfs(msfsPresets)
    // sorted once here, not on every render
    setPresets(
      [...(simType === "msfs2020" ? presetsMsfs : presetsXplane)].sort(
        comparePresets,
      ),
    )
  }, [simType, presetsMsfs, presetsXplane, xplanePresets, msfsPresets])

  useEffect(() => {
    if (addModalOpen) return
    const sim = simType === "xplane" ? "xplane" : "msfs2020"
    syncSim(sim, () => {
      setLoading(true)
      setLoadingStatus(
        sim === "msfs2020"
          ? "Downloading MSFS Presets"
          : "Downloading X-Plane Presets",
      )
    })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false)
        setLoadingStatus("")
      })
  }, [simType, addModalOpen])

  useEffect(() => {
    msalReady.then(() => {
      const account = msalInstance.getAllAccounts()[0]
      if (account) {
        getAccessToken()
      }
    })
  }, [])

  const filteredMyPresetList = presets.filter((preset) => {
    if (showReportedPresets) {
      return (preset.reported ?? 0) > 0
    }
    return presets
  })
  const filteredReportedPresets = filteredMyPresetList.filter((preset) => {
    if (showMyPresets) {
      if (localStorage.getItem("username")) {
        return (
          preset.author === localStorage.getItem("username") ||
          preset.updatedBy === localStorage.getItem("username")
        )
      }
    }
    return presets
  })
  // an empty filter matches every preset, including ones without that field
  const isFilteredBy = (value: string | undefined, filter: string) =>
    !filter || value?.toLowerCase() === filter.toLowerCase()
  // relevance per preset, computed once per render; empty while not searching
  const terms = searchTerms(filteredPresets)
  const relevance = new Map(
    terms.length > 0
      ? filteredReportedPresets.map((preset) => [
          preset,
          presetRelevance(preset, terms),
        ])
      : [],
  )
  const matchesSearch = (preset: Preset) =>
    terms.length === 0 || (relevance.get(preset) ?? 0) > 0

  const facetFilters: Record<Facet, (preset: Preset) => boolean> = {
    vendor: (preset) =>
      preset.vendor.toLowerCase().includes(filteredVendors.toLowerCase()),
    aircraft: (preset) => isFilteredBy(preset.aircraft, filteredAircrafts),
    system: (preset) => isFilteredBy(preset.system, filteredSystems),
    presetType: (preset) =>
      isFilteredBy(preset.presetType, filteredPresetTypes),
    codeType: (preset) => isFilteredBy(preset.codeType, filteredCodeTypes),
  }
  // ignoring one facet gives the presets its dropdown options come from
  const matchesFilters = (preset: Preset, ignoredFacet?: Facet) =>
    matchesSearch(preset) &&
    (Object.keys(facetFilters) as Facet[]).every(
      (facet) => facet === ignoredFacet || facetFilters[facet](preset),
    )

  // presets are already in the default order (comparePresets); the table's
  // stable sort keeps it for presets of equal relevance
  const filteredItems = filteredReportedPresets.filter((preset) =>
    matchesFilters(preset),
  )

  // Faceted search as in MobiFlight Connector: each dropdown lists the values
  // that match all other filters, so its siblings stay selectable
  const facetOptions = (facet: Facet, selected: string) =>
    sortedUnique([
      ...filteredReportedPresets
        .filter((preset) => matchesFilters(preset, facet))
        .map((preset) => preset[facet]),
      selected,
    ])
  const filterOptions = {
    vendor: facetOptions("vendor", filteredVendors),
    aircraft: facetOptions("aircraft", filteredAircrafts),
    system: facetOptions("system", filteredSystems),
    presetType: facetOptions("presetType", filteredPresetTypes),
  }

  const storedSimType =
    typeof localStorage !== "undefined" && localStorage.getItem("simType")
  useEffect(() => {
    document.body.classList.toggle("xplane", storedSimType !== "msfs2020")
  }, [storedSimType])

  const router = useRouter()

  const updateQueryParam = (
    key: string,
    value: string,
    { replace = false } = {},
  ) => {
    // Start from the current URL: router.query can still be stale when
    // filters change in quick succession, which would drop other filters.
    const params = new URLSearchParams(window.location.search)
    if (value) params.set(key, value)
    else params.delete(key) // Remove the key if value is empty
    router[replace ? "replace" : "push"](
      {
        pathname: router.pathname,
        query: Object.fromEntries(params),
      },
      undefined,
      { shallow: true },
    )
  }

  // a pending search must not change the URL after leaving the page
  useEffect(() => {
    const timer = searchTimer
    return () => clearTimeout(timer.current)
  }, [])

  // Populate filters from query parameters on mount
  useEffect(() => {
    setFilteredPresets((router.query.search as string) || "")
    setSearchText((router.query.search as string) || "")
    setFilteredVendors((router.query.vendor as string) || "")
    setFilteredAircrafts((router.query.aircraft as string) || "")
    setFilteredSystems((router.query.system as string) || "")
    setFilteredPresetTypes((router.query.presetType as string) || "")
    setFilteredCodeTypes((router.query.codeType as string) || "")
  }, [router.query])

  const changeSimType = (newSimType: string) => {
    setSimType(newSimType)
    localStorage.setItem("simType", newSimType)
  }

  const promotionContext: PromotionContext = {
    sim: simType === "xplane" ? "xplane" : "msfs2020",
    vendor: filteredVendors || undefined,
    aircraft: filteredAircrafts || undefined,
    search: filteredPresets || undefined,
  }

  return (
    <div>
      {loading ? (
        <PresetListSkeleton status={loadingStatus || "Loading Presets"}>
          <PromoSlot slot="loading" context={promotionContext} />
        </PresetListSkeleton>
      ) : presets.length ? (
        <div className="min-h-screen">
          <div className="flex flex-col p-3 md:flex-row md:space-x-3">
            <div>
              <SimSwitch
                value={simType}
                onValueChange={changeSimType}
                className="mb-3"
              />
              {/* sticky together, so the filter doesn't slide over the promotion */}
              <div className="flex flex-col md:sticky md:top-3">
                <PresetFilter
                  filterOpen={filterOpen}
                  setFilterOpen={() => setFilterOpen((prev) => !prev)}
                  search={(value) => {
                    setSearchText(value)
                    clearTimeout(searchTimer.current)
                    searchTimer.current = setTimeout(() => {
                      setFilteredPresets(value)
                      localStorage.setItem("searchFilter", value)
                      // replace: typing must not add a history entry per search
                      updateQueryParam("search", value, { replace: true })
                    }, SEARCH_DELAY_MS)
                  }}
                  filterVendor={(value) => {
                    setFilteredVendors(value)
                    localStorage.setItem("vendorFilter", value)
                    updateQueryParam("vendor", value)
                  }}
                  filterAircraft={(value) => {
                    setFilteredAircrafts(value)
                    localStorage.setItem("aircraftFilter", value)
                    updateQueryParam("aircraft", value)
                  }}
                  filterSystem={(value) => {
                    setFilteredSystems(value)
                    localStorage.setItem("systemFilter", value)
                    updateQueryParam("system", value)
                  }}
                  filterPresetType={(value) => {
                    setFilteredPresetTypes(value)
                    localStorage.setItem("presetTypeFilter", value)
                    updateQueryParam("presetType", value)
                  }}
                  filterCodeType={(value) => {
                    setFilteredCodeTypes(value)
                    localStorage.setItem("codeTypeFilter", value)
                    updateQueryParam("codeType", value)
                  }}
                  resetFilter={() => {
                    clearTimeout(searchTimer.current)
                    setSearchText("")
                    setFilteredPresets("")
                    setFilteredVendors("")
                    setFilteredAircrafts("")
                    setFilteredSystems("")
                    setFilteredPresetTypes("")
                    setFilteredCodeTypes("")
                    localStorage.setItem("searchFilter", "")
                    localStorage.setItem("vendorFilter", "")
                    localStorage.setItem("aircraftFilter", "")
                    localStorage.setItem("systemFilter", "")
                    localStorage.setItem("presetTypeFilter", "")
                    router.push(router.pathname, undefined, { shallow: true }) // reset URL
                  }}
                  filteredPresets={searchText}
                  filteredVendors={filteredVendors}
                  filteredAircrafts={filteredAircrafts}
                  filteredSystems={filteredSystems}
                  filteredPresetTypes={filteredPresetTypes}
                  filteredCodeTypes={filteredCodeTypes}
                  options={filterOptions}
                  setShowMyPresets={() => setShowMyPresets((prev) => !prev)}
                  setShowReportedPresets={() =>
                    setShowReportedPresets((prev) => !prev)
                  }
                  showMyPresets={showMyPresets}
                  showReportedPresets={showReportedPresets}
                />
                <PromoSlot
                  slot="filter-sidebar"
                  context={promotionContext}
                  // the collapsed filter is too narrow for it
                  className={`mb-3 md:mt-3 md:w-96 ${filterOpen ? "" : "md:hidden"}`}
                />
              </div>
            </div>
            <div className="flex w-full flex-col">
              <PresetTable
                setAddModalOpen={() => setAddModalOpen(true)}
                setExportModalOpen={() => setExportModalOpen(true)}
                data={filteredItems}
                relevance={terms.length > 0 ? relevance : undefined}
              />
              {/* three next to each other: one promotion alone leaves most of the width empty */}
              <div className="mt-3 grid gap-3 lg:grid-cols-3">
                {[1, 2, 3].map((position) => (
                  <PromoSlot
                    key={position}
                    slot="below-results"
                    layout="row"
                    context={promotionContext}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <PresetListSkeleton status="Loading Presets">
          <PromoSlot slot="loading" context={promotionContext} />
        </PresetListSkeleton>
      )}
      {exportModalOpen && (
        <div key="exportModal" className="animate-in fade-in-0">
          <ExportPresetsModal onClose={() => setExportModalOpen(false)} />
        </div>
      )}
      {addModalOpen && (
        <div key="addPresetModal" className="animate-in fade-in-0">
          <AddPresetsModal
            presets={presets}
            onClose={() => setAddModalOpen(false)}
          />
        </div>
      )}
    </div>
  )
}

export default Presets
