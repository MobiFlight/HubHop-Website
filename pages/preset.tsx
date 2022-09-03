import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsCheck2Square } from "react-icons/bs";
import PresetView from "../components/sections/presets/singlePresetView/PresetView";
import Toast from "../components/sections/Shared/Toast";
import { db } from "../services/db";

const Preset: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [presets, setPresets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [deletedToast, setDeletedToast] = useState(false);
  const [reportedToast, setReportedToast] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [fixedToast, setFixedToast] = useState(false);

  const fetchPresets = async () => {
    const res = await fetch(
      "https://hubhop-api-mgtm.azure-api.net/api/v1/presets"
    );
    const fetchedPresets = await res.json();
    const today = new Date();
    try {
      await db.presets.bulkAdd(fetchedPresets);
    } catch (error) {}
    return (
      localStorage.setItem("fetched", today.toISOString()),
      // sessionStorage.setItem("presets", JSON.stringify(fetchedPresets)),
      setPresets(fetchedPresets),
      console.log("Fetched single preset")
    );
  };

  const fetchHistory = async () => {
    const res = await fetch(
      `https://hubhop-api-mgtm.azure-api.net/api/v1/history/presets/${id}`
    );
    const fetchedHistory = await res.json();
    return setHistory(fetchedHistory[0].history);
  };

  useEffect(() => {
    async function fetchHistoryRoutine() {
      if (!id) {
        return;
      }
      if (db.presets) {
        setLoading(true);
        setPresets((await db.presets.toArray()) || []);
        await fetchHistory();
        setLoading(false);
      } else {
        setLoading(true);
        await fetchPresets();
        await fetchHistory();
        setLoading(false);
      }
    }
    fetchHistoryRoutine();
    return;
  }, [id]);

  useEffect(() => {
    async function getPresetsFromDexie() {
      if (db.presets) {
        setPresets((await db.presets.toArray()) || []);
      }
    }
    getPresetsFromDexie();
    return;
  }, [db.presets]);

  const filterPreset = presets.filter((singlePreset) => {
    if (singlePreset.id === id) {
      return singlePreset;
    }
  });
  function deleteToast() {
    setDeletedToast(true);
    setTimeout(() => {
      setDeletedToast(false);
    }, 5000);
  }
  function reportToast() {
    setReportedToast(true);
    setTimeout(() => {
      setReportedToast(false);
    }, 5000);
  }
  function fixToast() {
    setFixedToast(true);
    setTimeout(() => {
      setFixedToast(false);
    }, 5000);
  }
  function saveToast() {
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
    }, 5000);
  }

  return (
    <>
      <PresetView
        preset={filterPreset}
        history={history}
        loading={loading}
        deletedToast={deleteToast}
        reportedToast={reportToast}
        fixedToast={fixToast}
        savedToast={saveToast}
      />
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
    </>
  );
};

export default Preset;
