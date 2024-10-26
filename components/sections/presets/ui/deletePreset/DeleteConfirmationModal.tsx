import Modal from "../../../Shared/Modal";
import DeleteButton from "./DeleteButton";
import { FiAlertTriangle } from "react-icons/fi";
import { db } from "../../../../../services/db";

interface Props {
  label: string;
  presetId: string;
  setDeleteModalOpen: Function;
  deletedToast: Function;
}

const DeleteConfirmationModal: React.FC<Props> = ({
  label,
  presetId,
  setDeleteModalOpen,
  deletedToast,
}) => {
  function deletePreset() {
    fetch(
      process.env.NEXT_PUBLIC_HUBHOP_API_BASEURL +
        "/" +
        localStorage.getItem("simType") +
        "/presets/" +
        presetId,
      {
        credentials: "include",
        method: "DELETE",
        redirect: "follow",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      }
    ).then(async (res) => {
      if (res.status != 200) {
        alert("Error occured");
      }
      const localStoragePresets =
        localStorage.getItem("simType") === "msfs2020"
          ? (await db.presetsMsfs.toArray()) || []
          : (await db.presetsXplane.toArray()) || [];

      let result = localStoragePresets.filter(
        (item: any) => item.id !== presetId
      );
      try {
        localStorage.getItem("simType") === "msfs2020"
          ? await db.presetsMsfs
              .clear()
              .then(() => db.presetsMsfs.bulkAdd(result))
          : await db.presetsXplane
              .clear()
              .then(() => db.presetsXplane.bulkAdd(result));
      } catch (error) {}
      deletedToast();
    });
  }

  return (
    <Modal
      position={"absolute"}
      closeModal={setDeleteModalOpen}
      title={"Delete Preset"}
    >
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="text-6xl text-red-600">
          <FiAlertTriangle />
        </div>
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex items-center">
            Are you sure you want to delete:
            <div className="ml-2 w-fit rounded-lg bg-hhBG px-1.5 py-0.5">
              {label}
            </div>
          </div>

          <p>This process cannot be undone.</p>
        </div>
        <div className="flex w-full items-center justify-between">
          <button
            onClick={(e) => setDeleteModalOpen(e)}
            className="flex items-center space-x-1 rounded-lg bg-hhBG px-4 py-1.5 text-sm font-semibold transition-all hover:bg-hhBG/70"
          >
            Cancel
          </button>
          <div onClick={() => deletePreset()}>
            <DeleteButton />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
