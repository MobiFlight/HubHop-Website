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
import {
  isSim,
  presetListUrl,
  slugify,
  type PresetListFilters,
  type Sim,
} from "../../../lib/presetUrls"
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

type PresetsProps = {
  sim: Sim
  // slugs from the path
  vendor?: string
  aircraft?: string
}

const queryValue = (value: string | string[] | undefined) =>
  typeof value === "string" ? value : ""

/** The preset list; sim and filters come from the URL (see lib/presetUrls.ts) */
const Presets = ({ sim: simType, vendor, aircraft }: PresetsProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [presetsMsfs, setPresetsMsfs] = useState<Preset[]>([])
  const [presetsXplane, setPresetsXplane] = useState<Preset[]>([])

  const filters: PresetListFilters = {
    sim: simType,
    vendor,
    // an aircraft without a vendor is a query parameter
    aircraft: aircraft ?? (queryValue(router.query.aircraft) || undefined),
    search: queryValue(router.query.search),
    system: queryValue(router.query.system),
    presetType: queryValue(router.query.presetType),
    codeType: queryValue(router.query.codeType),
  }
  const filteredPresets = filters.search ?? ""
  const filteredSystems = filters.system ?? ""
  const filteredPresetTypes = filters.presetType ?? ""
  const filteredCodeTypes = filters.codeType ?? ""

  /** Shows the list with changed filters; the URL is the only place they are kept */
  const navigate = (
    changes: Partial<PresetListFilters>,
    { replace = false } = {},
  ) =>
    router[replace ? "replace" : "push"](
      presetListUrl({ ...filters, ...changes }),
      undefined,
      { shallow: true },
    )

  // what is typed in the search box; the URL follows it after a delay
  const [searchText, setSearchText] = useState(filteredPresets)
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => setSearchText(filteredPresets), [filteredPresets])

  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [showMyPresets, setShowMyPresets] = useState(false)
  const [showReportedPresets, setShowReportedPresets] = useState(false)
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
    const sim = simType
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

  // vendor and aircraft are compared as slugs, like in the URL
  const facetFilters: Record<Facet, (preset: Preset) => boolean> = {
    vendor: (preset) => !vendor || slugify(preset.vendor) === vendor,
    aircraft: (preset) =>
      !filters.aircraft || slugify(preset.aircraft) === filters.aircraft,
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

  // the names behind the slugs, for the filter dropdowns
  const nameOf = (facet: "vendor" | "aircraft", slug: string | undefined) =>
    slug
      ? (presets.find((preset) => slugify(preset[facet]) === slug)?.[facet] ??
        slug)
      : ""
  const filteredVendors = nameOf("vendor", vendor)
  const filteredAircrafts = nameOf("aircraft", filters.aircraft)

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

  // a pending search must not change the URL after leaving the page
  useEffect(() => {
    const timer = searchTimer
    return () => clearTimeout(timer.current)
  }, [])

  const changeSimType = (newSimType: string) => {
    if (isSim(newSimType)) navigate({ sim: newSimType })
  }

  const promotionContext: PromotionContext = {
    sim: simType,
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
                    searchTimer.current = setTimeout(
                      // replace: typing must not add a history entry per search
                      () => navigate({ search: value }, { replace: true }),
                      SEARCH_DELAY_MS,
                    )
                  }}
                  filterVendor={(value) =>
                    navigate({ vendor: value ? slugify(value) : undefined })
                  }
                  filterAircraft={(value) =>
                    navigate({ aircraft: value ? slugify(value) : undefined })
                  }
                  filterSystem={(value) => navigate({ system: value })}
                  filterPresetType={(value) => navigate({ presetType: value })}
                  filterCodeType={(value) => navigate({ codeType: value })}
                  resetFilter={() => {
                    clearTimeout(searchTimer.current)
                    setSearchText("")
                    navigate({
                      vendor: undefined,
                      aircraft: undefined,
                      search: "",
                      system: "",
                      presetType: "",
                      codeType: "",
                    })
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
            defaults={{
              vendor: filteredVendors,
              aircraft: filteredAircrafts,
              system: filteredSystems,
              presetType: filteredPresetTypes,
              codeType: filteredCodeTypes,
            }}
            onClose={() => setAddModalOpen(false)}
          />
        </div>
      )}
    </div>
  )
}

export default Presets
