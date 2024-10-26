import Modal from "../../../Shared/Modal";
import FixedPresetButton from "./FixedPresetButton";

interface Props {
  label: string;
  presetId: string;
  setFixedModalOpen: Function;
  fixedToast: Function;
}

const FixedPresetModal: React.FC<Props> = ({
  presetId,
  setFixedModalOpen,
  fixedToast,
}) => {
  return (
    <Modal
      position={"absolute"}
      closeModal={setFixedModalOpen}
      title={"Fixed Preset"}
    >
      <div className="flex flex-col items-center justify-center space-y-3">
        <form className="flex space-x-10">
          <div className="flex flex-col">
            <label htmlFor="reportDescription">
              Describe what you have fixed
            </label>
            <textarea
              className="w-full rounded-lg border border-hhOrange bg-hhBG px-3 py-1 text-hhText"
              name="reportDescription"
              id="reportDescription"
              cols={50}
              rows={4}
              placeholder={
                "Example: Removed old L:var [name] and added new L:var [name]"
              }
            ></textarea>
          </div>
        </form>
        <div className="flex w-full items-center justify-between">
          <button
            onClick={(e) => setFixedModalOpen(e)}
            className="flex items-center space-x-1 rounded-lg bg-hhBG px-4 py-1.5 text-sm font-semibold transition-all hover:bg-hhBG/70"
          >
            Cancel
          </button>
          <div onClick={() => fixedToast()}>
            <FixedPresetButton />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FixedPresetModal;
