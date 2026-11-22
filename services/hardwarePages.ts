// The hardware pages' data at build time (getStaticPaths / getStaticProps):
// the MobiFlight profiles matched to the MSFS aircraft, by brand, with
// the brands' sponsor entries.

import { aircraftList } from "@/lib/aircraftPages"
import { brandPages, withSponsors, type BrandPage } from "@/lib/hardwarePages"
import type { Sponsor } from "@/lib/sponsors"
import { loadProfiles } from "@/services/flightsimProfiles"
import { loadPresets } from "@/services/libraryStats"

/** MobiFlight's sponsors, downloaded by scripts/sponsors.mjs; none when missing */
const loadSponsors = async (): Promise<Sponsor[]> => {
  const { readFile } = await import("node:fs/promises")
  const { join } = await import("node:path")
  // Playwright sets this, see services/libraryStats.ts
  const testDataDir = process.env.HUBHOP_TEST_DATA_DIR
  const file = testDataDir
    ? join(testDataDir, "mobiflight-website-sponsors.testdata.json")
    : join(".build-data", "sponsors.json")
  try {
    return JSON.parse(await readFile(file, "utf8"))
  } catch {
    return []
  }
}

let pages: Promise<BrandPage[]> | undefined

/** Every brand with profiles, most profiles first; computed once per build worker */
export const loadBrandPages = (): Promise<BrandPage[]> => {
  pages ??= (async () =>
    withSponsors(
      brandPages(
        await loadProfiles(),
        aircraftList(await loadPresets("msfs2020")),
      ),
      await loadSponsors(),
    ))()
  return pages
}
