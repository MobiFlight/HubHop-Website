const background = {
  success: "bg-green-800",
  error: "bg-red-900",
}

interface Props {
  variant: keyof typeof background
}

const Toast: React.FC<React.PropsWithChildren<Props>> = ({
  variant,
  children,
}) => {
  return (
    <div
      role="status"
      className={`fixed right-5 bottom-5 z-50 rounded-lg p-5 font-semibold ${background[variant]}`}
    >
      <div className="flex items-center">{children}</div>
    </div>
  )
}

export default Toast
