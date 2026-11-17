import { BiLockAlt, BiLockOpenAlt } from "react-icons/bi"
import { motion } from "motion/react"

interface Props {
  toggleEdit: boolean
  setEdit: Function
}

const EditToggle: React.FC<Props> = ({ toggleEdit, setEdit }) => {
  return (
    <button
      onClick={(e) => setEdit(e)}
      className={`relative flex items-center rounded-lg text-lg font-semibold xl:h-full ${
        toggleEdit ? "bg-hhCard" : "bg-hhBG"
      }`}
    >
      <motion.div
        animate={toggleEdit ? { x: 50 } : { x: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="absolute hidden h-full w-1/2 items-center justify-center rounded-lg bg-hhOrange text-xs text-hhBG hover:bg-hhOrangeShade-600 xl:flex"
      >
        <div>{toggleEdit ? "Edit" : "View"}</div>
      </motion.div>
      <motion.div
        animate={toggleEdit ? { x: 59 } : { x: -3 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="absolute flex h-full w-1/2 items-center justify-center rounded-lg bg-hhOrange text-xs text-hhBG hover:bg-hhOrangeShade-600 xl:hidden"
      >
        <div>{toggleEdit ? "Edit" : "View"}</div>
      </motion.div>
      <div className="ml-1 hidden items-center space-x-2 px-4 py-1.5 xl:flex">
        <BiLockAlt />
        <div className="w-2"></div>
        <BiLockOpenAlt />
      </div>
      <div className="ml-1 flex items-center space-x-2 px-4 py-1.5 xl:hidden">
        <BiLockAlt />
        <div className="w-8"></div>
        <BiLockOpenAlt />
      </div>
    </button>
  )
}

export default EditToggle
