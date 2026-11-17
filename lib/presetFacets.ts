import { compareText } from "./presetSearch"

// Preset fields the preset list can be filtered by
export type Facet = "vendor" | "aircraft" | "system" | "presetType" | "codeType"

// Distinct, non-empty values sorted ignoring case
export const sortedUnique = (values: (string | undefined)[]) =>
  Array.from(new Set(values.filter((value): value is string => !!value))).sort(
    compareText,
  )
