// HubHop API data types. Keep in line with:
// - HubHopApi: model/Preset.ts (PresetDbSchema), model/Statistics.ts, PresetHistoryGet
// - MobiFlight Connector: frontend/src/types/preset.d.ts (same names and values)

import type { CodeType } from "../lib/codeTypes"
import type { PresetType, XplanePresetType } from "../lib/presetTypes"

export type { CodeType, PresetType, XplanePresetType }

export type PresetStatus = "Submitted" | "Updated"

export interface Preset {
  id: string
  path?: string
  vendor: string
  aircraft: string
  system: string
  label: string
  code: string
  description?: string | null
  presetType: XplanePresetType
  // X-Plane only
  codeType?: CodeType | ""
  status?: PresetStatus
  version: number
  author: string
  updatedBy?: string
  // ISO date of the last change; each edit overwrites it
  createdDate?: string
  oldCreatedDate?: string
  score?: number | null
  votes?: number | null
  reported?: number | null
  report_catergory?: string
  report_description?: string
}

export type XplanePreset = Preset & {
  presetType: XplanePresetType
  codeType: CodeType
}

// GET /{sim}/history/presets/{id}
export interface PresetHistory {
  id: string
  history: Preset[]
}

// presetsUpdated are database documents and carry the MongoDB _id
export type StatisticsPreset = Preset & { _id?: string }

// GET /{sim}/statistics/general
export interface Statistics {
  contributors: { _id: string; contributions: number }[]
  aircrafts: {
    _id: { vendor: string; aircraft: string }
    presetCount: number
  }[]
  votes: Preset[]
  presetsAdded: StatisticsPreset[]
  presetsUpdated: StatisticsPreset[]
}
