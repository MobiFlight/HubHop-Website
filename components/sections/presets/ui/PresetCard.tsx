"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import PresetHistoryList from "../singlePresetView/PresetHistoryList"
import PromoSlot from "../../Shared/PromoSlot"
import EditToggle from "./editPreset/EditToggle"
import PresetPreviewLabel from "./PresetInputLabel"
import SavePresetButton from "./editPreset/SavePresetButton"
import ReportPresetModal from "./reportPreset/ReportPresetModal"
import DeleteConfirmationModal from "./deletePreset/DeleteConfirmationModal"
import OpenPresetButton from "./OpenPresetButton"
import FixedPresetModal from "./reportPreset/FixedPresetModal"
import { presetTable, type SimType } from "../../../../services/presetSync"
import { CODE_TYPES } from "../../../../lib/codeTypes"
import { presetTypesFor } from "../../../../lib/presetTypes"
import type { Preset } from "../../../../interfaces/preset"
import { REPORTING_ENABLED } from "../../../../lib/features"
import { isModerator } from "../../../../services/roles"
import { toast } from "sonner"
import { IconTrash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type PresetFields = Pick<
  Preset,
  | "id"
  | "label"
  | "updatedBy"
  | "author"
  | "createdDate"
  | "version"
  | "reported"
  | "vendor"
  | "aircraft"
  | "system"
  | "presetType"
  | "codeType"
  | "code"
  | "description"
>

type ChangeHandler<T = string> = (value: T) => void

type PresetCardProps = PresetFields & {
  loading?: boolean
  history?: Preset[]
  setVendor: ChangeHandler
  setAircraft: ChangeHandler
  setSystem: ChangeHandler
  setPresetType: ChangeHandler<Preset["presetType"]>
  setLabel: ChangeHandler
  setCodeType: ChangeHandler<Preset["codeType"]>
  setCode: ChangeHandler
  setDescription: ChangeHandler
  showingHistory: boolean
  text: string
  card: boolean
}

const PresetCard = ({
  id,
  updatedBy,
  author,
  createdDate,
  version,
  reported,
  vendor,
  aircraft,
  system,
  presetType,
  codeType,
  label,
  code,
  description,
  loading,
  history,
  setVendor,
  setAircraft,
  setSystem,
  setPresetType,
  setCodeType,
  setLabel,
  setCode,
  setDescription,
  showingHistory,
  text,
  card,
}: PresetCardProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [fixedModalOpen, setFixedModalOpen] = useState(false)
  const [edit, setEdit] = useState(false)
  const [editButton, setEditButton] = useState(false)
  const [editTooltip, seteditTooltip] = useState(false)
  const [revertObject, setRevertObject] = useState<Partial<Preset>>({})
  const [revertModal, setRevertModal] = useState(false)
  const [simType, setSimType] = useState("")

  useEffect(() => {
    const storedSimType =
      typeof window !== "undefined" && localStorage.getItem("simType")

    if (!storedSimType && typeof window !== "undefined") {
      localStorage.setItem("simType", "msfs2020")
      setSimType("msfs2020")
    } else {
      setSimType(storedSimType || "")
    }
  }, [])

  async function editPreset() {
    setEditButton(true)
    const url =
      process.env.NEXT_PUBLIC_HUBHOP_API_BASEURL +
      "/" +
      simType +
      "/presets/" +
      id

    // post body data
    const preset: Omit<Preset, "id"> =
      simType === "msfs2020"
        ? {
            path:
              vendor +
              "." +
              aircraft +
              "." +
              system +
              "." +
              presetType +
              "." +
              label,
            vendor: vendor,
            aircraft: aircraft,
            system: system,
            code: code,
            label: label,
            presetType: presetType,
            status: "Updated",
            createdDate: new Date().toUTCString(),
            author: author,
            updatedBy: localStorage.getItem("username") ?? undefined,
            description: description,
            version: version,
          }
        : {
            vendor: vendor,
            aircraft: aircraft,
            system: system,
            label: label,
            code: code,
            presetType: presetType,
            codeType: codeType,
            status: "Updated",
            createdDate: new Date().toUTCString(),
            author: author,
            updatedBy: localStorage.getItem("username") ?? undefined,
            description: description,
            version: version,
          }

    // request options
    const options: RequestInit = {
      method: "PUT",
      body: JSON.stringify(preset),
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    }

    const saved = await fetch(url, options)
      .then((res) => res.status === 201)
      .catch(() => false)
    setEditButton(false)
    if (!saved) return toast.error("Error - Preset not saved!")

    // update only this preset in the local cache
    await presetTable(simType as SimType).update(id, {
      ...preset,
      version: version + 1,
    })
    toast.success("Saved")
  }

  async function revertPreset() {
    const url =
      process.env.NEXT_PUBLIC_HUBHOP_API_BASEURL +
      "/" +
      simType +
      "/presets/" +
      id

    // post body data
    const preset = revertObject

    // request options
    const options: RequestInit = {
      method: "PUT",
      body: JSON.stringify(preset),
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    }

    const saved = await fetch(url, options)
      .then((res) => res.status === 201)
      .catch(() => false)
    if (!saved) return toast.error("Error - Preset not reverted!")

    await presetTable(simType as SimType).update(id, revertObject)
    toast.success("Saved")
    setRevertModal(false)
  }

  return (
    <>
      <div
        className={`p-3 xl:p-0 text-${text} ${
          card && "container mx-auto mt-5 min-h-screen"
        }`}
      >
        <div className={`${card && "mb-5 rounded-lg bg-hhCard/40"}`}>
          {card && (
            <h2 className={`ml-5 pt-3 font-bold text-hhOrange text-${text}`}>
              {label}
            </h2>
          )}
          <div className="flex w-full flex-col space-y-2 p-5 text-hhText lg:flex-row lg:space-y-0 lg:space-x-5">
            <div className="flex w-full flex-col space-y-2 lg:w-1/6">
              {version > 1 ? (
                <PresetPreviewLabel title={"Updated by"} editData={updatedBy} />
              ) : (
                <PresetPreviewLabel title={"Author"} editData={author} />
              )}
              <PresetPreviewLabel
                title={version > 1 ? "Updated" : "Added"}
                editData={
                  createdDate ? new Date(createdDate).toLocaleString() : ""
                }
              />
              <PresetPreviewLabel title={"Version"} editData={version} />
              {REPORTING_ENABLED && (
                <PresetPreviewLabel
                  title={"Reported"}
                  editData={reported ?? 0}
                />
              )}
            </div>
            <div className="flex w-full flex-col space-y-2 lg:w-1/6">
              <PresetPreviewLabel
                title={"Vendor"}
                editData={vendor}
                edit={edit}
                onValueChange={setVendor}
              />
              <PresetPreviewLabel
                title={"Aircraft"}
                editData={aircraft}
                edit={edit}
                onValueChange={setAircraft}
              />
              <PresetPreviewLabel
                title={"System"}
                editData={system}
                edit={isModerator() && edit}
                onValueChange={setSystem}
              />
              <PresetPreviewLabel
                title={"Input / Output"}
                editData={presetType}
                edit={isModerator() && edit}
                onValueChange={(value) =>
                  setPresetType(value as Preset["presetType"])
                }
                options={presetTypesFor(simType)}
              />
              {typeof window !== "undefined" &&
                localStorage.getItem("simType") === "xplane" && (
                  <PresetPreviewLabel
                    title={"Code Type"}
                    editData={codeType}
                    edit={isModerator() && edit}
                    onValueChange={(value) =>
                      setCodeType(value as Preset["codeType"])
                    }
                    options={CODE_TYPES}
                  />
                )}
            </div>
            <div className="flex w-full flex-col space-y-2 lg:w-4/6">
              <PresetPreviewLabel
                title={"Preset name"}
                editData={label}
                edit={edit}
                onValueChange={setLabel}
              />
              <PresetPreviewLabel
                title={"Code"}
                editData={code}
                edit={edit}
                onValueChange={setCode}
                codeOrDescriptionBox={true}
              />
              <PresetPreviewLabel
                title={"Description"}
                edit={edit}
                editData={
                  description ? description : "No description available"
                }
                onValueChange={setDescription}
                codeOrDescriptionBox={true}
              />
            </div>
          </div>
          <div className="flex w-full justify-between px-5 pt-2 pb-5">
            <div className="flex flex-col space-y-2 xl:flex-row xl:items-center xl:space-y-0 xl:space-x-5">
              {isModerator() && (
                <Button
                  variant="destructive"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  <IconTrash />
                  Delete
                </Button>
              )}
            </div>
            <div className="flex flex-col-reverse justify-between space-y-2 space-y-reverse xl:flex-row xl:items-center xl:space-y-0 xl:space-x-5">
              <AnimatePresence>
                {edit && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="hidden xl:block"
                  >
                    <div onClick={() => editPreset()}>
                      <SavePresetButton disabled={editButton} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {
                <>
                  <AnimatePresence>
                    {editTooltip && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed right-0 bottom-5 z-50 mx-3 rounded-lg bg-red-800 p-5 px-5 py-2 font-semibold text-hhText md:right-5"
                      >
                        No permission to edit this preset. You have to be logged
                        in to perform this action.
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <EditToggle
                    onToggle={() => {
                      if (
                        localStorage.getItem("username") === author ||
                        isModerator()
                      ) {
                        setEdit((e) => !e)
                      } else {
                        seteditTooltip(true)
                        setTimeout(() => {
                          seteditTooltip(false)
                        }, 5000)
                      }
                    }}
                    toggleEdit={edit}
                  />
                </>
              }
              <AnimatePresence>
                {edit && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="block xl:hidden"
                  >
                    <div onClick={() => editPreset()}>
                      <SavePresetButton disabled={editButton} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {!card && <OpenPresetButton id={id} />}
            </div>
          </div>
        </div>
        {card && (
          <PromoSlot
            slot="preset-detail"
            layout="row"
            context={{
              sim: simType === "xplane" ? "xplane" : "msfs2020",
              vendor,
              aircraft,
            }}
            className="mb-5"
          />
        )}
        {simType === "msfs2020" && showingHistory && (
          <div className="flex flex-col">
            {version > 1 ? (
              <PresetHistoryList
                presetHistory={history ?? []}
                loading={loading ?? false}
                revertHistory={(o) => (
                  setRevertObject(o),
                  setRevertModal(true)
                )}
              />
            ) : (
              <div className="rounded-lg bg-hhCard/40 p-3 text-xl text-hhText/50 transition-all">
                No History available
              </div>
            )}
          </div>
        )}
      </div>
      <AnimatePresence>
        {deleteModalOpen && (
          <motion.div
            key="DeleteModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
          >
            <DeleteConfirmationModal
              onClose={() => setDeleteModalOpen(false)}
              presetId={id}
              label={label}
            />
          </motion.div>
        )}
        {reportModalOpen && (
          <motion.div
            key="ReportModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
          >
            <ReportPresetModal
              onClose={() => setReportModalOpen(false)}
              presetId={id}
              label={label}
            />
          </motion.div>
        )}
        {fixedModalOpen && (
          <motion.div
            key="FixedModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
          >
            <FixedPresetModal
              onClose={() => setFixedModalOpen(false)}
              presetId={id}
              label={label}
            />
          </motion.div>
        )}
        {revertModal && (
          <motion.div
            key="RevertModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
          >
            <AlertDialog
              open
              onOpenChange={(open) => !open && setRevertModal(false)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Revert Preset</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to revert this preset?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No</AlertDialogCancel>
                  <AlertDialogAction onClick={revertPreset}>
                    Yes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default PresetCard
