type RelevanceGaugeProps = {
  // relevance in percent (0-100)
  value: number
}

// Thin bar gauge with a pointer, in the style of a Garmin engine gauge
const RelevanceGauge = ({ value }: RelevanceGaugeProps) => (
  <div
    role="meter"
    aria-label="Relevance"
    aria-valuenow={value}
    aria-valuemin={0}
    aria-valuemax={100}
    title={`${value}%`}
    className="relative h-2.5 w-20"
  >
    <div className="absolute inset-x-0 top-1.5 h-0.5 bg-foreground/25" />
    <div
      className="absolute top-1.5 left-0 h-0.5 bg-primary"
      style={{ width: `${value}%` }}
    />
    <div
      className="absolute -top-0.5 -translate-x-1/2 border-x-4 border-t-[6px] border-x-transparent border-t-foreground"
      style={{ left: `${value}%` }}
    />
  </div>
)

export default RelevanceGauge
