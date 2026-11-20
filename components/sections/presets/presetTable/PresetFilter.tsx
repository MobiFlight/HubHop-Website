import type { ReactNode } from "react"
import {
  IconAdjustmentsHorizontal,
  IconBuildingStore,
  IconBulb,
  IconChevronLeft,
  IconChevronRight,
  IconDeviceGamepad2,
  IconListDetails,
  IconPlane,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react"
import { AuthenticatedTemplate } from "@azure/msal-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import ComboBox from "../../Shared/ComboBox"
import { CODE_TYPES } from "../../../../lib/codeTypes"
import { REPORTING_ENABLED } from "../../../../lib/features"
import { isModerator } from "../../../../services/roles"

type ChangeHandler = (value: string) => void

type PresetFilterProps = {
  search: ChangeHandler
  filterVendor: ChangeHandler
  filterAircraft: ChangeHandler
  filterSystem: ChangeHandler
  filterPresetType: ChangeHandler
  filterCodeType: ChangeHandler
  resetFilter: () => void
  filteredPresets: string
  filteredVendors: string
  filteredAircrafts: string
  filteredSystems: string
  filteredPresetTypes: string
  filteredCodeTypes: string
  options: Record<"vendor" | "aircraft" | "system" | "presetType", string[]>
  filterOpen: boolean
  showReportedPresets: boolean
  showMyPresets: boolean
  setShowReportedPresets: () => void
  setShowMyPresets: () => void
  setFilterOpen: () => void
}

// shadcn Select doesn't allow "" as a value
const ALL = "__all__"

type FilterFieldProps = {
  id: string
  label: string
  icon: ReactNode
  children: ReactNode
}

const FilterField = ({ id, label, icon, children }: FilterFieldProps) => (
  <div className="flex flex-col gap-1">
    <Label htmlFor={id} className="[&_svg]:size-4">
      {icon}
      {label}
    </Label>
    {children}
  </div>
)

type FilterSelectProps = {
  id: string
  value: string
  onValueChange: (value: string) => void
  allLabel: string
  options: readonly string[]
}

const FilterSelect = ({
  id,
  value,
  onValueChange,
  allLabel,
  options,
}: FilterSelectProps) => (
  <Select
    value={value || ALL}
    onValueChange={(v) => onValueChange(v === ALL ? "" : v)}
  >
    <SelectTrigger id={id} className="w-full">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value={ALL}>{allLabel}</SelectItem>
      {options.map((option) => (
        <SelectItem key={option} value={option}>
          {option}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

const PresetFilter = ({
  filteredPresets,
  filteredVendors,
  options,
  search,
  filterVendor,
  resetFilter,
  filterAircraft,
  filteredAircrafts,
  filteredSystems,
  filteredPresetTypes,
  filteredCodeTypes,
  filterSystem,
  filterPresetType,
  filterCodeType,
  showReportedPresets,
  showMyPresets,
  setShowReportedPresets,
  setShowMyPresets,
  filterOpen,
  setFilterOpen,
}: PresetFilterProps) => {
  return (
    <Card
      className={`mb-5 w-full gap-3 p-3 md:mb-0 ${filterOpen ? "md:w-96" : "md:w-16"}`}
    >
      <Button
        variant="ghost"
        onClick={() => setFilterOpen()}
        className="w-full justify-between px-1 text-2xl"
        aria-expanded={filterOpen}
      >
        <span className="flex items-center gap-1">
          <IconAdjustmentsHorizontal className="size-6" />
          <span className={filterOpen ? "" : "md:hidden"}>Filter</span>
        </span>
        {filterOpen ? (
          <IconChevronLeft className="size-6" />
        ) : (
          <IconChevronRight className="size-6" />
        )}
      </Button>
      {!filterOpen && (
        <button
          onClick={() => setFilterOpen()}
          className="mt-5 hidden origin-center -rotate-90 pb-10 text-4xl md:block"
        >
          Filter
        </button>
      )}
      <div
        className={`flex flex-col gap-3 text-sm ${filterOpen ? "" : "hidden"}`}
      >
        <FilterField
          id="filter-search"
          label="Search Preset"
          icon={<IconSearch />}
        >
          <Input
            id="filter-search"
            value={filteredPresets}
            onChange={(e) => search(e.target.value)}
          />
        </FilterField>
        <FilterField
          id="filter-vendor"
          label="Select Vendor"
          icon={<IconBuildingStore />}
        >
          <ComboBox
            id="filter-vendor"
            options={options.vendor}
            value={filteredVendors}
            onValueChange={filterVendor}
            placeholder="All Vendors"
            emptyOption="All Vendors"
          />
        </FilterField>
        <FilterField
          id="filter-aircraft"
          label="Search Aircraft"
          icon={<IconPlane />}
        >
          <ComboBox
            id="filter-aircraft"
            options={options.aircraft}
            value={filteredAircrafts}
            onValueChange={filterAircraft}
            placeholder="All Aircraft"
            emptyOption="All Aircraft"
          />
        </FilterField>
        <FilterField
          id="filter-system"
          label="Select System"
          icon={<IconSettings />}
        >
          <ComboBox
            id="filter-system"
            options={options.system}
            value={filteredSystems}
            onValueChange={filterSystem}
            placeholder="All Systems"
            emptyOption="All Systems"
          />
        </FilterField>
        <FilterField
          id="filter-preset-type"
          label="Select Input/Output"
          icon={
            <>
              <IconDeviceGamepad2 />
              <IconBulb />
            </>
          }
        >
          <FilterSelect
            id="filter-preset-type"
            value={filteredPresetTypes}
            onValueChange={filterPresetType}
            allLabel="All Inputs/Outputs"
            options={options.presetType}
          />
        </FilterField>
        {localStorage.getItem("simType") === "xplane" && (
          <FilterField
            id="filter-code-type"
            label="Select Code Type"
            icon={<IconListDetails />}
          >
            <FilterSelect
              id="filter-code-type"
              value={filteredCodeTypes}
              onValueChange={filterCodeType}
              allLabel="All Code Types"
              options={CODE_TYPES}
            />
          </FilterField>
        )}
        <AuthenticatedTemplate>
          <div className="mt-2 flex flex-col gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex w-fit items-center gap-2">
                  <Checkbox
                    id="filter-my-presets"
                    checked={showMyPresets}
                    onCheckedChange={() => setShowMyPresets()}
                  />
                  <Label htmlFor="filter-my-presets">Show my presets</Label>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Select only added or updated presets by you.
              </TooltipContent>
            </Tooltip>
            {REPORTING_ENABLED && isModerator() && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="filter-reported-presets"
                  checked={showReportedPresets}
                  onCheckedChange={() => setShowReportedPresets()}
                />
                <Label htmlFor="filter-reported-presets">
                  Show reported presets
                </Label>
              </div>
            )}
          </div>
        </AuthenticatedTemplate>
        <Button
          variant="outline"
          className="mt-3 w-full"
          onClick={() => resetFilter()}
        >
          Reset Filters
        </Button>
      </div>
    </Card>
  )
}

export default PresetFilter
