import { AiOutlineLoading } from "react-icons/ai"

const LoadingSpinner: React.FC = () => {
  return (
    <div className="mt-1 flex items-center justify-start">
      <div className="animate-spin text-hhOrange">
        <AiOutlineLoading />
      </div>
    </div>
  )
}

export default LoadingSpinner
