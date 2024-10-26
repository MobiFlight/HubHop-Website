interface Props {
  title: string;
}

const StatsCard: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="w-full rounded-lg bg-hhCard/40 p-5 transition-all">
      <p className="font-semibold text-hhOrange">{title}</p>
      {children}
    </div>
  );
};
export default StatsCard;
