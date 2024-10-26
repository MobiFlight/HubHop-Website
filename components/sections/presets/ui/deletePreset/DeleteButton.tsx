import { FiTrash2 } from "react-icons/fi";

const DeleteButton: React.FC = () => {
  return (
    <button className="flex items-center space-x-1 rounded-lg bg-red-800 px-4 py-1.5 text-sm font-semibold transition-all hover:bg-red-700">
      <div className="text-lg">
        <FiTrash2 />
      </div>
      <div>Delete</div>
    </button>
  );
};

export default DeleteButton;
