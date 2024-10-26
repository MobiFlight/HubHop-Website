import { FiAlertCircle } from "react-icons/fi";

const ReportPresetButton: React.FC = () => {
  return (
    <button className="flex items-center space-x-1 rounded-lg bg-hhBG px-4 py-1.5 text-sm font-semibold transition-all hover:bg-hhBG/70">
      <div className="text-lg">
        <FiAlertCircle />
      </div>
      <div>Report Preset</div>
    </button>
  );
};

export default ReportPresetButton;
