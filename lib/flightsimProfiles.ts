// MobiFlight profiles on flightsim.to, shown on the aircraft cheat sheets.
// Profiles are matched to our aircraft by their title (and flightsim.to's
// "affiliation", the aircraft they're for, where set): the title has to name
// the maker and the aircraft model. Matching runs at build time only.

/** A MobiFlight profile as the cheat sheets show it */
export type FlightsimProfile = {
  id: number
  title: string
  link: string
  thumbnail: string | null
  author: string
  // 0 = no ratings yet
  rating: number
  updatedAt: string
}

/** The fields of flightsim.to's addon search that we use */
export type FlightsimAddon = {
  id: number
  title: string
  link: string
  thumbnail?: string | null
  author?: { name?: string } | null
  rating?: number
  updated_at: string
  affiliation?: { name?: string } | null
}

export type MatchableAircraft = {
  vendor: string
  vendorSlug: string
  aircraft: string
  aircraftSlug: string
}

/** Profiles shown before "Show all" */
export const PROFILE_PREVIEW = 6
/** Anchor of the profiles section on a cheat sheet */
export const PROFILES_ANCHOR = "mobiflight-profiles"

// words that say nothing about the maker or the aircraft
const GENERIC = new Set(
  "simulations simulation sim sims studio studios design software the and x 2020 2024 dev sdk msfs pro professional edition aircraft classic by for mobiflight profile profiles fs 2 3".split(
    " ",
  ),
)

// what people write instead of the maker's name, by our vendor slug
const VENDOR_ALIASES: Record<string, string[]> = {
  "fly-by-wire": ["fbw", "flybywire"],
  "flight-sim-labs": ["fslabs", "fsl", "flightsimlabs"],
  microsoft: ["asobo", "default", "stock"],
  fenixsim: ["fenix"],
  inibuilds: ["ini"],
  "flightsim-studio-fss": ["fss", "flightsimstudio"],
  "bluebird-simulations": ["bluebird"],
  "just-flight": ["justflight", "jf"],
  "black-square": ["blacksquare"],
  "headwind-simulations": ["headwind"],
  "horizon-simulations": ["horizon"],
  "hype-performance-group": ["hpg"],
  "working-title": ["wt"],
}

// nicknames that name one aircraft on their own, by "vendor/aircraft" slug
const AIRCRAFT_ALIASES: Record<string, string[]> = {
  "fly-by-wire/a320": ["a32nx", "a20n"],
  "aerosoft/crj-550-700-1000": ["crj"],
  "leonardo/maddog-md-82": ["maddog"],
  "synaptic/a22x": ["a220"],
  "headwind-simulations/a330-900neo": ["a339"],
}

// profiles the title rules get wrong, by flightsim.to id: the right aircraft
const OVERRIDES: Record<number, string[]> = {
  // "PMDG 737 & 777 …": both aircraft
  110267: ["pmdg/b737-700", "pmdg/b737-800-2024", "pmdg/b777-300er"],
  92878: ["pmdg/b737-700", "pmdg/b737-800-2024", "pmdg/b777-300er"],
}

/** Words and model numbers in order: "Boeing 737-800" → b737, 737, 800, … */
export const words = (text: string): string[] => {
  const normalized = text
    .toLowerCase()
    .replace(/boeing/g, "b ")
    .replace(/airbus/g, "a ")
    .replace(/md-/g, "md")
    .replace(/-/g, " ")
  return (normalized.match(/[a-z0-9]+/g) ?? []).flatMap((word) => {
    const parts = word.match(/[a-z]+|\d+/g) ?? []
    // letters before a number belong to the model: b737, a320, md11
    const joined = parts.flatMap((part, i) =>
      /^\d+$/.test(parts[i + 1] ?? "") ? [part + parts[i + 1]] : [],
    )
    return [word, ...parts, ...joined]
  })
}

const keyOf = (aircraft: MatchableAircraft) =>
  `${aircraft.vendorSlug}/${aircraft.aircraftSlug}`

type Candidate = { key: string; score: number; position: number }

const candidates = (
  title: string[],
  aircraft: MatchableAircraft[],
): Candidate[] => {
  const present = new Set(title)
  const position = (hits: string[]) =>
    Math.min(...hits.map((hit) => title.indexOf(hit)))
  return aircraft.flatMap((entry) => {
    const key = keyOf(entry)
    const aliases = (AIRCRAFT_ALIASES[key] ?? []).filter((a) => present.has(a))
    if (aliases.length > 0)
      return [{ key, score: Infinity, position: position(aliases) }]
    const vendorWords = new Set(
      [...words(entry.vendor), ...(VENDOR_ALIASES[entry.vendorSlug] ?? [])]
        // single letters and digits would be found in almost any title
        .filter((w) => !GENERIC.has(w) && w.length > 1),
    )
    // the maker has to be named, otherwise "Hawker 800XP" finds a 737-800
    if (![...vendorWords].some((w) => present.has(w))) return []
    const aircraftWords = new Set(
      words(entry.aircraft).filter((w) => !GENERIC.has(w)),
    )
    const hits = [...aircraftWords].filter((w) => present.has(w))
    const numbers = [...aircraftWords].filter((w) => /^\d{2,}$/.test(w))
    // the model number has to be there: an A320 profile isn't for the A321
    if (numbers.length > 0 && !numbers.some((n) => present.has(n))) return []
    if (!hits.some((w) => w.length > 1 || /\d/.test(w))) return []
    return [
      {
        key,
        score: hits.length / aircraftWords.size,
        position: position(hits),
      },
    ]
  })
}

/** The aircraft keys ("vendor/aircraft" slugs) a profile is for, if any */
export const matchProfile = (
  addon: Pick<FlightsimAddon, "id" | "title" | "affiliation">,
  aircraft: MatchableAircraft[],
): string[] => {
  const override = OVERRIDES[addon.id]
  if (override) return override
  const title = words(`${addon.title} ${addon.affiliation?.name ?? ""}`)
  const found = candidates(title, aircraft)
  const best = Math.max(...found.map((c) => c.score))
  const top = found.filter((c) => c.score === best)
  // two aircraft of the maker named: the first one is the profile's aircraft,
  // the other is often hardware ("A330 … with an A320 pedestal")
  const first = Math.min(...top.map((c) => c.position))
  return top.filter((c) => c.position === first).map((c) => c.key)
}

/** The fields we show, newest update first */
export const toProfile = (addon: FlightsimAddon): FlightsimProfile => ({
  id: addon.id,
  title: addon.title,
  link: addon.link,
  thumbnail: addon.thumbnail ?? null,
  author: addon.author?.name ?? "",
  rating: addon.rating ?? 0,
  updatedAt: addon.updated_at,
})

/** Profiles per aircraft key, newest update first */
export const profilesByAircraft = (
  addons: FlightsimAddon[],
  aircraft: MatchableAircraft[],
): Map<string, FlightsimProfile[]> => {
  const result = new Map<string, FlightsimProfile[]>()
  for (const addon of addons)
    for (const key of matchProfile(addon, aircraft))
      result.set(key, [...(result.get(key) ?? []), toProfile(addon)])
  for (const profiles of result.values())
    profiles.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  return result
}
