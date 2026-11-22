import { useMemo, useState } from "react"
import { IconCirclePlus, IconDownload } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import DataTable, { type Column } from "@/components/sections/Shared/DataTable"
import PresetCard from "@/components/sections/presets/ui/PresetCard"
import type { Preset } from "@/interfaces/preset"
import RelevanceGauge from "@/components/sections/presets/presetTable/RelevanceGauge"
import { msalInstance, msalReady } from "@/services/msal"
import { getUserSettings, getAccessToken } from "@/services/msalFunctions"

type PresetTableProps = {
  data: Preset[]
  setExportModalOpen: (open: boolean) => void
  // relevance in percent per preset; only set while searching
  relevance?: Map<Preset, number>
}

// Defined outside PresetTable: a component created during render gets a new
// identity on every render, which remounted open rows and reset their edit mode.
const PresetRowDetails = ({ data }: { data: Preset }) => {
  const [vendor, setVendor] = useState(data.vendor)
  const [aircraft, setAircraft] = useState(data.aircraft)
  const [system, setSystem] = useState(data.system)
  const [presetType, setPresetType] = useState(data.presetType)
  const [codeType, setCodeType] = useState(data.codeType)
  const [label, setLabel] = useState(data.label)
  const [code, setCode] = useState(data.code)
  const [description, setDescription] = useState(data.description)

  return (
    <div className="relative -mx-3 md:m-0">
      <PresetCard
        id={data.id}
        label={label}
        updatedBy={data.updatedBy}
        author={data.author}
        createdDate={data.createdDate}
        version={data.version}
        reported={data.reported}
        vendor={vendor}
        aircraft={aircraft}
        system={system}
        presetType={presetType}
        codeType={codeType}
        code={code}
        description={description}
        showingHistory={false}
        text={"sm"}
        card={false}
        setVendor={setVendor}
        setAircraft={setAircraft}
        setSystem={setSystem}
        setPresetType={setPresetType}
        setCodeType={setCodeType}
        setLabel={setLabel}
        setCode={setCode}
        setDescription={setDescription}
      />
      <hr className="border-border" />
    </div>
  )
}

async function login() {
  await msalReady
  await msalInstance.handleRedirectPromise()
  const accounts = msalInstance.getAllAccounts()
  if (accounts.length === 0) {
    await msalInstance
      .loginPopup()
      .then(() => {
        getAccessToken().then(() => getUserSettings())
      })
      .catch((error) => {
        console.error(`error during authentication: ${error}`)
        localStorage.setItem("roles", "Guest")
        localStorage.setItem("setAccessToken", "")
        msalInstance.logoutRedirect({}).catch((error) => {
          console.error(error)
        })
      })
  }
}

// anonymous visitors log in first
const ifLoggedIn = (open: (open: boolean) => void) => () => {
  if (localStorage.getItem("username")) open(true)
  else login()
}

type AddPresetButtonProps = {
  onOpen: (open: boolean) => void
}

/** Opens the add dialog; asks anonymous visitors to log in first */
export const AddPresetButton = ({ onOpen }: AddPresetButtonProps) => (
  <Button className="hidden md:inline-flex" onClick={ifLoggedIn(onOpen)}>
    <IconCirclePlus />
    Add preset
  </Button>
)

const PresetTable = ({
  data,
  setExportModalOpen,
  relevance,
}: PresetTableProps) => {
  const simType = localStorage.getItem("simType")
  // stable between renders: a new column list re-sorts all presets
  const columns = useMemo<Column<Preset>[]>(
    () => [
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
      ...(simType === "xplane"
        ? [
            {
              id: "codeType",
              header: "Code Type",
              value: (row: Preset) => row.codeType ?? "",
              sortable: true,
              wide: true,
            },
          ]
        : []),
      {
        id: "label",
        header: "Preset name",
        value: (row) => row.label,
        sortable: true,
        width: "minmax(0,3fr)",
      },
      ...(relevance
        ? [
            {
              id: "relevance",
              header: "Relevance",
              value: (row: Preset) => relevance.get(row) ?? 0,
              cell: (row: Preset) => (
                <RelevanceGauge value={relevance.get(row) ?? 0} />
              ),
              sortable: true,
              width: "8rem",
            },
          ]
        : []),
    ],
    [relevance, simType],
  )

  return (
    <div className="flex w-full flex-col rounded-lg bg-card">
      <DataTable
        // remount when a search starts or ends, to apply its default sort
        key={relevance ? "search" : "list"}
        columns={columns}
        data={data}
        rowId={(row) => row.id}
        initialSorting={
          relevance
            ? { id: "relevance", desc: true }
            : { id: "vendor", desc: false }
        }
        renderExpanded={(row) => <PresetRowDetails data={row} />}
        pageSizes={[15, 20, 30, 50, 100]}
        pageSizeStorageKey="pagination"
        footer={
          <Button
            className="hidden md:inline-flex"
            onClick={ifLoggedIn(setExportModalOpen)}
          >
            <IconDownload />
            Export presets
          </Button>
        }
      />
    </div>
  )
}

export default PresetTable
