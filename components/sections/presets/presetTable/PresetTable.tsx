import DataTable, {
  createTheme,
  SortOrder,
  type ExpanderComponentProps,
  Media,
  type SortFunction,
  type TableColumn,
} from "react-data-table-component"
import { useRef, useState } from "react"
import { compareText } from "../../../../lib/presetSearch"
import AddPresetButton from "../ui/addPreset/AddPresetButton"
import ExportPresetsButton from "../ui/exportPresets/ExportPresetsButton"
import PresetCard, { type PresetToasts } from "../ui/PresetCard"
import type { Preset } from "../../../../interfaces/preset"
import RelevanceGauge from "./RelevanceGauge"
import { msalInstance, msalReady } from "../../../../services/msal"
import {
  getUserSettings,
  getAccessToken,
} from "../../../../services/msalFunctions"

type PresetTableProps = PresetToasts & {
  data: Preset[]
  setExportModalOpen: (open: boolean) => void
  setAddModalOpen: (open: boolean) => void
  // relevance in percent per preset; only set while searching
  relevance?: Map<Preset, number>
}

// sort text columns ignoring case ("Alternator" before "AP master")
const sortIgnoringCase: SortFunction<Preset> = (rows, selector, direction) => {
  const sign = direction === SortOrder.DESC ? -1 : 1
  return [...rows].sort(
    (a, b) =>
      sign * compareText(String(selector(a) ?? ""), String(selector(b) ?? "")),
  )
}

// Defined outside PresetTable: a component created during render gets a new
// identity on every render, which remounted open rows and reset their edit mode.
const PresetRowDetails = ({
  data,
  deletedToast,
  reportedToast,
  fixedToast,
  savedToast,
}: { data: Preset } & PresetToasts) => {
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
        deletedToast={deletedToast}
        reportedToast={reportedToast}
        fixedToast={fixedToast}
        savedToast={savedToast}
      />
      <hr className="border-hhBG" />
    </div>
  )
}

const PresetTable = ({
  data,
  setExportModalOpen,
  setAddModalOpen,
  deletedToast,
  reportedToast,
  fixedToast,
  savedToast,
  relevance,
}: PresetTableProps) => {
  // The table keeps the column object from when the sort was selected, so its
  // selector would still use the relevance of the first letter typed.
  // Reading through a ref gives the selector the current relevance.
  const currentRelevance = useRef(relevance)
  currentRelevance.current = relevance

  const columns: TableColumn<Preset>[] = [
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
    localStorage.getItem("simType") === "xplane"
      ? {
          name: "Code Type",
          selector: (row) => row.codeType,
          sortable: true,
          maxWidth: "10%",
          hide: Media.MD,
        }
      : {
          name: "",
          selector: (row) => row.codeType,
          sortable: true,
          maxWidth: "0%",
        },
    {
      name: "Preset name",
      selector: (row) => row.label,
      sortable: true,
      maxWidth: "50%",
    },
    ...(relevance
      ? [
          {
            id: "relevance",
            name: "Relevance",
            selector: (row: Preset) => currentRelevance.current?.get(row) ?? 0,
            cell: (row: Preset) => (
              <RelevanceGauge value={relevance.get(row) ?? 0} />
            ),
            sortable: true,
            minWidth: "130px",
            maxWidth: "10%",
          },
        ]
      : []),
    // keeps the top-right corner free for the "Add preset" button
    {
      id: "add-preset-space",
      name: "",
      width: "150px",
      hide: Media.MD,
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

  const [userPagination, setUserPagination] = useState(
    localStorage.getItem("pagination") === ""
      ? 15
      : parseInt(localStorage.getItem("pagination") || "15"),
  )

  const rowsPerPage = [15, 20, 30, 50, 100]

  return (
    <div className="relative flex w-full flex-col rounded-lg bg-hhCard/40">
      <div className="absolute right-0 z-10 mt-2 mr-2 hidden items-center space-x-3 md:flex">
        <div
          onClick={() => {
            if (localStorage.getItem("username")) {
              setAddModalOpen(true)
            } else login()
          }}
        >
          <AddPresetButton />
        </div>
      </div>
      <div className="absolute bottom-3 left-3 z-10 mt-2 mr-2 hidden items-center space-x-3 md:flex">
        <div
          onClick={() => {
            if (localStorage.getItem("username")) {
              setExportModalOpen(true)
            } else login()
          }}
        >
          <ExportPresetsButton />
        </div>
      </div>
      <DataTable
        // remount when a search starts or ends, to apply its default sort
        key={relevance ? "search" : "list"}
        columns={columns}
        data={data}
        customStyles={customStyles}
        pagination
        expandOnRowClicked
        sortFunction={sortIgnoringCase}
        expandableRows
        // the library passes expandableRowsComponentProps, but only types { data }
        expandableRowsComponent={
          PresetRowDetails as unknown as React.ComponentType<
            ExpanderComponentProps<Preset>
          >
        }
        expandableRowsComponentProps={{
          deletedToast,
          reportedToast,
          fixedToast,
          savedToast,
        }}
        highlightOnHover
        responsive={true}
        theme="hubhop"
        paginationPerPage={userPagination}
        paginationRowsPerPageOptions={rowsPerPage}
        onChangeRowsPerPage={(currentRowsPerPage) => (
          setUserPagination(currentRowsPerPage),
          localStorage.setItem("pagination", currentRowsPerPage.toString())
        )}
        defaultSortFieldId={relevance ? "relevance" : 1}
        defaultSortAsc={!relevance}
      />
    </div>
  )
}

export default PresetTable
