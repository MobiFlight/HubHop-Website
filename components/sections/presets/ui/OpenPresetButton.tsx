import { MdTabUnselected } from "react-icons/md";
import Link from "next/link";

interface Props {
  id: string;
}

const OpenPresetButton: React.FC<Props> = ({ id }) => {
  return (
    <Link
      href={{
        pathname: `/preset`,
        query: {id: id}
      }}
    >
      <a
        className="flex items-center space-x-1 rounded-lg bg-hhOrange px-4 py-1.5 text-sm font-semibold text-hhBG transition-all hover:bg-hhOrangeShade-600"
        target="_blank"
      >
        <div className="text-lg">
          <MdTabUnselected />
        </div>
        <p>View Details</p>
      </a>
    </Link>
  );
};

export default OpenPresetButton;
