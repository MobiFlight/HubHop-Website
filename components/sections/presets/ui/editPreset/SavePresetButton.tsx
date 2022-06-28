import { AiOutlineLoading } from "react-icons/ai";
import { MdDone } from "react-icons/md";

interface Props {
  disabled: boolean;
}

const SavePresetButton: React.FC<Props> = ({ disabled }) => {
  return (
    <button
      disabled={disabled}
      className={`flex w-full items-center justify-center space-x-1 rounded-lg bg-hhOrange px-4 py-1.5 text-sm font-semibold ${
        disabled ? "text-hhCard" : "text-hhBG"
      } transition-all hover:bg-hhOrangeShade-600 xl:w-fit`}
    >
      {disabled ? (
        <div className="mr-2 animate-spin text-hhCard">
          <AiOutlineLoading />
        </div>
      ) : (
        <div className="text-lg">
          <MdDone />
        </div>
      )}
      <p>Save</p>
    </button>
  );
};

export default SavePresetButton;
