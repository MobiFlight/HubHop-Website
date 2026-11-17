import PresetPreviewLabel from "../ui/PresetInputLabel"
import { AiOutlineLoading } from "react-icons/ai"
import { useState } from "react"
import { motion, AnimatePresence, type Variants } from "motion/react"
import { BsArrowUpCircle } from "react-icons/bs"
import ButtonOrange from "../../Shared/ButtonOrange"
import { REPORTING_ENABLED } from "../../../../lib/features"
import type { Preset } from "../../../../interfaces/preset"

interface Props {
  presetHistory: Preset[]
  loading: boolean
  // a reverted version without id; older versions may lack some fields
  revertHistory: (preset: Partial<Preset>) => void
}

const PresetHistoryList: React.FC<Props> = ({
  presetHistory,
  loading,
  revertHistory,
}) => {
  const divVariants: Variants = {
    expanded: {
      height: "34vh",
      transition: {
        duration: 0.3,
        ease: [0.83, 0, 0.17, 1],
      },
    },
    collapsed: {
      height: 0,
      transition: {
        duration: 0.3,
        ease: [0.83, 0, 0.17, 1],
      },
    },
  }

  const [historyOpen, setHistoryOpen] = useState(false)

  return (
    <div className="rounded-lg bg-hhCard/40 transition-all">
      <button
        onClick={() => setHistoryOpen((prev) => !prev)}
        className="flex w-full items-center justify-between p-3 text-left transition-all hover:text-hhOrange"
      >
        <h2 className="text-xl">
          Preset history with {presetHistory.length} versions
        </h2>
        {loading && (
          <div className="flex items-center justify-center text-xl">
            <div className="animate-spin text-hhOrange">
              <AiOutlineLoading />
            </div>
            <p className="ml-2">Loading History</p>
          </div>
        )}
        <div className="text-xl">
          <motion.div
            animate={
              historyOpen
                ? {
                    rotate: "0deg",
                  }
                : {
                    rotate: "180deg",
                  }
            }
          >
            <BsArrowUpCircle />
          </motion.div>
        </div>
      </button>
      <AnimatePresence>
        {historyOpen && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={divVariants}
            className="overflow-y-scroll"
          >
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
                    className="mr-1 mb-5 ml-3 rounded-lg bg-hhBG/70"
                  >
                    <div className="flex w-full flex-col p-5 text-hhText md:flex-row md:space-x-5">
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
                      {localStorage
                        .getItem("roles")
                        ?.toLowerCase()
                        .includes("moderator") && (
                        <div
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
                          className="my-auto h-fit cursor-pointer text-center"
                        >
                          <ButtonOrange>Revert to version</ButtonOrange>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PresetHistoryList
