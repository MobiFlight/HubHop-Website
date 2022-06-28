import { BiPlusCircle } from "react-icons/bi";

const AddPresetButton: React.FC = () => {
  return (
    <button className="flex items-center space-x-1 rounded-lg bg-hhOrange px-4 py-1.5 text-sm font-semibold text-hhBG transition-all hover:bg-hhOrangeShade-600">
      <div className="text-lg">
        <BiPlusCircle />
      </div>
      <p>Add preset</p>
    </button>
  );
};

export default AddPresetButton;
