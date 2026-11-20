import PresetPreviewLabel from "../ui/PresetInputLabel"
import { useState } from "react"
import { cn } from "cn"
import { IconChevronUp, IconLoader2 } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { REPORTING_ENABLED } from "../../../../lib/features"
import type { Preset } from "../../../../interfaces/preset"
import { isModerator } from "../../../../services/roles"

type PresetHistoryListProps = {
  presetHistory: Preset[]
  loading: boolean
  // a reverted version without id; older versions may lack some fields
  revertHistory: (preset: Partial<Preset>) => void
}

const PresetHistoryList = ({
  presetHistory,
  loading,
  revertHistory,
}: PresetHistoryListProps) => {
  const [historyOpen, setHistoryOpen] = useState(false)

  return (
    <div className="rounded-xl bg-card ring-1 ring-foreground/10">
      <button
        onClick={() => setHistoryOpen((prev) => !prev)}
        className="flex w-full items-center justify-between p-3 text-left transition-all hover:text-primary"
      >
        <h2 className="text-xl">
          Preset history with {presetHistory.length} versions
        </h2>
        {loading && (
          <div className="flex items-center justify-center text-xl">
            <IconLoader2 className="animate-spin text-primary" />
            <p className="ml-2">Loading History</p>
          </div>
        )}
        <div className="text-xl">
          <IconChevronUp
            className={cn("transition-transform", !historyOpen && "rotate-180")}
          />
        </div>
      </button>
      {historyOpen && (
        <div className="h-[34vh] animate-in overflow-y-scroll fade-in-0">
          {presetHistory
            .sort(
              (a, b) =>
                new Date(b.createdDate ?? 0).valueOf() -
                new Date(a.createdDate ?? 0).valueOf(),
            )
            .map((history) => {
              return (
                <div
                  key={history.createdDate}
                  className="mr-1 mb-5 ml-3 rounded-lg bg-background/70"
                >
                  <div className="flex w-full flex-col p-5 md:flex-row md:space-x-5">
                    <div className="flex w-full flex-col space-y-2 md:w-1/6">
                      {history.version > 1 ? (
                        <PresetPreviewLabel
                          title={"Updated by"}
                          editData={history.updatedBy}
                        />
                      ) : (
                        <PresetPreviewLabel
                          title={"Author"}
                          editData={history.author}
                        />
                      )}
                      <PresetPreviewLabel
                        title={history.version > 1 ? "Updated" : "Added"}
                        editData={
                          history.createdDate
                            ? new Date(history.createdDate).toLocaleString()
                            : ""
                        }
                      />
                      <PresetPreviewLabel
                        title={"Version"}
                        editData={history.version}
                      />
                      {REPORTING_ENABLED && (
                        <PresetPreviewLabel
                          title={"Reported"}
                          editData={history.reported ?? 0}
                        />
                      )}
                    </div>
                    <div className="mt-2 flex w-full flex-col space-y-2 md:mt-0 md:w-1/6">
                      <PresetPreviewLabel
                        title={"Vendor"}
                        editData={history.vendor}
                      />
                      <PresetPreviewLabel
                        title={"Aircraft"}
                        editData={history.aircraft}
                      />
                      <PresetPreviewLabel
                        title={"System"}
                        editData={history.system}
                      />
                      <PresetPreviewLabel
                        title={"Input / Output"}
                        editData={history.presetType}
                      />
                    </div>
                    <div className="mt-2 flex w-full flex-col space-y-2 md:mt-0 md:w-4/6">
                      <PresetPreviewLabel
                        title={"Preset name"}
                        editData={history.label}
                      />
                      <PresetPreviewLabel
                        title={"Code"}
                        mono
                        editData={history.code}
                      />
                      <PresetPreviewLabel
                        title={"Description"}
                        editData={
                          history.description
                            ? history.description
                            : "No description available"
                        }
                      />
                    </div>
                    {isModerator() && (
                      <Button
                        onClick={() =>
                          revertHistory(
                            history.version > 1
                              ? {
                                  path:
                                    history.vendor +
                                    "." +
                                    history.aircraft +
                                    "." +
                                    history.system +
                                    "." +
                                    history.presetType +
                                    "." +
                                    history.label,
                                  updatedBy: history.updatedBy,
                                  createdDate: history.createdDate,
                                  version: history.version,
                                  reported: history.reported,
                                  vendor: history.vendor,
                                  aircraft: history.aircraft,
                                  system: history.system,
                                  presetType: history.presetType,
                                  label: history.label,
                                  code: history.code,
                                  description: history.description,
                                }
                              : {
                                  path:
                                    history.vendor +
                                    "." +
                                    history.aircraft +
                                    "." +
                                    history.system +
                                    "." +
                                    history.presetType +
                                    "." +
                                    history.label,
                                  author: history.author,
                                  createdDate: history.createdDate,
                                  version: history.version,
                                  reported: history.reported,
                                  vendor: history.vendor,
                                  aircraft: history.aircraft,
                                  system: history.system,
                                  presetType: history.presetType,
                                  label: history.label,
                                  code: history.code,
                                  description: history.description,
                                },
                          )
                        }
                        className="my-auto"
                      >
                        Revert to version
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}

export default PresetHistoryList
