// db.ts
import Dexie, { Table } from "dexie"

// A cached preset as returned by the API (detailed typing follows later)
export type Presets = Record<string, unknown>

export class PresetsDb extends Dexie {
  presetsMsfs!: Table<Presets>
  presetsXplane!: Table<Presets>
  presets!: Table<Presets>

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
