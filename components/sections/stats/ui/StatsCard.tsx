import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type StatsCardProps = {
  children: React.ReactNode
  title: string
}

const StatsCard = ({ title, children }: StatsCardProps) => {
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className="text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
export default StatsCard
