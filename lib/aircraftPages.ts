// Aircraft cheat sheets, generated at build time:
//
//   /aircraft/msfs/                      all aircraft of a sim, grouped by maker
//   /aircraft/msfs/fenixsim/a320/        cheat sheet: every system, up to 30 presets each
//   /aircraft/msfs/fenixsim/a320/fcu/    all presets of a system with more than 30
//
// Aircraft and systems are grouped by their slug, like the preset list's URLs:
// spellings that share a slug share a page, named after the most used spelling.
// The presets themselves are shown as stored (#195).

import type { Preset } from "../interfaces/preset"
import { compareText } from "./presetSearch"
import { simSegment, slugify, type Sim } from "./presetUrls"

/** Presets per system on a cheat sheet; larger systems get a page of their own */
export const SYSTEM_PREVIEW = 30

/** Cheat sheets of smaller aircraft exist but aren't indexed by search engines (thin content) */
export const INDEXED_MIN_PRESETS = 10

export const isIndexed = (presets: number) => presets >= INDEXED_MIN_PRESETS

export const aircraftIndexUrl = (sim: Sim, vendorSlug?: string) =>
  `/aircraft/${simSegment(sim)}/${vendorSlug ? `#${vendorSlug}` : ""}`

export const aircraftUrl = (
  sim: Sim,
  vendorSlug: string,
  aircraftSlug: string,
) => `/aircraft/${simSegment(sim)}/${vendorSlug}/${aircraftSlug}/`

export const aircraftSystemUrl = (
  sim: Sim,
  vendorSlug: string,
  aircraftSlug: string,
  systemSlug: string,
) => `${aircraftUrl(sim, vendorSlug, aircraftSlug)}${systemSlug}/`

export type SheetPreset = Pick<Preset, "id" | "label" | "code" | "author">

export type AircraftSummary = {
  vendor: string
  vendorSlug: string
  aircraft: string
  aircraftSlug: string
  presets: number
}

export type SystemSheet = {
  name: string
  slug: string
  total: number
  inputCount: number
  outputCount: number
  // up to SYSTEM_PREVIEW on a cheat sheet, all on a system page
  inputs: SheetPreset[]
  outputs: SheetPreset[]
}

export type Contributor = { name: string; presets: number }

export type AircraftSheet = AircraftSummary & {
  // ISO date of the newest change
  lastChange: string | null
  topContributors: Contributor[]
  systems: SystemSheet[]
}

type SheetSource = Pick<
  Preset,
  | "id"
  | "vendor"
  | "aircraft"
  | "system"
  | "label"
  | "code"
  | "author"
  | "presetType"
  | "createdDate"
>

/** The most used of the spellings (first one on a tie) */
const mostUsed = (names: string[]): string => {
  const counts = new Map<string, number>()
  for (const name of names) counts.set(name, (counts.get(name) ?? 0) + 1)
  return [...counts].reduce((best, entry) =>
    entry[1] > best[1] ? entry : best,
  )[0]
}

const groupBy = <T>(items: T[], key: (item: T) => string): Map<string, T[]> => {
  const groups = new Map<string, T[]>()
  for (const item of items) {
    const k = key(item)
    const group = groups.get(k)
    if (group) group.push(item)
    else groups.set(k, [item])
  }
  return groups
}

const aircraftKey = (preset: Pick<Preset, "vendor" | "aircraft">) =>
  `${slugify(preset.vendor)}/${slugify(preset.aircraft)}`

const summaryOf = (presets: SheetSource[]): AircraftSummary => {
  const vendor = mostUsed(presets.map((preset) => preset.vendor))
  const aircraft = mostUsed(presets.map((preset) => preset.aircraft))
  return {
    vendor,
    vendorSlug: slugify(vendor),
    aircraft,
    aircraftSlug: slugify(aircraft),
    presets: presets.length,
  }
}

/** Every aircraft of a sim, by maker and name */
export const aircraftList = (presets: SheetSource[]): AircraftSummary[] =>
  [...groupBy(presets, aircraftKey).values()]
    .map(summaryOf)
    .sort(
      (a, b) =>
        compareText(a.vendor, b.vendor) || compareText(a.aircraft, b.aircraft),
    )

/** The aircraft of each maker, by vendor slug, in the list's order */
export const byMaker = (
  aircraft: AircraftSummary[],
): Map<string, AircraftSummary[]> =>
  groupBy(aircraft, (entry) => entry.vendorSlug)

export const presetsOfAircraft = <T extends SheetSource>(
  presets: T[],
  vendorSlug: string,
  aircraftSlug: string,
): T[] =>
  presets.filter(
    (preset) => aircraftKey(preset) === `${vendorSlug}/${aircraftSlug}`,
  )

/**
 * Which inputs and outputs of a system fit into `limit` rows: half each, and
 * what one side doesn't need goes to the other.
 */
export const previewCounts = (
  inputs: number,
  outputs: number,
  limit: number,
): { inputs: number; outputs: number } => {
  if (inputs + outputs <= limit) return { inputs, outputs }
  const half = Math.ceil(limit / 2)
  const shownInputs = Math.min(inputs, Math.max(half, limit - outputs))
  return {
    inputs: shownInputs,
    outputs: Math.min(outputs, limit - shownInputs),
  }
}

const sheetPreset = ({
  id,
  label,
  code,
  author,
}: SheetSource): SheetPreset => ({
  id,
  label,
  code,
  author,
})

const byLabel = (a: SheetSource, b: SheetSource) =>
  compareText(a.label, b.label)

const systemSheet = (presets: SheetSource[], limit: number): SystemSheet => {
  const name = mostUsed(presets.map((preset) => preset.system))
  const outputs = presets
    .filter((preset) => preset.presetType === "Output")
    .sort(byLabel)
  // inputs, potentiometers and X-Plane's InputOutput: what you press or turn
  const inputs = presets
    .filter((preset) => preset.presetType !== "Output")
    .sort(byLabel)
  const shown = previewCounts(inputs.length, outputs.length, limit)
  return {
    name,
    slug: slugify(name),
    total: presets.length,
    inputCount: inputs.length,
    outputCount: outputs.length,
    inputs: inputs.slice(0, shown.inputs).map(sheetPreset),
    outputs: outputs.slice(0, shown.outputs).map(sheetPreset),
  }
}

/** The systems of an aircraft by name, each with up to `limit` presets */
export const systemSheets = (
  presets: SheetSource[],
  limit = SYSTEM_PREVIEW,
): SystemSheet[] =>
  [...groupBy(presets, (preset) => slugify(preset.system)).values()]
    .map((group) => systemSheet(group, limit))
    .sort((a, b) => compareText(a.name, b.name))

/** The cheat sheet of an aircraft, from its presets */
export const aircraftSheet = (presets: SheetSource[]): AircraftSheet => {
  const authors = new Map<string, number>()
  for (const { author } of presets)
    if (author) authors.set(author, (authors.get(author) ?? 0) + 1)
  const dates = presets
    .map((preset) => preset.createdDate)
    .filter((date): date is string => Boolean(date))
    .sort()
  return {
    ...summaryOf(presets),
    lastChange: dates.at(-1) ?? null,
    topContributors: [...authors]
      .map(([name, count]) => ({ name, presets: count }))
      .sort((a, b) => b.presets - a.presets || compareText(a.name, b.name))
      .slice(0, 3),
    systems: systemSheets(presets),
  }
}

/** The systems that get a page of their own */
export const largeSystems = (presets: SheetSource[]): string[] =>
  [...groupBy(presets, (preset) => slugify(preset.system))]
    .filter(([, group]) => group.length > SYSTEM_PREVIEW)
    .map(([slug]) => slug)

export const SIM_NAMES: Record<Sim, string> = {
  msfs2020: "MSFS",
  xplane: "X-Plane",
}

/** "19 Nov 2026"; the same on the build server and in every browser */
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
