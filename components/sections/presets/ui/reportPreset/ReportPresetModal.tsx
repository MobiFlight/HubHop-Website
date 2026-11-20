import { toast } from "sonner"
import Modal from "../../../Shared/Modal"
import ReportPresetButton from "./ReportPresetButton"

type ReportPresetModalProps = {
  label: string
  presetId: string
  onClose: () => void
}

const ReportPresetModal = ({ onClose }: ReportPresetModalProps) => {
  return (
    <Modal onClose={onClose} title={"Report Preset"}>
      <div className="flex flex-col items-center justify-center space-y-3">
        <form className="flex space-x-10">
          <div className="flex flex-col">
            <label htmlFor="reportCategory">Category</label>
            <select
              className="w-full rounded-lg border border-primary bg-background px-3 py-1 text-foreground"
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
              className="w-full rounded-lg border border-primary bg-background px-3 py-1 text-foreground"
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
            onClick={onClose}
            className="flex items-center space-x-1 rounded-lg bg-background px-4 py-1.5 text-sm font-semibold transition-all hover:bg-background/70"
          >
            Cancel
          </button>
          <div onClick={() => toast.success("Preset successfully reported!")}>
            <ReportPresetButton />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ReportPresetModal
