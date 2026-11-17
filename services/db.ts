// db.ts
import Dexie, { type Table } from "dexie"
import type { Preset } from "../interfaces/preset"

export class PresetsDb extends Dexie {
  presetsMsfs!: Table<Preset, string>
  presetsXplane!: Table<Preset, string>
  presets!: Table<Preset, string>

  constructor() {
    super("simPresetsDb")
    this.version(1).stores({
      presetsMsfs: "id, vendor, createdDate",
    })
    this.version(1).stores({
      presetsXplane: "id, vendor, createdDate",
    })
    this.version(1).stores({
      presets: "id, vendor, createdDate",
    })
  }
}

export const db = new PresetsDb()
