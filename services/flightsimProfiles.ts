// MobiFlight profiles from flightsim.to at build time (getStaticProps).
// scripts/flightsimProfiles.mjs downloads them once before `next build`
// (the token stays on the build server); the pages read that file.
// Without the file, e.g. in `npm run dev`, the cheat sheets have no profiles.

import {
  profilesByAircraft,
  type FlightsimAddon,
  type FlightsimProfile,
  type MatchableAircraft,
} from "@/lib/flightsimProfiles"

/** All downloaded MobiFlight profiles; none when the download is missing */
export const loadProfiles = async (): Promise<FlightsimAddon[]> => {
  const { readFile } = await import("node:fs/promises")
  const { join } = await import("node:path")
  // Playwright sets this, see services/libraryStats.ts
  const testDataDir = process.env.HUBHOP_TEST_DATA_DIR
  const file = testDataDir
    ? join(testDataDir, "flightsim-profiles.testdata.json")
    : join(".build-data", "flightsim-profiles.json")
  try {
    return JSON.parse(await readFile(file, "utf8"))
  } catch {
    return []
  }
}

let matched: Promise<Map<string, FlightsimProfile[]>> | undefined

/**
 * The profiles of one aircraft ("vendor/aircraft" slugs), newest update first.
 * `aircraft` is the full MSFS aircraft list: a profile goes to the aircraft
 * its title fits best.
 */
export const profilesOf = async (
  key: string,
  aircraft: MatchableAircraft[],
): Promise<FlightsimProfile[]> => {
  matched ??= loadProfiles().then((all) => profilesByAircraft(all, aircraft))
  return (await matched).get(key) ?? []
}

/** The number of profiles per aircraft key, for aircraft that have any */
export const profileCounts = async (
  aircraft: MatchableAircraft[],
): Promise<Record<string, number>> => {
  matched ??= loadProfiles().then((all) => profilesByAircraft(all, aircraft))
  return Object.fromEntries(
    [...(await matched)].map(([key, profiles]) => [key, profiles.length]),
  )
}
