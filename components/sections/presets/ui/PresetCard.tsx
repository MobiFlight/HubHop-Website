import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PresetHistoryList from "../singlePresetView/PresetHistoryList";
import DeleteButton from "./deletePreset/DeleteButton";
import EditToggle from "./editPreset/EditToggle";
import PresetPreviewLabel from "./PresetInputLabel";
import SavePresetButton from "./editPreset/SavePresetButton";
import ReportPresetModal from "./reportPreset/ReportPresetModal";
import DeleteConfirmationModal from "./deletePreset/DeleteConfirmationModal";
import OpenPresetButton from "./OpenPresetButton";
import FixedPresetModal from "./reportPreset/FixedPresetModal";
import { db } from "../../../../services/db";
import Modal from "../../Shared/Modal";
import ButtonOrange from "../../Shared/ButtonOrange";
import ButtonDark from "../../Shared/ButtonDark";

interface Props {
  id: string;
  label: string;
  updatedBy: string;
  author: string;
  createdDate: string;
  version: string;
  reported: string;
  vendor: string;
  aircraft: string;
  system: string;
  presetType: string;
  codeType: string;
  code: string;
  description: string;
  loading?: any;
  history?: string;
  setVendor: Function;
  setAircraft: Function;
  setSystem: Function;
  setPresetType: Function;
  setLabel: Function;
  setCodeType: Function;
  setCode: Function;
  setDescription: Function;
  showingHistory: boolean;
  text: string;
  card: boolean;
  data?: any;
  deletedToast: Function;
  reportedToast: Function;
  fixedToast: Function;
  savedToast: Function;
}

const PresetCard: React.FC<Props> = ({
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
  deletedToast,
  reportedToast,
  savedToast,
  fixedToast,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [fixedModalOpen, setFixedModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(showingHistory);
  const [edit, setEdit] = useState(false);
  const [editButton, setEditButton] = useState(false);
  const [editTooltip, seteditTooltip] = useState(false);
  const [deleteTooltip, setDeleteTooltip] = useState(false);
  const [revertObject, setRevertObject] = useState({});
  const [revertModal, setRevertModal] = useState(false);
  const [simType, setSimType] = useState(
    localStorage.getItem("simType") === null
      ? localStorage.setItem("simType", "msfs2020")
      : localStorage.getItem("simType")
  );

  async function editPreset() {
    setEditButton(true);
    const url =
      process.env.NEXT_PUBLIC_HUBHOP_API_BASEURL +
      "/" +
      simType +
      "/presets/" +
      id;

    // post body data
    const preset =
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
            updatedBy: localStorage.getItem("username"),
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
            updatedBy: localStorage.getItem("username"),
            description: description,
            version: version,
          };

    // request options
    const options: any = {
      method: "PUT",
      body: JSON.stringify(preset),
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    };

    // send POST request
    fetch(url, options).then(async (res) => {
      if (res.status != 201) {
        alert("Error occured");
      }
      const localStoragePresets =
        simType === "msfs2020"
          ? (await db.presetsMsfs.toArray()) || []
          : (await db.presetsXplane.toArray()) || [];

      let result = localStoragePresets.map((x: any) =>
        simType === "msfs2020"
          ? x.id === id
            ? {
                ...x,
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
                updatedBy: localStorage.getItem("username"),
                description: description,
                version: version + 1,
              }
            : x
          : x.id === id
          ? {
              ...x,
              vendor: vendor,
              aircraft: aircraft,
              system: system,
              code: code,
              label: label,
              presetType: presetType,
              codeType: codeType,
              status: "Updated",
              createdDate: new Date().toUTCString(),
              author: author,
              updatedBy: localStorage.getItem("username"),
              description: description,
              version: version + 1,
            }
          : x
      );

      simType === "msfs2020"
        ? await db.presetsMsfs
            .clear()
            .then(() => db.presetsMsfs.bulkAdd(result))
        : await db.presetsXplane
            .clear()
            .then(() => db.presetsXplane.bulkAdd(result));
      setEditButton(false);
      savedToast();
    });
  }

  async function revertPreset() {
    const url =
      process.env.NEXT_PUBLIC_HUBHOP_API_BASEURL +
      "/" +
      simType +
      "/presets/" +
      id;

    // post body data
    const preset = revertObject;

    // request options
    const options: any = {
      method: "PUT",
      body: JSON.stringify(preset),
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    };

    // send POST request
    fetch(url, options).then(async (res) => {
      if (res.status != 201) {
        alert("Error occured");
      }
      const localStoragePresets =
        simType === "msfs2020"
          ? (await db.presetsMsfs.toArray()) || []
          : (await db.presetsXplane.toArray()) || [];

      let result = localStoragePresets.map((x: any) =>
        x.id === id
          ? {
              ...x,
              revertObject,
            }
          : x
      );
      simType === "msfs2020"
        ? await db.presetsMsfs
            .clear()
            .then(() => db.presetsMsfs.bulkAdd(result))
        : await db.presetsXplane
            .clear()
            .then(() => db.presetsXplane.bulkAdd(result));
      savedToast();
      setRevertModal(false);
    });
  }

  return (
    <div>
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
              {version > "1" ? (
                <PresetPreviewLabel title={"Updated by"} editData={updatedBy} />
              ) : (
                <PresetPreviewLabel title={"Author"} editData={author} />
              )}
              <PresetPreviewLabel
                title={version > "1" ? "Updated" : "Added"}
                editData={new Date(createdDate).toLocaleString()}
              />
              <PresetPreviewLabel title={"Version"} editData={version} />
              {
                <PresetPreviewLabel
                  title={"Reported"}
                  editData={reported >= "1" ? reported : "0"}
                />
              }
            </div>
            <div className="flex w-full flex-col space-y-2 lg:w-1/6">
              <PresetPreviewLabel
                title={"Vendor"}
                editData={vendor}
                edit={edit}
                inputHandler={(e: any) => setVendor(e)}
              />
              <PresetPreviewLabel
                title={"Aircraft"}
                editData={aircraft}
                edit={edit}
                inputHandler={(e: any) => setAircraft(e)}
              />
              <PresetPreviewLabel
                title={"System"}
                editData={system}
                edit={edit}
                inputHandler={(e: any) => setSystem(e)}
              />
              <PresetPreviewLabel
                title={"Input / Output"}
                editData={presetType}
                edit={edit}
                inputHandler={(e: any) => setPresetType(e)}
              />
              {localStorage.getItem("simType") === "xplane" && (
                <PresetPreviewLabel
                  title={"Code Type"}
                  editData={codeType}
                  edit={edit}
                  inputHandler={(e: any) => setCodeType(e)}
                />
              )}
            </div>
            <div className="flex w-full flex-col space-y-2 lg:w-4/6">
              <PresetPreviewLabel
                title={"Preset name"}
                editData={label}
                edit={edit}
                inputHandler={(e: any) => setLabel(e)}
              />
              <PresetPreviewLabel
                title={"Code"}
                editData={code}
                edit={edit}
                inputHandler={(e: any) => setCode(e)}
                codeOrDescriptionBox={true}
              />
              <PresetPreviewLabel
                title={"Description"}
                edit={edit}
                editData={
                  description ? description : "No description available"
                }
                inputHandler={(e: any) => setDescription(e)}
                codeOrDescriptionBox={true}
              />
            </div>
          </div>
          <div className="flex w-full justify-between px-5 pb-5 pt-2">
            <div className="flex flex-col space-y-2 xl:flex-row xl:items-center xl:space-y-0 xl:space-x-5">
              <div
                onClick={() => {
                  if (
                    localStorage
                      .getItem("roles")
                      ?.toLocaleLowerCase()
                      .includes("moderator")
                  ) {
                    setDeleteModalOpen(true);
                  } else {
                    setDeleteTooltip(true);
                    setTimeout(() => {
                      setDeleteTooltip(false);
                    }, 5000);
                  }
                }}
              >
                <DeleteButton />
              </div>
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
                        className="fixed bottom-5 right-0 z-50 mx-3 rounded-lg bg-red-800 p-5 px-5 py-2 font-semibold text-hhText md:right-5"
                      >
                        No permission to edit this preset. You have to be logged
                        in to perform this action.
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <EditToggle
                    setEdit={() => {
                      if (localStorage.getItem("username")) {
                        setEdit((e) => !e);
                      } else {
                        seteditTooltip(true);
                        setTimeout(() => {
                          seteditTooltip(false);
                        }, 5000);
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
        {simType === "msfs2020" && showHistory && (
          <div className="flex flex-col">
            {version > "1" ? (
              <PresetHistoryList
                presetHistory={history}
                loading={loading}
                revertHistory={(o: any) => (
                  setRevertObject(o), setRevertModal(true)
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
              deletedToast={deletedToast}
              setDeleteModalOpen={() => setDeleteModalOpen(false)}
              presetId={id}
              label={label}
            />
          </motion.div>
        )}
        <AnimatePresence>
          {deleteTooltip && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-5 right-0 z-50 mx-3 rounded-lg bg-red-800 p-5 px-5 py-2 text-sm font-semibold text-hhText md:right-5"
            >
              No permission to delete a preset. You have to be a moderator to
              perform this action.
            </motion.div>
          )}
        </AnimatePresence>
        {reportModalOpen && (
          <motion.div
            key="ReportModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
          >
            <ReportPresetModal
              reportedToast={reportedToast}
              setReportModalOpen={() => setReportModalOpen(false)}
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
              setFixedModalOpen={() => setFixedModalOpen(false)}
              presetId={id}
              label={label}
              fixedToast={fixedToast}
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
            <Modal
              title="Revert Preset"
              closeModal={() => setRevertModal(false)}
              position={"fixed"}
              height={true}
            >
              <p>Are you sure you want to rever this preset?</p>
              <div className="mt-5 flex justify-between">
                <button onClick={() => setRevertModal(false)}>
                  <ButtonDark>No</ButtonDark>
                </button>
                <button onClick={revertPreset}>
                  <ButtonOrange>Yes</ButtonOrange>
                </button>
              </div>
            </Modal>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PresetCard;
