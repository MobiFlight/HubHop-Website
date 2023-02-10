import { useEffect, useState } from "react";
import PresetFilter from "./presetTable/PresetFilter";
import PresetTable from "./presetTable/PresetTable";
import { AiOutlineLoading } from "react-icons/ai";
import ExportPresetsModal from "./ui/exportPresets/ExportPresetsModal";
import { AnimatePresence, motion } from "framer-motion";
import AddPresetsModal from "./ui/addPreset/AddPresetsModal";
import Toast from "../Shared/Toast";
import { BsCheck2Square } from "react-icons/bs";
import { getAccessToken } from "../../../services/msalFunctions";
import { msalInstance } from "../../../services/msal";
import { db } from "../../../services/db";
import Image from "next/image";
import { useLiveQuery } from "dexie-react-hooks";

const Presets: React.FC = () => {
  const customLoader = ({ src }: any) => {
    return src;
  };
  const [loading, setLoading] = useState(false);
  const [presetsMsfs, setPresetsMsfs] = useState<any[]>([]);
  const [presetsXplane, setPresetsXplane] = useState<any[]>([]);
  const [filteredPresets, setFilteredPresets] = useState(
    localStorage.getItem("searchFilter") === ""
      ? ""
      : localStorage.getItem("searchFilter") || ""
  );
  const [filteredVendors, setFilteredVendors] = useState(
    localStorage.getItem("vendorFilter") === ""
      ? ""
      : localStorage.getItem("vendorFilter") || ""
  );
  const [filteredAircrafts, setFilteredAircrafts] = useState(
    localStorage.getItem("aircraftFilter") === ""
      ? ""
      : localStorage.getItem("aircraftFilter") || ""
  );
  const [filteredSystems, setFilteredSystems] = useState(
    localStorage.getItem("systemFilter") === ""
      ? ""
      : localStorage.getItem("systemFilter") || ""
  );
  const [filteredPresetTypes, setFilteredPresetTypes] = useState(
    localStorage.getItem("presetTypeFilter") === ""
      ? ""
      : localStorage.getItem("presetTypeFilter") || ""
  );
  const [filteredCodeTypes, setFilteredCodeTypes] = useState(
    localStorage.getItem("codeTypeFilter") === ""
      ? ""
      : localStorage.getItem("codeTypeFilter") || ""
  );
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deletedToast, setDeletedToast] = useState(false);
  const [reportedToast, setReportedToast] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [fixedToast, setFixedToast] = useState(false);
  const [showMyPresets, setShowMyPresets] = useState(false);
  const [showReportedPresets, setShowReportedPresets] = useState(false);
  const [simType, setSimType] = useState(
    localStorage.getItem("simType") === null
      ? localStorage.setItem("simType", "msfs2020")
      : localStorage.getItem("simType")
  );
  const [presets, setPresets] = useState<any[]>([]);
  const [filterOpen, setFilterOpen] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState("");

  const last = async () => {
    const resMsfs = await fetch(
      process.env.NEXT_PUBLIC_HUBHOP_API_LAST_MSFS || "",
      {
        redirect: "follow",
      }
    );
    const resXplane = await fetch(
      process.env.NEXT_PUBLIC_HUBHOP_API_LAST_XPLANE || "",
      {
        redirect: "follow",
      }
    );
    const lastMsfs = await resMsfs.json();
    const lastXplane = await resXplane.json();
    return (
      localStorage.setItem("lastMsfs", lastMsfs[0].createdDate),
      lastMsfs[0].createdDate,
      localStorage.setItem("lastXplane", lastXplane[0].createdDate),
      lastXplane[0].createdDate
    );
  };

  const xplanePresets = useLiveQuery(() => db.presetsXplane.toArray());
  const msfsPresets = useLiveQuery(() => db.presetsMsfs.toArray());

  useEffect(() => {
    if (!xplanePresets) return null || undefined;
    if (!msfsPresets) return null || undefined;
    setPresetsXplane(xplanePresets);
    setPresetsMsfs(msfsPresets);
    setPresets(simType === "msfs2020" ? presetsMsfs : presetsXplane);
  }, [simType, presetsMsfs, presetsXplane, xplanePresets, msfsPresets]);

  const fetchPresetsMsfs = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_HUBHOP_API_BASEURL + "/msfs2020/presets",
      { redirect: "follow" }
    );
    const fetchedPresets = await res.json();
    const today = new Date();

    return (
      localStorage.setItem("fetchedMsfs", today.toISOString()),
      db.presetsMsfs.clear().then(() => db.presetsMsfs.bulkAdd(fetchedPresets)),
      setPresetsMsfs(fetchedPresets)
    );
  };
  const fetchPresetsXplane = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_HUBHOP_API_BASEURL + "/xplane/presets",
      { redirect: "follow" }
    );
    const fetchedPresets = await res.json();
    const today = new Date();

    return (
      localStorage.setItem("fetchedXplane", today.toISOString()),
      db.presetsXplane
        .clear()
        .then(() => db.presetsXplane.bulkAdd(fetchedPresets)),
      setPresetsXplane(fetchedPresets)
    );
  };

  useEffect(() => {
    async function fetchRoutine() {
      setLoading(true);
      setLoadingStatus("Checking for updates");
      await last();
      // setLoading(false);
      setLoadingStatus("");
      if (
        (await db.presetsMsfs.count()).toFixed() === "0" ||
        (await db.presetsXplane.count()).toFixed() === "0"
      ) {
        // setLoading(true);
        setLoadingStatus("Downloading MSFS Presets");
        await fetchPresetsMsfs();
        setLoadingStatus("Downloading X-Plane Presets");
        await fetchPresetsXplane();
        // setLoading(false);
        setLoadingStatus("");
      } else {
        // setLoading(true);
        setLoadingStatus("Loading MSFS Presets");
        setPresetsMsfs(
          (await db.presetsMsfs.orderBy("vendor").toArray()) || []
        );
        setLoadingStatus("");
        setLoadingStatus("Loading X-Plane Presets");
        setPresetsXplane(
          (await db.presetsXplane.orderBy("vendor").toArray()) || []
        );
        setLoadingStatus("");
        // setLoading(false);
      }

      if (
        (localStorage.getItem("lastMsfs") || "") >
        (localStorage.getItem("fetchedMsfs") || "")
      ) {
        // setLoading(true);
        setLoadingStatus("Downloading MSFS Presets");
        await fetchPresetsMsfs();
        // setLoading(false);
        setLoadingStatus("");
      }
      if (
        (localStorage.getItem("lastXplane") || "") >
        (localStorage.getItem("fetchedXplane") || "")
      ) {
        // setLoading(true);
        setLoadingStatus("Downloading X-Plane Presets");
        await fetchPresetsXplane();
        // setLoading(false);
        setLoadingStatus("");
      }
      setLoading(false);
    }
    fetchRoutine();
  }, [addModalOpen]);

  useEffect(() => {
    const myAccounts = msalInstance.getAllAccounts();
    const account = myAccounts[0];
    if (account) {
      getAccessToken();
    }
  }, []);

  const filteredMyPresetList = presets.filter((preset) => {
    if (showReportedPresets) {
      return preset.reported > 0;
    }
    return presets;
  });
  const filteredReportedPresets = filteredMyPresetList.filter((preset) => {
    if (showMyPresets) {
      if (localStorage.getItem("username")) {
        return (
          preset.author === localStorage.getItem("username") ||
          preset.updatedBy === localStorage.getItem("username")
        );
      }
    }
    return presets;
  });
  const filteredVendorList = filteredReportedPresets.filter((preset) =>
    preset.vendor.toLowerCase().includes(filteredVendors.toLowerCase())
  );
  const filteredAircraftList = filteredVendorList.filter((preset) => {
    if (filteredAircrafts.length == 0) {
      return preset.aircraft.toLowerCase("");
    } else {
      return preset.aircraft.toLowerCase() === filteredAircrafts.toLowerCase();
    }
  });
  const filteredSystemList = filteredAircraftList.filter((preset) => {
    if (filteredSystems.length == 0) {
      return preset.system.toLowerCase("");
    } else {
      return preset.system.toLowerCase() === filteredSystems.toLowerCase();
    }
  });
  const filteredInputTypeList = filteredSystemList.filter((preset) => {
    if (preset.presetType) {
      if (filteredPresetTypes.length == 0) {
        return preset.presetType.toLowerCase("");
      } else {
        return (
          preset.presetType.toLowerCase() === filteredPresetTypes.toLowerCase()
        );
      }
    } else {
      return preset;
    }
  });
  const filteredCodeTypeList = filteredInputTypeList.filter((preset) => {
    if (preset.codeType) {
      if (filteredCodeTypes.length == 0) {
        return preset.codeType.toLowerCase("");
      } else {
        return (
          preset.codeType.toLowerCase() === filteredCodeTypes.toLowerCase()
        );
      }
    } else {
      return preset;
    }
  });

  const filteredItems = filteredCodeTypeList.filter((preset) => {
    if (preset.description) {
      if (preset.author) {
        return (
          preset.label.toLowerCase().includes(filteredPresets.toLowerCase()) ||
          preset.author.toLowerCase().includes(filteredPresets.toLowerCase()) ||
          preset.code.toLowerCase().includes(filteredPresets.toLowerCase()) ||
          preset.description
            .toLowerCase()
            .includes(filteredPresets.toLowerCase())
        );
      }
      if (preset.updatedBy) {
        return (
          preset.label.toLowerCase().includes(filteredPresets.toLowerCase()) ||
          preset.updatedBy
            .toLowerCase()
            .includes(filteredPresets.toLowerCase()) ||
          preset.code.toLowerCase().includes(filteredPresets.toLowerCase()) ||
          preset.description
            .toLowerCase()
            .includes(filteredPresets.toLowerCase())
        );
      } else {
        return (
          preset.label.toLowerCase().includes(filteredPresets.toLowerCase()) ||
          preset.code.toLowerCase().includes(filteredPresets.toLowerCase()) ||
          preset.description
            .toLowerCase()
            .includes(filteredPresets.toLowerCase())
        );
      }
    } else {
      if (preset.author) {
        return (
          preset.label.toLowerCase().includes(filteredPresets.toLowerCase()) ||
          preset.author.toLowerCase().includes(filteredPresets.toLowerCase()) ||
          preset.code.toLowerCase().includes(filteredPresets.toLowerCase())
        );
      }
      if (preset.updatedBy) {
        return (
          preset.label.toLowerCase().includes(filteredPresets.toLowerCase()) ||
          preset.updatedBy
            .toLowerCase()
            .includes(filteredPresets.toLowerCase()) ||
          preset.code.toLowerCase().includes(filteredPresets.toLowerCase())
        );
      } else {
        return (
          preset.label.toLowerCase().includes(filteredPresets.toLowerCase()) ||
          preset.code.toLowerCase().includes(filteredPresets.toLowerCase())
        );
      }
      // return (
      //   preset.label.toLowerCase().includes(filteredPresets.toLowerCase()) ||
      //   preset.code.toLowerCase().includes(filteredPresets.toLowerCase())
      // );
    }
  });

  async function deleteToast() {
    setDeletedToast(true);
    setPresetsMsfs((await db.presetsMsfs.orderBy("vendor").toArray()) || []);
    setPresetsMsfs((await db.presetsXplane.orderBy("vendor").toArray()) || []);
    setTimeout(() => {
      setDeletedToast(false);
    }, 5000);
  }
  async function reportToast() {
    setReportedToast(true);
    setPresetsMsfs((await db.presetsMsfs.orderBy("vendor").toArray()) || []);
    setPresetsMsfs((await db.presetsXplane.orderBy("vendor").toArray()) || []);
    setTimeout(() => {
      setReportedToast(false);
    }, 5000);
  }
  async function fixToast() {
    setFixedToast(true);
    setPresetsMsfs((await db.presetsMsfs.orderBy("vendor").toArray()) || []);
    setPresetsMsfs((await db.presetsXplane.orderBy("vendor").toArray()) || []);
    setTimeout(() => {
      setFixedToast(false);
    }, 5000);
  }
  async function saveToast() {
    setSavedToast(true);
    setPresetsMsfs((await db.presetsMsfs.orderBy("vendor").toArray()) || []);
    setPresetsMsfs((await db.presetsXplane.orderBy("vendor").toArray()) || []);
    setTimeout(() => {
      setSavedToast(false);
    }, 5000);
  }

  useEffect(() => {
    localStorage.getItem("simType") === "msfs2020"
      ? document.body.classList.remove("xplane")
      : document.body.classList.add("xplane");
  }, [localStorage.getItem("simType")]);

  return (
    <div>
      {loading ? (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="animate-spin text-6xl text-hhOrange">
            <AiOutlineLoading />
          </div>
          <p className="mt-5 font-semibold">
            {loadingStatus != "" ? loadingStatus : "Loading Presets"}
          </p>
        </div>
      ) : presets.length ? (
        <div className="min-h-screen">
          <div className="flex flex-col p-3 md:flex-row md:space-x-3">
            <div>
              <div>
                <div className="mb-3 rounded-lg bg-hhCard/40 py-5">
                  <button
                    onClick={() => {
                      setSimType(
                        simType === "msfs2020" ? "xplane" : "msfs2020"
                      );
                      setFilteredVendors("");
                      setFilteredAircrafts("");
                      setFilteredSystems("");
                      setFilteredPresetTypes("");
                      setFilteredCodeTypes("");
                      localStorage.getItem("simType") === "msfs2020"
                        ? localStorage.setItem("simType", "xplane")
                        : localStorage.setItem("simType", "msfs2020");
                    }}
                    className={`grid ${
                      filterOpen
                        ? "mb-3 w-full grid-cols-3 px-3"
                        : "w-full px-3 md:mb-3 md:ml-2 md:w-[50px] md:grid-rows-3 md:items-center md:justify-center"
                    } items-center justify-items-center text-xl`}
                  >
                    <div
                      className={`transition-all ${
                        filterOpen
                          ? "rotate-0"
                          : "md:origin-center md:-rotate-90 md:whitespace-nowrap"
                      } ${
                        simType === "msfs2020" ? "font-bold" : "font-normal"
                      }`}
                    >
                      MSFS 2020
                    </div>
                    <div
                      className={`relative w-full ${
                        filterOpen
                          ? "flex h-fit"
                          : "flex h-fit md:mt-3 md:flex md:h-full md:min-h-[90px] md:w-fit md:flex-col"
                      }  items-center rounded-lg bg-hhBG transition-all ${
                        simType === "msfs2020" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <motion.div
                        transition={{
                          type: "spring",
                          stiffness: 700,
                          damping: 50,
                        }}
                        layout
                        className={`${
                          filterOpen ? "h-4 w-10" : "h-4 w-10 md:h-5 md:w-4"
                        } rounded-lg transition-colors ${
                          simType === "msfs2020"
                            ? "bg-[#bfcad1]"
                            : "bg-[#0fb5e8]"
                        }`}
                      ></motion.div>
                    </div>
                    <div
                      className={`transition-all ${
                        filterOpen
                          ? "rotate-0"
                          : "md:origin-center md:-rotate-90 md:transform"
                      } ${simType === "xplane" ? "font-bold" : "font-normal"}`}
                    >
                      X-Plane
                    </div>
                  </button>
                  {filterOpen && (
                    <div className={filterOpen ? "px-5" : "p-0"}>
                      <div className="relative mx-auto h-12 w-4/6">
                        <AnimatePresence>
                          {simType === "xplane" && (
                            <motion.div
                              initial={{ opacity: 1 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="absolute mx-auto h-12 w-full"
                            >
                              <Image
                                loader={customLoader}
                                objectFit="contain"
                                priority
                                src={"/images/X-Plane_12_logo.svg"}
                                unoptimized
                                layout="fill"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <AnimatePresence>
                          {simType === "msfs2020" && (
                            <motion.div
                              initial={{ opacity: 1 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="absolute mx-auto h-12 w-full"
                            >
                              <Image
                                loader={customLoader}
                                objectFit="contain"
                                priority
                                src={"/images/Microsoft_Flight_Simulator.png"}
                                unoptimized
                                layout="fill"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </div>
                <PresetFilter
                  filterOpen={filterOpen}
                  setFilterOpen={() => setFilterOpen((prev) => !prev)}
                  search={(e: React.ChangeEvent<HTMLInputElement>) => (
                    setFilteredPresets(e.target.value),
                    localStorage.setItem("searchFilter", e.target.value)
                  )}
                  filterVendor={(e: React.ChangeEvent<HTMLInputElement>) => (
                    setFilteredVendors(e.target.value),
                    localStorage.setItem("vendorFilter", e.target.value)
                  )}
                  filterAircraft={(e: React.ChangeEvent<HTMLInputElement>) => (
                    setFilteredAircrafts(e.target.value),
                    localStorage.setItem("aircraftFilter", e.target.value)
                  )}
                  filterSystem={(e: React.ChangeEvent<HTMLInputElement>) => (
                    setFilteredSystems(e.target.value),
                    localStorage.setItem("systemFilter", e.target.value)
                  )}
                  filterPresetType={(
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => (
                    setFilteredPresetTypes(e.target.value),
                    localStorage.setItem("presetTypeFilter", e.target.value)
                  )}
                  filterCodeType={(e: React.ChangeEvent<HTMLInputElement>) => (
                    setFilteredCodeTypes(e.target.value),
                    localStorage.setItem("codeTypeFilter", e.target.value)
                  )}
                  resetFilter={() => (
                    setFilteredPresets(""),
                    setFilteredVendors(""),
                    setFilteredAircrafts(""),
                    setFilteredSystems(""),
                    setFilteredPresetTypes(""),
                    setFilteredCodeTypes(""),
                    localStorage.setItem("searchFilter", ""),
                    localStorage.setItem("vendorFilter", ""),
                    localStorage.setItem("aircraftFilter", ""),
                    localStorage.setItem("systemFilter", ""),
                    localStorage.setItem("presetTypeFilter", ""),
                    setShowMyPresets(false),
                    setShowReportedPresets(false)
                  )}
                  filteredPresets={filteredPresets}
                  filteredVendors={filteredVendors}
                  filteredAircrafts={filteredAircrafts}
                  filteredSystems={filteredSystems}
                  filteredPresetTypes={filteredPresetTypes}
                  filteredCodeTypes={filteredCodeTypes}
                  filteredItems={filteredItems}
                  setShowMyPresets={() => setShowMyPresets((prev) => !prev)}
                  setShowReportedPresets={() =>
                    setShowReportedPresets((prev) => !prev)
                  }
                  showMyPresets={showMyPresets}
                  showReportedPresets={showReportedPresets}
                />
              </div>
            </div>
            <PresetTable
              setAddModalOpen={() => setAddModalOpen(true)}
              setExportModalOpen={() => setExportModalOpen(true)}
              data={filteredItems}
              deletedToast={deleteToast}
              reportedToast={reportToast}
              fixedToast={fixToast}
              savedToast={saveToast}
            />
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="animate-spin text-6xl text-hhOrange">
            <AiOutlineLoading />
          </div>
          <p className="mt-5">Loading Presets</p>
        </div>
      )}
      <AnimatePresence>
        {exportModalOpen && (
          <motion.div
            key="exportModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
          >
            <ExportPresetsModal
              setExportModalOpen={() => setExportModalOpen(false)}
            />
          </motion.div>
        )}
        {addModalOpen && (
          <motion.div
            key="addPresetModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
          >
            <AddPresetsModal
              presets={presets}
              setAddModalOpen={async () => {
                setAddModalOpen(false);
                await last();
                if ((await db.presetsMsfs.count()).toFixed() === "0") {
                  await fetchPresetsMsfs();
                  await fetchPresetsXplane();
                } else {
                  setPresetsMsfs(
                    (await db.presetsMsfs.orderBy("vendor").toArray()) || []
                  );
                  setPresetsXplane(
                    (await db.presetsXplane.orderBy("vendor").toArray()) || []
                  );
                }
                if (
                  (localStorage.getItem("last") || "") >
                  (localStorage.getItem("fetched") || "")
                ) {
                  await fetchPresetsMsfs();
                  await fetchPresetsXplane();
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deletedToast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Toast bg={"rgb(22 101 52 / var(--tw-bg-opacity))"} textColor={""}>
              <div className="mr-1 bg-green-800 text-xl">
                <BsCheck2Square />
              </div>
              <p>Preset successfully deleted!</p>
            </Toast>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {reportedToast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Toast bg={"rgb(22 101 52 / var(--tw-bg-opacity))"} textColor={""}>
              <div className="mr-1 bg-green-800 text-xl">
                <BsCheck2Square />
              </div>
              <p>Preset successfully reported!</p>
            </Toast>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {fixedToast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Toast bg={"rgb(22 101 52 / var(--tw-bg-opacity))"} textColor={""}>
              <div className="mr-1 bg-green-800 text-xl">
                <BsCheck2Square />
              </div>
              <p>Preset successfully fixed!</p>
            </Toast>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {savedToast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Toast bg={"rgb(22 101 52 / var(--tw-bg-opacity))"} textColor={""}>
              <div className="mr-1 bg-green-800 text-xl">
                <BsCheck2Square />
              </div>
              <p>Preset successfully saved!</p>
            </Toast>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Presets;
