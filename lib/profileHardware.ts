// The cockpit hardware a MobiFlight profile on flightsim.to is made for, read
// from its title: "Fenix A320 | WINCTRL FCU + EFIS L | MobiFlight Profile".
// A model counts only with its brand ("WINCTRL FCU"); several brands make an
// FCU or an RMP. Model names only one brand uses count on their own ("PAP3").

export type HardwareModel = {
  // the exact model, as it's sold: "PFP 3N", "32 AGP Metal"
  name: string
  // the model without variants and editions: "PFP", "AGP"
  family: string
  pattern: RegExp
  // the name belongs to this brand only, so it identifies the brand too
  unique?: boolean
}

export type HardwareBrand = {
  name: string
  // shown with the name while people still search for the old one
  formerly?: string
  pattern: RegExp
  models: HardwareModel[]
}

const model = (
  name: string,
  family: string,
  pattern: RegExp,
  unique = false,
): HardwareModel => ({ name, family, pattern, unique })

export const HARDWARE: HardwareBrand[] = [
  {
    name: "WINCTRL",
    formerly: "WinWing",
    // also "WINCRTL", "WinWingSim", "WinwingPFP7"
    pattern: /\b(winctrl|wincrtl|winwing|winwin)/,
    models: [
      model("URSA MINOR 32 Throttle Metal", "URSA MINOR", /\bthrottle metal\b/),
      model("URSA MINOR 32 Throttle", "URSA MINOR", /\bursa minor\b/, true),
      model("32 AGP Metal", "AGP", /\b(32 )?agp metal\b/),
      model("32 AGP", "AGP", /\b(32 )?agp\b/),
      model("32 PAC Metal", "PAC", /\b(32 )?pac metal\b/),
      model("32 PAC", "PAC", /\b(32 )?pac\b/),
      model("32 ECAM", "ECAM", /\b(32 )?ecam\b/),
      model("PAP3", "PAP", /pap ?-?3\b/, true),
      model("PFP 3N", "PFP", /pfp ?-?3n\b/, true),
      model("PFP 3", "PFP", /pfp ?-?3\b/, true),
      model("PFP 4", "PFP", /pfp ?-?4\b/, true),
      model("PFP 7", "PFP", /pfp ?-?7\b/, true),
      model("PFP", "PFP", /pfp\b/, true),
      model("PDC 3N", "PDC", /\b(pdc ?-?3n|3n pdc)\b/, true),
      model("PDC 3M", "PDC", /\b(pdc ?-?3m|3m pdc)\b/, true),
      model("PDC", "PDC", /\bpdc ?3?\b/, true),
      model("EFIS L", "EFIS", /\b(efis ?-?l|l ?-?efis)\b/),
      model("EFIS R", "EFIS", /\b(efis ?-?(l )?r|r ?-?efis)\b/),
      model("EFIS", "EFIS", /\befis\b/),
      model("FCU", "FCU", /\bfcu\b/),
      model("MCDU", "MCDU", /\b(mcdu|mdcu)\b/),
      model("RMP", "RMP", /\brmp\b/),
      model("TCAS", "TCAS", /\btcas\b/),
    ],
  },
  {
    name: "Rowsfire",
    pattern: /\browsfire\b/,
    models: [
      model("A101", "A101", /\ba101\b/, true),
      model("A103", "A103", /\ba103\b/, true),
      model("A106", "A106", /\ba106\b/, true),
      model("A107", "A107", /\ba107\b/, true),
      model("B107", "B107", /\bb107\b/, true),
    ],
  },
  {
    name: "MiniCockpit",
    pattern: /\bminicockpit\b/,
    models: [
      model("miniFCU", "miniFCU", /\bmini ?fcu\b/, true),
      model("miniEFIS", "miniEFIS", /\bmini ?efis\b/, true),
      model("miniOVHD", "miniOVHD", /\bminiovhd\b/, true),
      // "MiniCockpit FCU + EFIS"
      model("miniFCU", "miniFCU", /\bfcu\b/),
      model("miniEFIS", "miniEFIS", /\befis\b/),
    ],
  },
  {
    name: "Octavi",
    pattern: /\b(octavi|ocatvi)\b/,
    models: [model("IFR-1", "IFR-1", /\bifr ?-?1\b/, true)],
  },
  {
    name: "Honeycomb",
    pattern: /\bhoneycomb\b/,
    models: [
      model("Bravo", "Bravo", /\bbravo\b/, true),
      model("Alpha", "Alpha", /\balpha\b/),
    ],
  },
  {
    name: "Thrustmaster",
    pattern: /\bthrustmaster\b/,
    models: [model("TCA", "TCA", /\btca\b/, true)],
  },
  {
    name: "Wingflex",
    pattern: /\bwingflex\b/,
    models: [
      model("FCU", "FCU", /\bfcu\b/),
      model("EFIS", "EFIS", /\befis\b/),
      model("RMP", "RMP", /\brmp\b/),
      model("GMP", "GMP", /\bgmp\b/),
    ],
  },
  {
    name: "Sim Gauges",
    pattern: /\bsim ?gauges\b/,
    models: [],
  },
  {
    name: "Moza",
    pattern: /\bmoza\b/,
    models: [
      model("MB7F", "MB7F", /\bmb7f\b/, true),
      model("MA3F", "MA3F", /\bma3f\b/, true),
      model("MGX1000", "MGX1000", /\bmgx1000\b/, true),
    ],
  },
  {
    name: "Logitech",
    pattern: /\b(logitech|saitek)\b/,
    models: [model("Switch Panel", "Switch Panel", /\bswitch panel\b/)],
  },
  {
    name: "Hoowalt",
    pattern: /\bhoowalt\b/,
    models: [
      model("D201", "D201", /\bd201\b/, true),
      model("D203", "D203", /\bd203\b/, true),
    ],
  },
  {
    name: "VKB",
    pattern: /\bvkb\b/,
    models: [model("FSM-GA", "FSM-GA", /\bfsm ?-?ga\b/, true)],
  },
  { name: "SL3", pattern: /\bsl3\b/, models: [] },
  { name: "ProDeskSim", pattern: /\b(prodesksim|pds)\b/, models: [] },
  { name: "737DIYSim", pattern: /\b737diysim\b/, models: [] },
]

/** One piece of hardware a profile is for; model is missing when only the brand is named */
export type Hardware = {
  brand: string
  model?: string
  family?: string
}

type Found = Required<Hardware> & {
  start: number
  end: number
  unique: boolean
}

const matches = (pattern: RegExp, text: string) =>
  Array.from(text.matchAll(new RegExp(pattern.source, "g")), (m) => ({
    start: m.index,
    end: m.index + m[0].length,
  }))

// "FCU+EFIS", "PAP3/PFP", "A320 | WINCTRL": separators become spaces
const normalize = (title: string) =>
  title
    .toLowerCase()
    .replace(/[+/|&,()[\]–]/g, " ")
    .replace(/\s+/g, " ")

/** The hardware a profile title names, in order of appearance */
export const hardwareOf = (title: string): Hardware[] => {
  const text = normalize(title)
  const brandsAt = HARDWARE.flatMap((brand) =>
    matches(brand.pattern, text).map(({ start }) => ({
      brand: brand.name,
      start,
    })),
  )
  const models: Found[] = HARDWARE.flatMap((brand) =>
    brand.models.flatMap((m) =>
      matches(m.pattern, text).map((at) => ({
        brand: brand.name,
        model: m.name,
        family: m.family,
        unique: !!m.unique,
        ...at,
      })),
    ),
  )
  // brands named, or known by a model only they make
  const named = new Set([
    ...brandsAt.map((b) => b.brand),
    ...models.filter((m) => m.unique).map((m) => m.brand),
  ])
  const mentions = [
    ...brandsAt,
    ...models
      .filter((m) => m.unique)
      .map(({ brand, start }) => ({ brand, start })),
  ]
  // a model several brands make goes to the brand named closest before it
  const ownerOf = (start: number): string | undefined => {
    const before = mentions.filter((b) => b.start <= start)
    const nearest = before.length ? before : mentions
    return nearest.reduce<{ brand?: string; distance: number }>(
      (best, b) =>
        Math.abs(start - b.start) < best.distance
          ? { brand: b.brand, distance: Math.abs(start - b.start) }
          : best,
      { distance: Infinity },
    ).brand
  }
  const owned = models.filter((m) =>
    m.unique ? true : named.has(m.brand) && ownerOf(m.start) === m.brand,
  )
  // "PFP 3N" also matches "PFP", "… Throttle Metal" also "… Throttle":
  // keep the more exact model of the two
  const exact = owned.filter(
    (m) =>
      !owned.some(
        (other) =>
          other.brand === m.brand &&
          other.model !== m.model &&
          other.model.startsWith(m.model),
      ),
  )
  const found = [...exact].sort((a, b) => a.start - b.start)
  const withModels = new Set(found.map((m) => m.brand))
  const brandOnly = [...named]
    .filter((brand) => !withModels.has(brand))
    .map((brand) => ({ brand }))
  const unique = new Map<string, Hardware>()
  for (const { brand, model, family } of found)
    unique.set(`${brand}/${model}`, { brand, model, family })
  return [...unique.values(), ...brandOnly]
}

export type ModelCount = { name: string; profiles: number }

/** A brand and its models, with the number of profiles for each */
export type BrandSummary = {
  name: string
  formerly?: string
  profiles: number
  models: ModelCount[]
}

/** "WINCTRL (formerly WinWing)" */
export const brandLabel = ({
  name,
  formerly,
}: Pick<BrandSummary, "name" | "formerly">) =>
  formerly ? `${name} (formerly ${formerly})` : name

const byCount = <T extends { profiles: number }>(items: T[]) =>
  // stable: equal counts keep the order of HARDWARE
  [...items].sort((a, b) => b.profiles - a.profiles)

/** The brands and models of an aircraft's profiles, most profiles first */
export const hardwareSummary = (titles: string[]): BrandSummary[] => {
  const found = titles.map(hardwareOf)
  const profilesWith = (test: (hardware: Hardware) => boolean) =>
    found.filter((hardware) => hardware.some(test)).length
  const brands = HARDWARE.map((brand) => ({
    name: brand.name,
    formerly: brand.formerly,
    profiles: profilesWith((h) => h.brand === brand.name),
    models: byCount(
      brand.models
        .map((m) => m.name)
        .filter((name, index, names) => names.indexOf(name) === index)
        .map((name) => ({
          name,
          profiles: profilesWith(
            (h) => h.brand === brand.name && h.model === name,
          ),
        }))
        .filter((m) => m.profiles > 0),
    ),
  })).filter((brand) => brand.profiles > 0)
  return byCount(brands)
}
