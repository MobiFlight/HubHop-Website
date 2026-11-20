// URLs of the preset list and of single presets (#181):
//
//   /presets/msfs/                                    all presets of a sim
//   /presets/msfs/fenixsim/                           presets of a vendor
//   /presets/msfs/fenixsim/a320/                      presets of an aircraft
//   /presets/msfs/fenixsim/a320/apu-master-on-<id>/   one preset
//
// Search and the other filters are query parameters. An aircraft without a
// vendor is a query parameter too, because the path needs the vendor first.
// URLs call MSFS "msfs": MSFS 2020 and 2024 share one library, which the API
// calls "msfs2020". Links from before use "msfs2020" and are moved.

export const SIMS = ["msfs2020", "xplane"] as const
export type Sim = (typeof SIMS)[number]

export const isSim = (value: unknown): value is Sim =>
  SIMS.includes(value as Sim)

const SIM_SEGMENTS: Record<Sim, string> = { msfs2020: "msfs", xplane: "xplane" }

/** The sim's part of a URL: "msfs" or "xplane" */
export const simSegment = (sim: Sim): string => SIM_SEGMENTS[sim]

const simFromSegment = (segment: string): Sim | undefined =>
  SIMS.find((sim) => SIM_SEGMENTS[sim] === segment)

const slugs = new Map<string, string>()

/** "Fly By Wire" → "fly-by-wire", "A350 (2020)" → "a350-2020"; cached, it runs per preset */
export const slugify = (text: string): string => {
  const cached = slugs.get(text)
  if (cached !== undefined) return cached
  const slug =
    text
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "-"
  slugs.set(text, slug)
  return slug
}

/** Filters of the preset list; vendor and aircraft are slugs */
export type PresetListFilters = {
  sim: Sim
  vendor?: string
  aircraft?: string
  search?: string
  system?: string
  presetType?: string
  codeType?: string
}

const QUERY_FILTERS = ["search", "system", "presetType", "codeType"] as const

export const presetListUrl = ({
  sim,
  vendor,
  aircraft,
  ...filters
}: PresetListFilters): string => {
  const segments = [simSegment(sim), vendor, vendor && aircraft].filter(Boolean)
  const params = new URLSearchParams()
  if (aircraft && !vendor) params.set("aircraft", aircraft)
  for (const key of QUERY_FILTERS) {
    const value = filters[key]
    if (value) params.set(key, value)
  }
  const query = params.toString()
  return `/presets/${segments.join("/")}/${query ? `?${query}` : ""}`
}

type PresetUrlFields = {
  id: string
  vendor: string
  aircraft: string
  label: string
}

export const presetUrl = (sim: Sim, preset: PresetUrlFields): string =>
  `/presets/${simSegment(sim)}/${slugify(preset.vendor)}/${slugify(preset.aircraft)}/${slugify(preset.label)}-${preset.id}/`

// UUIDs and the MongoDB ids of older presets
const PRESET_ID =
  /(?:^|-)([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[0-9a-f]{24})$/

export type PresetsRoute =
  | { kind: "default" }
  | { kind: "unknownSim"; sim: string }
  | { kind: "moved"; path: string }
  | { kind: "list"; sim: Sim; vendor?: string; aircraft?: string }
  | { kind: "preset"; sim: Sim; id: string }
  | { kind: "notFound" }

/** What the path segments after /presets/ point to */
export const parsePresetsPath = (segments: string[]): PresetsRoute => {
  const [segment, vendor, aircraft, preset, ...rest] = segments
  if (!segment) return { kind: "default" }
  if (segment === "msfs2020")
    return {
      kind: "moved",
      path: `/presets/${["msfs", ...segments.slice(1)].join("/")}/`,
    }
  const sim = simFromSegment(segment)
  if (!sim) return { kind: "unknownSim", sim: segment }
  if (rest.length > 0) return { kind: "notFound" }
  if (preset) {
    const id = PRESET_ID.exec(preset)?.[1]
    return id ? { kind: "preset", sim, id } : { kind: "notFound" }
  }
  return { kind: "list", sim, vendor, aircraft }
}
