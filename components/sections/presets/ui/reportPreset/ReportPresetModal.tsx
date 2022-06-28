import Modal from "../../../Shared/Modal";
import ReportPresetButton from "./ReportPresetButton";

interface Props {
  label: string;
  presetId: string;
  setReportModalOpen: Function;
  reportedToast: Function;
}

const ReportPresetModal: React.FC<Props> = ({
  presetId,
  setReportModalOpen,
  reportedToast,
}) => {
  return (
    <Modal
      position={"absolute"}
      closeModal={setReportModalOpen}
      title={"Report Preset"}
    >
      <div className="flex flex-col items-center justify-center space-y-3">
        <form className="flex space-x-10">
          <div className="flex flex-col">
            <label htmlFor="reportCategory">Category</label>
            <select
              className="w-full rounded-lg border border-hhOrange bg-hhBG px-3 py-1 text-hhText"
              id="reportCategory"
              defaultValue={""}
            >
              <option value="" disabled>
                Pick an option
              </option>
              <option value="simUpdate">Not working since Sim update</option>
              <option value="badCode">Bad code</option>
              <option value="misleadingName">Misleading Name</option>
              <option value="duplicate">Duplicate</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="reportDescription">Describe your report</label>
            <textarea
              className="w-full rounded-lg border border-hhOrange bg-hhBG px-3 py-1 text-hhText"
              name="reportDescription"
              id="reportDescription"
              cols={50}
              rows={4}
              placeholder={
                "Example: The preset does not work with the version 0.1.2.3 of the aircraft XYC"
              }
            ></textarea>
          </div>
        </form>
        <div className="flex w-full items-center justify-between">
          <button
            onClick={(e) => setReportModalOpen(e)}
            className="flex items-center space-x-1 rounded-lg bg-hhBG px-4 py-1.5 text-sm font-semibold transition-all hover:bg-hhBG/70"
          >
            Cancel
          </button>
          <div onClick={() => reportedToast()}>
            <ReportPresetButton />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReportPresetModal;
