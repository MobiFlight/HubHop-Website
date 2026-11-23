// Hardware pages: the cockpit hardware brands that MobiFlight profiles on
// flightsim.to are made for (lib/profileHardware.ts).
// /profiles/<sim>/ lists the brands, /profiles/<sim>/<brand>/ lists a brand's
// profiles by product family. Built from the same profile data as the cheat sheets.

import {
  matchProfile,
  toProfile,
  type FlightsimAddon,
  type FlightsimProfile,
  type MatchableAircraft,
} from "@/lib/flightsimProfiles"
import { brandLabel, HARDWARE, hardwareOf } from "@/lib/profileHardware"
import { aircraftUrl } from "@/lib/aircraftPages"
import { simSegment, slugify, type Sim } from "@/lib/presetUrls"
import {
  sponsorOf,
  TIER_ORDER,
  type BrandSponsor,
  type Sponsor,
} from "@/lib/sponsors"

/** Brand pages with fewer profiles aren't indexed */
export const MIN_INDEXED_PROFILES = 3
/** Brand pages show the product sidebar from this many products on */
export const MIN_PRODUCTS_FOR_SIDEBAR = 3

/** The sims with profile pages: flightsim.to's MobiFlight profiles are for MSFS */
export const PROFILE_SIMS: Sim[] = ["msfs2020"]

export const hardwareIndexUrl = (sim: Sim) => `/profiles/${simSegment(sim)}/`
export const brandUrl = (sim: Sim, brandSlug: string) =>
  `/profiles/${simSegment(sim)}/${brandSlug}/`
/** Link preview images, drawn after the build (scripts/ogImages.mjs) */
export const hardwareIndexImageUrl = (sim: Sim) =>
  `/og/profiles/${simSegment(sim)}.jpg`
export const brandImageUrl = (sim: Sim, brandSlug: string) =>
  `/og/profiles/${simSegment(sim)}/${brandSlug}.jpg`

/** A profile with the aircraft it's for, linking to their cheat sheets */
export type HardwareProfile = FlightsimProfile & {
  aircraft: { name: string; url: string }[]
}

/** The profiles of one product family: "PFP" with PFP 3N, PFP 4, PFP 7 */
export type ProductSection = {
  family: string
  slug: string
  // the exact models named in the profiles, most profiles first
  models: string[]
  profiles: HardwareProfile[]
}

export type BrandPage = {
  name: string
  formerly?: string
  slug: string
  profiles: number
  products: ProductSection[]
  // profiles that name the brand but no product
  other: HardwareProfile[]
  // when the brand sponsors MobiFlight
  sponsor?: BrandSponsor
}

/** "PFP (PFP 3N, PFP 4, PFP 7)"; "FCU" when the model is the family */
export const productHeading = ({ family, models }: ProductSection) =>
  models.length === 1 && models[0] === family
    ? family
    : `${family} (${models.join(", ")})`

const byCount = <T>(items: T[], countOf: (item: T) => number) =>
  // stable: equal counts keep their order
  [...items].sort((a, b) => countOf(b) - countOf(a))

/** Every brand with profiles, most profiles first */
export const brandPages = (
  addons: FlightsimAddon[],
  aircraft: MatchableAircraft[],
): BrandPage[] => {
  const names = new Map(
    aircraft.map((entry) => [
      `${entry.vendorSlug}/${entry.aircraftSlug}`,
      entry,
    ]),
  )
  const profiles = [...addons]
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .map((addon) => ({
      hardware: hardwareOf(addon.title),
      profile: {
        ...toProfile(addon),
        aircraft: matchProfile(addon, aircraft).flatMap((key) => {
          const entry = names.get(key)
          return entry
            ? [
                {
                  name: `${entry.vendor} ${entry.aircraft}`,
                  url: aircraftUrl(
                    "msfs2020",
                    entry.vendorSlug,
                    entry.aircraftSlug,
                  ),
                },
              ]
            : []
        }),
      },
    }))

  const pages = HARDWARE.map((brand): BrandPage => {
    const mine = profiles.filter(({ hardware }) =>
      hardware.some((h) => h.brand === brand.name),
    )
    const families = [...new Set(brand.models.map((m) => m.family))].flatMap(
      (family) => {
        const inFamily = mine.filter(({ hardware }) =>
          hardware.some((h) => h.brand === brand.name && h.family === family),
        )
        if (inFamily.length === 0) return []
        const models = byCount(
          [
            ...new Set(
              brand.models
                .filter((m) => m.family === family)
                .map((m) => m.name),
            ),
          ],
          (model) =>
            inFamily.filter(({ hardware }) =>
              hardware.some((h) => h.brand === brand.name && h.model === model),
            ).length,
        ).filter((model) =>
          inFamily.some(({ hardware }) =>
            hardware.some((h) => h.brand === brand.name && h.model === model),
          ),
        )
        return [
          {
            family,
            slug: slugify(family),
            models,
            profiles: inFamily.map(({ profile }) => profile),
          },
        ]
      },
    )
    return {
      name: brand.name,
      ...(brand.formerly ? { formerly: brand.formerly } : {}),
      slug: slugify(brand.name),
      profiles: mine.length,
      products: byCount(families, (section) => section.profiles.length),
      other: mine
        .filter(({ hardware }) =>
          hardware.every((h) => h.brand !== brand.name || !h.model),
        )
        .map(({ profile }) => profile),
    }
  })
  return byCount(
    pages.filter((page) => page.profiles > 0),
    (page) => page.profiles,
  )
}

/** Adds each brand's sponsor entry, if it has one */
export const withSponsors = (
  pages: BrandPage[],
  sponsors: Sponsor[],
): BrandPage[] =>
  pages.map((page) => {
    const sponsor = sponsorOf(page.name, sponsors)
    return sponsor ? { ...page, sponsor } : page
  })

/** Sponsors first, by tier; within a tier and for the others, most profiles first */
export const sponsorsFirst = <
  T extends { profiles: number; sponsor?: BrandSponsor },
>(
  brands: T[],
): { sponsors: T[]; others: T[] } => ({
  sponsors: TIER_ORDER.flatMap((tier) =>
    brands.filter((brand) => brand.sponsor?.tier === tier),
  ),
  others: brands.filter((brand) => !brand.sponsor),
})

export const brandTitle = (brand: BrandPage) =>
  `${brandLabel(brand)} MobiFlight profiles for your home cockpit (MSFS)`

/** Names the products with the most profiles */
export const brandDescription = (brand: BrandPage) => {
  const top = brand.products.slice(0, 3).map((section) => section.family)
  const products = top.length
    ? ` for the ${top.length > 1 ? `${top.slice(0, -1).join(", ")} and ${top.at(-1)}` : top[0]}${brand.products.length > 3 ? " and more" : ""}`
    : ""
  const count = brand.profiles.toLocaleString("en-US")
  return `${count} ready-to-go MobiFlight ${brand.profiles === 1 ? "profile" : "profiles"} for ${brandLabel(brand)} hardware${products}. Find the profile for your aircraft and connect your home cockpit in MSFS.`
}

/** Profiles that name any brand; a profile for several products counts once */
export const profileCount = (pages: BrandPage[]) =>
  new Set(
    pages.flatMap((brand) =>
      [...brand.products.flatMap((p) => p.profiles), ...brand.other].map(
        (profile) => profile.id,
      ),
    ),
  ).size

export const hardwareIndexTitle = () =>
  "MobiFlight profiles that make your hardware plug-and-play | HubHop"

export const hardwareIndexDescription = (brands: number, profiles: number) =>
  `Ready-to-go MobiFlight profiles that make your hardware plug-and-play: ${profiles.toLocaleString("en-US")} profiles for ${brands.toLocaleString("en-US")} brands of controllers and panels, from FCUs and MCDUs to throttles and yokes, in MSFS.`
