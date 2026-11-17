import { MdTabUnselected } from "react-icons/md"
import Link from "next/link"

type OpenPresetButtonProps = {
  id: string
}

const OpenPresetButton = ({ id }: OpenPresetButtonProps) => {
  return (
    <Link
      legacyBehavior
      href={{
        pathname: `/preset`,
        query: { simType: localStorage.getItem("simType"), id: id },
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
  )
}

export default OpenPresetButton
