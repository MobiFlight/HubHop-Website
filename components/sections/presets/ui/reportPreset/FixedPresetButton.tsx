import { GiAutoRepair } from "react-icons/gi";

const FixedPresetButton: React.FC = () => {
  return (
    <button className="flex items-center space-x-1 rounded-lg bg-green-900 px-4 py-1.5 text-sm font-semibold text-hhText transition-all hover:bg-green-800">
      <div className="text-lg">
        <GiAutoRepair />
      </div>
      <p>Preset fixed</p>
    </button>
  );
};

export default FixedPresetButton;
