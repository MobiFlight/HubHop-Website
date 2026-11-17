// Preset fields the preset list can be filtered by
export type Facet = "vendor" | "aircraft" | "system" | "presetType" | "codeType"

// Compares text ignoring case, with numbers in natural order ("A320" before "A1000").
// One shared collator: localeCompare with options is much slower on 35,000 presets.
export const compareText = new Intl.Collator("en", {
  sensitivity: "base",
  numeric: true,
}).compare

// Distinct, non-empty values sorted ignoring case
export const sortedUnique = (values: (string | undefined)[]) =>
  Array.from(new Set(values.filter((value): value is string => !!value))).sort(
    compareText,
  )
