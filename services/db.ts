// db.ts
import Dexie, { Table } from 'dexie';

export interface Presets {
  presets: any;
}

export class PresetsDb extends Dexie {
  presets!: Table<Presets>; 

  constructor() {
    super('presetsDb');
    this.version(1).stores({
      presets: 'id, vendor, createdDate'
    });
  }
}

export const db = new PresetsDb();