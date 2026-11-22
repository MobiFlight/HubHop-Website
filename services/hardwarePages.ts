// The hardware pages' data at build time (getStaticPaths / getStaticProps):
// the MobiFlight profiles matched to the MSFS aircraft, by brand.

import { aircraftList } from "@/lib/aircraftPages"
import { brandPages, type BrandPage } from "@/lib/hardwarePages"
import { loadProfiles } from "@/services/flightsimProfiles"
import { loadPresets } from "@/services/libraryStats"

let pages: Promise<BrandPage[]> | undefined

/** Every brand with profiles, most profiles first; computed once per build worker */
export const loadBrandPages = (): Promise<BrandPage[]> => {
  pages ??= (async () =>
    brandPages(
      await loadProfiles(),
      aircraftList(await loadPresets("msfs2020")),
    ))()
  return pages
}
