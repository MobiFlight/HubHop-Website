const UserDropdown: React.FC = ({ children }) => {
  return (
    <div className="absolute z-50">
      <div>
        <div
          className="mt-8 rounded-lg bg-hhCard/50 backdrop-blur"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-10 py-5">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;
