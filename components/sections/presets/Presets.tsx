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
import { useLiveQuery } from "dexie-react-hooks";

const Presets: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [presets, setPresets] = useState<any[]>([]);
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
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deletedToast, setDeletedToast] = useState(false);
  const [reportedToast, setReportedToast] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [fixedToast, setFixedToast] = useState(false);
  const [showMyPresets, setShowMyPresets] = useState(false);
  const [showReportedPresets, setShowReportedPresets] = useState(false);

  const last = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_HUBHOP_API_LAST || "");
    const last = await res.json();
    return (
      localStorage.setItem("last", last[0].createdDate), last[0].createdDate
    );
  };

  const fetchPresets = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_HUBHOP_API_BASEURL + "/presets"
    );
    const fetchedPresets = await res.json();
    const today = new Date();

    return (
      localStorage.setItem("fetched", today.toISOString()),
      // sessionStorage.setItem("presets", JSON.stringify(fetchedPresets)),
      db.presets.clear().then(() => db.presets.bulkAdd(fetchedPresets)),
      setPresets(fetchedPresets)
    );
  };

  useEffect(() => {
    async function fetchRoutine() {
      setLoading(true);
      await last();
      setLoading(false);
      if ((await db.presets.count()).toFixed() === "0") {
        setLoading(true);
        await fetchPresets();
        setLoading(false);
      } else {
        setLoading(true);
        setPresets((await db.presets.orderBy("vendor").toArray()) || []);
        setLoading(false);
      }

      if (
        (localStorage.getItem("last") || "") >
        (localStorage.getItem("fetched") || "")
      ) {
        setLoading(true);
        await fetchPresets();
        setLoading(false);
      }
    }
    fetchRoutine();
  }, []);

  // useEffect(() => {
  //   async function getPresets
  //   if ((await db.presets.count()).toFixed() != "0") {
  //     setPresets(JSON.parse(sessionStorage.getItem("presets") || ""));
  //   }
  // }, [sessionStorage.getItem("presets")]);

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

  const filteredItems = filteredInputTypeList.filter((preset) => {
    if (preset.description) {
      return (
        preset.label.toLowerCase().includes(filteredPresets.toLowerCase()) ||
        preset.code.toLowerCase().includes(filteredPresets.toLowerCase()) ||
        preset.description.toLowerCase().includes(filteredPresets.toLowerCase())
      );
    } else {
      return (
        preset.label.toLowerCase().includes(filteredPresets.toLowerCase()) ||
        preset.code.toLowerCase().includes(filteredPresets.toLowerCase())
      );
    }
  });

  async function deleteToast() {
    setDeletedToast(true);
    setPresets((await db.presets.orderBy("vendor").toArray()) || []);

    setTimeout(() => {
      setDeletedToast(false);
    }, 5000);
  }
  async function reportToast() {
    setReportedToast(true);
    setPresets((await db.presets.orderBy("vendor").toArray()) || []);

    setTimeout(() => {
      setReportedToast(false);
    }, 5000);
  }
  async function fixToast() {
    setFixedToast(true);
    setPresets((await db.presets.orderBy("vendor").toArray()) || []);

    setTimeout(() => {
      setFixedToast(false);
    }, 5000);
  }
  async function saveToast() {
    setSavedToast(true);
    setPresets((await db.presets.orderBy("vendor").toArray()) || []);
    setTimeout(() => {
      setSavedToast(false);
    }, 5000);
  }

  return (
    <div>
      {loading ? (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="animate-spin text-6xl text-hhOrange">
            <AiOutlineLoading />
          </div>
          <p className="mt-5">Loading Presets</p>
        </div>
      ) : presets.length ? (
        <div className="min-h-screen">
          <div className="flex flex-col p-3 md:flex-row md:space-x-3">
            <PresetFilter
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
              filterPresetType={(e: React.ChangeEvent<HTMLInputElement>) => (
                setFilteredPresetTypes(e.target.value),
                localStorage.setItem("presetTypeFilter", e.target.value)
              )}
              resetFilter={() => (
                setFilteredPresets(""),
                setFilteredVendors(""),
                setFilteredAircrafts(""),
                setFilteredSystems(""),
                setFilteredPresetTypes(""),
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
              filteredItems={filteredItems}
              setShowMyPresets={() => setShowMyPresets((prev) => !prev)}
              setShowReportedPresets={() =>
                setShowReportedPresets((prev) => !prev)
              }
              showMyPresets={showMyPresets}
              showReportedPresets={showReportedPresets}
            />
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
                if ((await db.presets.count()).toFixed() === "0") {
                  await fetchPresets();
                } else {
                  setPresets(
                    (await db.presets.orderBy("vendor").toArray()) || []
                  );
                }
                if (
                  (localStorage.getItem("last") || "") >
                  (localStorage.getItem("fetched") || "")
                ) {
                  await fetchPresets();
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
