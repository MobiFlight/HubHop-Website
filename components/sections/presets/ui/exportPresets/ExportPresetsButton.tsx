import { BiDownload } from "react-icons/bi";

const ExportPresetsButton: React.FC = () => {
  return (
    <button className="flex items-center space-x-1 rounded-lg bg-hhOrange px-4 py-1.5 text-sm font-semibold text-hhBG transition-all hover:bg-hhOrangeShade-600">
      <div className="text-lg">
        <BiDownload />
      </div>
      <p>Export presets</p>
    </button>
  );
};

export default ExportPresetsButton;
