const ButtonOrange: React.FC = ({ children }) => {
  return (
    <div className="flex items-center space-x-1 rounded-lg bg-hhOrange px-4 py-1.5 text-sm font-semibold text-hhBG transition-all hover:bg-hhOrangeShade-600">
      {children}
    </div>
  );
};

export default ButtonOrange;
