const ButtonDark: React.FC = ({ children }) => {
  return (
    <div className="flex items-center space-x-1 rounded-lg bg-hhBG px-4 py-1.5 text-sm font-semibold text-hhText transition-all hover:bg-hhBG/70">
      {children}
    </div>
  );
};

export default ButtonDark;
