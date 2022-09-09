import { FiX } from "react-icons/fi";

interface Props {
  title: string;
  closeModal: Function;
  position: string;
  closeModalX?: any;
  height?: boolean;
}

const Modal: React.FC<Props> = ({
  children,
  title,
  closeModal,
  position,
  closeModalX,
  height,
}) => {
  return (
    <div>
      <div
        onClick={(e) => closeModal(e)}
        className={`${
          position === "absolute" ? "absolute" : "fixed"
        } top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/60 backdrop-blur-sm`}
      >
        <div
          className={`mx-auto flex flex-col rounded-lg bg-hhCard ${
            height ? "min-h-[50vh]" : "h-fit"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between rounded-t-lg bg-hhBG/50 px-5 py-2">
            <h3 className="text-2xl">{title}</h3>
            <button
              onClick={(e) => closeModalX(e)}
              className="flex items-center space-x-1 rounded-lg py-1.5 text-sm font-semibold"
            >
              <div className="text-lg">
                <FiX />
              </div>
            </button>
          </div>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
