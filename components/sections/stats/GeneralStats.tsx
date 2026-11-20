import { useMemo, useState } from "react"
import DataTable, { type Column } from "@/components/sections/Shared/DataTable"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import StatsCard from "@/components/sections/stats/ui/StatsCard"
import { compareText } from "@/lib/presetSearch"
import type { Preset, Statistics } from "@/interfaces/preset"
import { presetUrl, type Sim } from "@/lib/presetUrls"

type GeneralStatsProps = {
  presets: Preset[]
  stats: Statistics | null
  sim: Sim
}

type Contributor = {
  name: string
  presets: number
}

/** Authors with the number of presets they added or updated */
const contributorsOf = (presets: Preset[]): Contributor[] => {
  const withAuthor = presets.filter((preset) => preset.author != undefined)
  const counts = new Map<string, number>(
    withAuthor.map((preset) => [preset.author, 0]),
  )
  for (const { author, updatedBy } of withAuthor) {
    counts.set(author, (counts.get(author) ?? 0) + 1)
    if (updatedBy && updatedBy !== author && counts.has(updatedBy))
      counts.set(updatedBy, (counts.get(updatedBy) ?? 0) + 1)
  }
  return Array.from(counts, ([name, count]) => ({ name, presets: count })).sort(
    (a, b) => compareText(a.name, b.name),
  )
}

const GeneralStats = ({ presets, stats, sim }: GeneralStatsProps) => {
  const [modal, setModal] = useState(false)
  const [contModal, setContModal] = useState(false)
  const [singleCont, setSingleCont] = useState("")
  const [contSearch, setContSearch] = useState("")
  const [contPresetSearch, setContPresetSearch] = useState("")
  const cont = useMemo(() => contributorsOf(presets), [presets])

  const columns: Column<Contributor>[] = [
    { id: "name", header: "Name", value: (row) => row.name, sortable: true },
    {
      id: "presets",
      header: "Submissions or updates",
      value: (row) => row.presets,
      sortable: true,
    },
  ]
  const columnSingle: Column<Preset>[] = [
    {
      id: "date",
      header: "Last modification",
      value: (row) => new Date(row.createdDate ?? "").toLocaleString(),
      sortable: true,
      wide: true,
    },
    {
      id: "role",
      header: "Author / Updated",
      value: (row) => (row.author ? "Author" : "Updated"),
      sortable: true,
      wide: true,
    },
    {
      id: "vendor",
      header: "Vendor",
      value: (row) => row.vendor,
      sortable: true,
      wide: true,
    },
    {
      id: "aircraft",
      header: "Aircraft",
      value: (row) => row.aircraft,
      sortable: true,
    },
    {
      id: "system",
      header: "System",
      value: (row) => row.system,
      sortable: true,
      wide: true,
    },
    {
      id: "presetType",
      header: "Input/Output",
      value: (row) => row.presetType,
      sortable: true,
      wide: true,
    },
    {
      id: "label",
      header: "Preset name",
      value: (row) => row.label,
      sortable: true,
      width: "minmax(0,2fr)",
    },
  ]
  const topAircraft = stats?.aircrafts[0]
  const topContributor = stats?.contributors[0]

  return (
    <div className="container mx-auto flex flex-col">
      <h2 className="text-2xl font-semibold">General statistics</h2>
      <div className="flex flex-col justify-items-center space-y-3 md:grid md:grid-cols-2 md:gap-10 md:space-y-0 xl:grid-cols-4">
        <StatsCard title={"Total presets"}>
          <div className="text-3xl font-bold">
            {presets.length ? (
              <p>{presets.length}</p>
            ) : (
              <Skeleton className="h-9 w-24" />
            )}
          </div>
        </StatsCard>
        <StatsCard title={"Aircraft with most presets"}>
          <div className="text-3xl font-bold">
            {topAircraft ? (
              <div className="flex items-baseline space-x-2">
                <p>{topAircraft.presetCount}</p>
                <p className="text-base font-normal">
                  {topAircraft._id.vendor} - {topAircraft._id.aircraft}
                </p>
              </div>
            ) : (
              <Skeleton className="h-9 w-24" />
            )}
          </div>
        </StatsCard>
        <button
          type="button"
          onClick={() => setModal(true)}
          className="w-full rounded-xl text-left transition-opacity hover:opacity-80"
        >
          <StatsCard title={"Total contributors"}>
            <div>
              {presets.length > 0 ? (
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold">{cont.length}</p>
                  <p>Individual users</p>
                </div>
              ) : (
                <Skeleton className="h-9 w-24" />
              )}
            </div>
          </StatsCard>
        </button>
        <StatsCard title={"Top contributor"}>
          <div className="text-3xl font-bold">
            {topContributor ? (
              <div className="flex items-baseline space-x-2">
                <p>{topContributor.contributions}</p>
                <p className="text-base font-normal">{topContributor._id}</p>
              </div>
            ) : (
              <Skeleton className="h-9 w-24" />
            )}
          </div>
        </StatsCard>
      </div>
      <Dialog
        open={modal}
        onOpenChange={(open) => {
          setModal(open)
          if (!open) setContSearch("")
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[85vw]">
          <DialogHeader>
            <DialogTitle>Contributors</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Search contributor"
            aria-label="Search contributor"
            className="w-full sm:w-1/4"
            onChange={(e) => setContSearch(e.target.value)}
          />
          <div>
            <DataTable
              columns={columns}
              data={cont.filter((contributor) =>
                contributor.name.toLowerCase().includes(contSearch),
              )}
              initialSorting={{ id: "presets", desc: true }}
              rowId={(row) => row.name}
              pageSizes={[5, 10, 20, 30, 50, 100]}
              onRowClick={(row) => {
                setSingleCont(row.name)
                setContModal(true)
              }}
            />
            <Dialog open={contModal} onOpenChange={setContModal}>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[75vw]">
                <DialogHeader>
                  <DialogTitle>{"Presets by " + singleCont}</DialogTitle>
                </DialogHeader>
                <Input
                  placeholder="Search preset"
                  aria-label="Search preset"
                  className="w-full sm:w-1/4"
                  onChange={(e) => setContPresetSearch(e.target.value)}
                />
                <div>
                  <DataTable
                    columns={columnSingle}
                    rowId={(row) => row.id}
                    pageSizes={[5, 10, 20, 30, 50, 100]}
                    data={presets
                      .filter(
                        (preset) =>
                          preset.author === singleCont ||
                          preset.updatedBy === singleCont,
                      )
                      .filter((preset) =>
                        [
                          preset.label,
                          preset.vendor,
                          preset.aircraft,
                          preset.system,
                          preset.presetType,
                          preset.code,
                        ].some((text) =>
                          text.toLowerCase().includes(contPresetSearch),
                        ),
                      )
                      .sort(
                        (a, b) =>
                          new Date(b.createdDate ?? "").valueOf() -
                          new Date(a.createdDate ?? "").valueOf(),
                      )}
                    onRowClick={(row) =>
                      window.open(presetUrl(sim, row), "_blank")
                    }
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GeneralStats
