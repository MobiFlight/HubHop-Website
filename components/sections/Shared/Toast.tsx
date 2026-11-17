interface Props {
  bg: string
  textColor: string
}

const Toast: React.FC<React.PropsWithChildren<Props>> = ({
  bg,
  children,
  textColor,
}) => {
  return (
    <div
      style={{ backgroundColor: bg, color: textColor }}
      className={`fixed right-5 bottom-5 z-50 rounded-lg p-5 font-semibold`}
    >
      <div className="flex items-center">{children}</div>
    </div>
  )
}

export default Toast
