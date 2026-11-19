import { AnimatePresence } from "motion/react"
import { useMemo, useState } from "react"
import DataTable, {
  createTheme,
  Media,
  type TableColumn,
} from "react-data-table-component"
import LoadingSpinner from "../Shared/LoadingSpinner"
import Modal from "../Shared/Modal"
import StatsCard from "./ui/StatsCard"
import { compareText } from "../../../lib/presetSearch"
import type { Preset, Statistics } from "../../../interfaces/preset"

type GeneralStatsProps = {
  presets: Preset[]
  stats: Statistics | null
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

const GeneralStats = ({ presets, stats }: GeneralStatsProps) => {
  const [modal, setModal] = useState(false)
  const [contModal, setContModal] = useState(false)
  const [singleCont, setSingleCont] = useState("")
  const [contSearch, setContSearch] = useState("")
  const [contPresetSearch, setContPresetSearch] = useState("")
  const cont = useMemo(() => contributorsOf(presets), [presets])

  const columns: TableColumn<Contributor>[] = [
    {
      name: "Name",
      selector: (row) => row.name,
      maxWidth: "60%",
      sortable: true,
    },
    {
      name: "Submissions or updates",
      selector: (row) => row.presets,
      maxWidth: "40%",
      sortable: true,
    },
  ]
  const columnSingle: TableColumn<Preset>[] = [
    {
      name: "Last modification",
      selector: (row) => new Date(row.createdDate ?? "").toLocaleString(),
      sortable: true,
      maxWidth: "15%",
      hide: Media.MD,
    },
    {
      name: "Author / Updated",
      selector: (row) => (row.author ? "Author" : "Updated"),
      sortable: true,
      maxWidth: "10%",
      hide: Media.MD,
    },
    {
      name: "Vendor",
      selector: (row) => row.vendor,
      sortable: true,
      maxWidth: "10%",
      hide: Media.MD,
    },
    {
      name: "Aircraft",
      selector: (row) => row.aircraft,
      sortable: true,
      maxWidth: "10%",
    },
    {
      name: "System",
      selector: (row) => row.system,
      sortable: true,
      maxWidth: "10%",
      hide: Media.MD,
    },
    {
      name: "Input/Output",
      selector: (row) => row.presetType,
      sortable: true,
      maxWidth: "10%",
      hide: Media.MD,
    },
    {
      name: "Preset name",
      selector: (row) => row.label,
      sortable: true,
      maxWidth: "50%",
    },
  ]

  createTheme("hubhop", {
    // v8 draws lines between header columns by default; v7 did not
    headerSeparator: false,
    text: {
      primary: "#D2D0D2",
      secondary: "#D2D0D2",
      disabled: "rgba(0, 0, 0, .38)",
    },
    background: {
      default: "transparent",
    },
    context: {
      background: "transparent",
      text: "#D2D0D2",
    },
    divider: {
      default: "#33353e",
    },
    highlightOnHover: {
      default: "#ffa047",
      text: "#33353e",
    },
    button: {
      default: "#D2D0D2",
      focus: "rgba(0,0,0,.12)",
      hover: "rgba(0,0,0,.12)",
      disabled: "rgba(0, 0, 0, .18)",
    },
  })

  const customStyles = {
    noData: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#D2D0D2",
        backgroundColor: "transparent",
      },
    },
    rows: {
      highlightOnHoverStyle: {
        fontWeight: 700,
      },
    },
    headRow: {
      style: {
        fontWeight: 700,
        fontSize: "0.9rem",
      },
    },
  }

  const topAircraft = stats?.aircrafts[0]
  const topContributor = stats?.contributors[0]

  return (
    <div className="container mx-auto flex flex-col">
      <h2 className="text-2xl font-semibold">General statistics</h2>
      <div className="flex flex-col justify-items-center space-y-3 md:grid md:grid-cols-2 md:gap-10 md:space-y-0 xl:grid-cols-4">
        <StatsCard title={"Total presets"}>
          <div className="text-3xl font-bold">
            {presets.length ? <p>{presets.length}</p> : <LoadingSpinner />}
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
              <LoadingSpinner />
            )}
          </div>
        </StatsCard>
        <div
          onClick={() => setModal((prev) => !prev)}
          className="w-full cursor-pointer rounded-xl transition-all hover:bg-hhCard"
        >
          <StatsCard title={"Total contributors"}>
            <div>
              {presets.length > 0 ? (
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold">{cont.length}</p>
                  <p>Individual users</p>
                </div>
              ) : (
                <div className="text-3xl">
                  <LoadingSpinner />
                </div>
              )}
            </div>
          </StatsCard>
        </div>
        <StatsCard title={"Top contributor"}>
          <div className="text-3xl font-bold">
            {topContributor ? (
              <div className="flex items-baseline space-x-2">
                <p>{topContributor.contributions}</p>
                <p className="text-base font-normal">{topContributor._id}</p>
              </div>
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </StatsCard>
      </div>
      <AnimatePresence>
        {modal && (
          <Modal
            title="Contributors"
            closeModal={() => (setModal(false), setContSearch(""))}
            closeModalX={() => setModal(false)}
            position="fixed"
            height={true}
          >
            <input
              placeholder="Search contributor"
              className={`w-1/4 rounded-lg border bg-hhBG px-3 py-1 text-sm text-hhText`}
              onChange={(e) => setContSearch(e.target.value)}
            />
            <div className="w-[80vw]">
              <DataTable
                columns={columns}
                data={cont.filter((contributor) =>
                  contributor.name.toLowerCase().includes(contSearch),
                )}
                customStyles={customStyles}
                pagination
                highlightOnHover
                responsive={true}
                theme="hubhop"
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 10, 20, 30, 50, 100]}
                defaultSortFieldId={2}
                defaultSortAsc={false}
                onRowClicked={(row) => {
                  setSingleCont(row.name)
                  setContModal((prev) => !prev)
                }}
              />
              {contModal && (
                <Modal
                  title={"Presets by " + singleCont}
                  position="fixed"
                  closeModal={() => setContModal(false)}
                  closeModalX={() => setContModal(false)}
                >
                  <input
                    placeholder="Search preset"
                    className={`w-1/4 rounded-lg border bg-hhBG px-3 py-1 text-sm text-hhText`}
                    onChange={(e) => setContPresetSearch(e.target.value)}
                  />
                  <div className="w-[70vw]">
                    <DataTable
                      columns={columnSingle}
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
                      customStyles={customStyles}
                      pagination
                      highlightOnHover
                      responsive={true}
                      theme="hubhop"
                      paginationPerPage={5}
                      paginationRowsPerPageOptions={[5, 10, 20, 30, 50, 100]}
                      onRowClicked={(row) =>
                        window.open(
                          "https://hubhop.mobiflight.com/preset/?id=" + row.id,
                          "_blank",
                        )
                      }
                    />
                  </div>
                </Modal>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GeneralStats
