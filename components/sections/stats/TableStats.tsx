import DataTable, { type Column } from "../Shared/DataTable"
import OpenPresetButton from "../presets/ui/OpenPresetButton"
import PresetPreviewLabel from "../presets/ui/PresetInputLabel"
import { REPORTING_ENABLED } from "../../../lib/features"
import type { StatisticsPreset } from "../../../interfaces/preset"

const PresetRowDetails = ({ data }: { data: StatisticsPreset }) => {
  const { vendor, aircraft, system, presetType, label, code, description } =
    data

  return (
    <div className="relative -mx-3 md:m-0">
      <div>
        <div className="container mx-auto p-3 md:p-0">
          <div>
            <h2 className={`ml-5 pt-3 font-bold text-hhText`}>{label}</h2>
            <div className="flex w-full flex-col space-y-2 p-5 text-sm text-hhText md:flex-row md:space-y-0 md:space-x-5">
              <div className="flex w-full flex-col space-y-2 md:w-1/6">
                {data.version > 1 ? (
                  <PresetPreviewLabel
                    title={"Updated by"}
                    editData={data.updatedBy}
                  />
                ) : (
                  <PresetPreviewLabel title={"Author"} editData={data.author} />
                )}
                <PresetPreviewLabel
                  title={data.version > 1 ? "Updated" : "Added"}
                  editData={new Date(data.createdDate ?? "").toLocaleString()}
                />
                <PresetPreviewLabel title={"Version"} editData={data.version} />
                {REPORTING_ENABLED && (
                  <PresetPreviewLabel
                    title={"Reported"}
                    editData={data.reported || 0}
                  />
                )}
              </div>
              <div className="flex w-full flex-col space-y-2 md:w-1/6">
                <PresetPreviewLabel title={"Vendor"} editData={vendor} />
                <PresetPreviewLabel title={"Aircraft"} editData={aircraft} />
                <PresetPreviewLabel title={"System"} editData={system} />
                <PresetPreviewLabel
                  title={"Input / Output"}
                  editData={presetType}
                />
              </div>
              <div className="flex w-full flex-col space-y-2 md:w-4/6">
                <PresetPreviewLabel title={"Preset name"} editData={label} />
                <PresetPreviewLabel title={"Code"} editData={code} mono />
                <PresetPreviewLabel
                  title={"Description"}
                  editData={
                    description ? description : "No description available"
                  }
                />
              </div>
            </div>
            <div className="flex w-full justify-end px-5 pt-2 pb-5">
              <div className="flex flex-col-reverse justify-between space-y-reverse md:flex-row md:items-center md:space-y-0 md:space-x-5">
                {<OpenPresetButton id={data._id ?? data.id} />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="border-hhBG" />
    </div>
  )
}

type TableStatsProps = {
  data: StatisticsPreset[]
  added: boolean
}

const TableStats = ({ data, added }: TableStatsProps) => {
  const columns: Column<StatisticsPreset>[] = [
    {
      id: "date",
      header: added ? "Added" : "Updated",
      value: (row) => new Date(row.createdDate ?? "").toLocaleString(),
    },
    {
      id: "by",
      header: added ? "Added by" : "Updated by",
      value: (row) => (added ? row.author : (row.updatedBy ?? "")),
      wide: true,
    },
    { id: "vendor", header: "Vendor", value: (row) => row.vendor, wide: true },
    {
      id: "aircraft",
      header: "Aircraft",
      value: (row) => row.aircraft,
      wide: true,
    },
    { id: "system", header: "System", value: (row) => row.system, wide: true },
    {
      id: "presetType",
      header: "Input/Output",
      value: (row) => row.presetType,
      wide: true,
    },
    {
      id: "label",
      header: "Preset name",
      value: (row) => row.label,
      width: "minmax(0,2fr)",
    },
  ]

  return (
    <div className="rounded-lg bg-hhCard/40">
      <DataTable
        columns={columns}
        data={data}
        rowId={(row) => row._id ?? row.id}
        renderExpanded={(row) => <PresetRowDetails data={row} />}
      />
    </div>
  )
}

export default TableStats
