import { AiOutlineLoading } from "react-icons/ai";

interface Props {
  text: string;
  loading: boolean;
  disabled: boolean;
}

const ExportButton: React.FC<Props> = ({ text, loading, disabled }) => {
  return (
    <div
      className={`relative flex w-full items-center justify-center space-x-1 rounded-lg px-4 py-1.5 text-sm font-semibold transition-all ${
        disabled
          ? "cursor-not-allowed bg-hhBG text-hhText/50"
          : "bg-hhOrange text-hhBG hover:bg-hhOrangeShade-600"
      }`}
    >
      <div
        className={`absolute left-3 mr-2 animate-spin text-lg ${
          loading ? "text-hhBG" : "text-transparent"
        }`}
      >
        <AiOutlineLoading />
      </div>
      <p className="px-5">{text}</p>
    </div>
  );
};

export default ExportButton;
