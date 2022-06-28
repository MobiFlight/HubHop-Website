import { AiOutlineLoading } from "react-icons/ai";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-start mt-1">
      <div className="animate-spin text-hhOrange">
        <AiOutlineLoading />
      </div>
    </div>
  );
};

export default LoadingSpinner;
