// Numbers about the whole preset library, computed at build time in
// getStaticProps (the statistics endpoint doesn't have them yet, #183).
// Server only: the homepage itself never downloads the full preset list.

import type { Preset } from "../interfaces/preset"
import { SIMS, slugify, type Sim } from "../lib/presetUrls"

export type VendorCount = {
  name: string
  slug: string
  presets: number
}

export type SimLibraryStats = {
  presets: number
  // authors and those who updated a preset
  contributors: number
  // the vendors with the most presets
  topVendors: VendorCount[]
  vendorCount: number
}

const TOP_VENDORS = 7

export type LibraryStats = Record<Sim, SimLibraryStats>

type Contribution = Pick<Preset, "author" | "updatedBy" | "vendor">

// counted as stored: different spellings of a vendor are separate entries,
// so data problems stay visible (#188)
const vendorCounts = (presets: Contribution[]): VendorCount[] => {
  const counts = new Map<string, number>()
  for (const { vendor } of presets)
    counts.set(vendor, (counts.get(vendor) ?? 0) + 1)
  return [...counts].map(([name, count]) => ({
    name,
    slug: slugify(name),
    presets: count,
  }))
}

export const libraryStatsOf = (presets: Contribution[]): SimLibraryStats => {
  const vendors = vendorCounts(presets)
  return {
    presets: presets.length,
    contributors: new Set(
      presets
        .flatMap(({ author, updatedBy }) => [author, updatedBy])
        .filter(Boolean),
    ).size,
    topVendors: vendors
      .sort((a, b) => b.presets - a.presets)
      .slice(0, TOP_VENDORS),
    vendorCount: vendors.length,
  }
}

// Playwright sets this: getStaticProps runs in the dev server, where the
// browser's request mocks can't reach, so tests read the test data instead.
const TEST_DATA_DIR = process.env.HUBHOP_TEST_DATA_DIR

const testDataFile: Record<Sim, string> = {
  msfs2020: "msfs-presets.testdata.json",
  xplane: "xplane-presets.testdata.json",
}

const loadPresets = async (sim: Sim): Promise<Contribution[]> => {
  if (TEST_DATA_DIR) {
    const { readFile } = await import("node:fs/promises")
    const { join } = await import("node:path")
    return JSON.parse(
      await readFile(join(TEST_DATA_DIR, testDataFile[sim]), "utf8"),
    )
  }
  const url = `${process.env.NEXT_PUBLIC_HUBHOP_API_BASEURL}/${sim}/presets`
  const res = await fetch(url, { redirect: "follow" })
  // no fallback: without the numbers the build fails and nothing is deployed
  if (!res.ok) throw new Error(`Loading ${url} failed: ${res.status}`)
  return res.json()
}

export const loadLibraryStats = async (): Promise<LibraryStats> => {
  const [msfs2020, xplane] = await Promise.all(SIMS.map(loadPresets))
  return { msfs2020: libraryStatsOf(msfs2020), xplane: libraryStatsOf(xplane) }
}
