import type { Statistics, StatisticsPreset } from "@/interfaces/preset"

export type RecentChange = {
  kind: "added" | "updated"
  preset: StatisticsPreset & { id: string }
  by: string
  date: string
}

/** The latest added and updated presets, newest first */
export const recentChanges = (
  stats: Pick<Statistics, "presetsAdded" | "presetsUpdated">,
  count: number,
): RecentChange[] =>
  [
    ...stats.presetsAdded.map((preset) => ({
      kind: "added" as const,
      preset,
      by: preset.author,
    })),
    ...stats.presetsUpdated.map((preset) => ({
      kind: "updated" as const,
      preset,
      by: preset.updatedBy ?? preset.author,
    })),
  ]
    .map(({ preset, ...change }) => ({
      ...change,
      preset: { ...preset, id: preset._id ?? preset.id },
      date: preset.createdDate ?? "",
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, count)

export type TodaysActivity = {
  count: number
  vendor: string
  aircraft: string
}

const localDay = (date: Date) => date.toDateString()

/** The aircraft that got the most new presets today, or undefined if none */
export const todaysActivity = (
  presetsAdded: StatisticsPreset[],
  now: Date = new Date(),
): TodaysActivity | undefined => {
  const counts = new Map<string, TodaysActivity>()
  for (const { vendor, aircraft, createdDate } of presetsAdded) {
    if (!createdDate || localDay(new Date(createdDate)) !== localDay(now))
      continue
    const key = `${vendor}\n${aircraft}`
    const current = counts.get(key) ?? { count: 0, vendor, aircraft }
    counts.set(key, { ...current, count: current.count + 1 })
  }
  return [...counts.values()].sort((a, b) => b.count - a.count)[0]
}
