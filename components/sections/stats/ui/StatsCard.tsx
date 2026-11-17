type StatsCardProps = {
  children: React.ReactNode
  title: string
}

const StatsCard = ({ title, children }: StatsCardProps) => {
  return (
    <div className="w-full rounded-lg bg-hhCard/40 p-5 transition-all">
      <p className="font-semibold text-hhOrange">{title}</p>
      {children}
    </div>
  )
}
export default StatsCard
