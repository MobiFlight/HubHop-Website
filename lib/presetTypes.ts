import type { SimType } from "../services/presetSync"

// Input/Output values per sim, as in MobiFlight Connector (types/preset.d.ts).
// Defined here on purpose: nobody, not even moderators, may create new ones.
export const PRESET_TYPES = {
  msfs2020: ["Input", "Output", "Input (Potentiometer)"],
  xplane: ["Input", "Output", "InputOutput", "Input (Potentiometer)"],
} as const satisfies Record<SimType, readonly string[]>

export type PresetType = (typeof PRESET_TYPES.msfs2020)[number]
export type XplanePresetType = (typeof PRESET_TYPES.xplane)[number]

// the values for the sim stored in localStorage ("simType")
export const presetTypesFor = (sim: string | null) =>
  sim === "xplane" ? PRESET_TYPES.xplane : PRESET_TYPES.msfs2020
