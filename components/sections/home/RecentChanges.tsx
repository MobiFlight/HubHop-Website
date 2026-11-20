import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { presetUrl, type Sim } from "@/lib/presetUrls"
import { recentChanges } from "@/lib/recentActivity"
import { track } from "@/services/analytics"
import type { Statistics } from "@/interfaces/preset"

type RecentChangesProps = {
  sim: Sim
  // live statistics of the sim; null while loading
  stats: Statistics | null
}

/** "Fresh from the community": the five latest added or updated presets */
const RecentChanges = ({ sim, stats }: RecentChangesProps) => {
  const changes = stats ? recentChanges(stats, 5) : undefined
  return (
    <section
      aria-labelledby="recent-changes"
      className="flex min-w-0 flex-[999_1_560px] flex-col gap-4"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="recent-changes" className="text-3xl font-extrabold">
          Fresh from the community
        </h2>
        <Link
          href="/stats/"
          className="font-semibold text-primary hover:underline"
        >
          All recent changes →
        </Link>
      </div>
      {changes === undefined ? (
        // rows of the same height as the list, so nothing moves when it loads
        <ul
          aria-hidden="true"
          className="divide-y overflow-hidden rounded-2xl border bg-card"
        >
          {Array.from({ length: 5 }, (_, i) => (
            <li key={i} className="px-5 py-4">
              <Skeleton className="h-6 w-full" />
            </li>
          ))}
        </ul>
      ) : changes.length === 0 ? (
        <p className="rounded-2xl border bg-card p-5 text-muted-foreground">
          No recent changes.
        </p>
      ) : (
        <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
          {changes.map(({ kind, preset, by }) => (
            <li
              key={`${kind}-${preset.id}`}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4"
            >
              <Badge
                variant={kind === "added" ? "secondary" : "outline"}
                className={`w-20 uppercase ${kind === "updated" ? "border-primary/40 text-primary" : ""}`}
              >
                {kind === "added" ? "Added" : "Updated"}
              </Badge>
              <Link
                href={presetUrl(sim, preset)}
                onClick={() => track("recent_change_click")}
                className="min-w-0 flex-[1_1_280px] font-semibold hover:text-primary"
              >
                {preset.label}
              </Link>
              <span className="text-sm text-muted-foreground">
                {preset.vendor} · {preset.aircraft} · {preset.system}
              </span>
              <span className="text-sm text-muted-foreground">by {by}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default RecentChanges
