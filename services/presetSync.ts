// presetSync.ts
import { db } from "./db";

export type SimType = "msfs2020" | "xplane";

const config = {
  msfs2020: {
    table: () => db.presetsMsfs,
    lastUrl: process.env.NEXT_PUBLIC_HUBHOP_API_LAST_MSFS,
    stampKey: "syncedMsfs",
    legacyStampKey: "fetchedMsfs",
  },
  xplane: {
    table: () => db.presetsXplane,
    lastUrl: process.env.NEXT_PUBLIC_HUBHOP_API_LAST_XPLANE,
    stampKey: "syncedXplane",
    legacyStampKey: "fetchedXplane",
  },
};

export const presetTable = (sim: SimType) => config[sim].table();

// one in-flight sync per sim, shared by all callers
const pending: Partial<Record<SimType, Promise<void>>> = {};

async function fetchLast(sim: SimType): Promise<string | undefined> {
  try {
    const res = await fetch(config[sim].lastUrl || "", { redirect: "follow" });
    const last = await res.json();
    return last?.[0]?.createdDate;
  } catch (error) {
    console.warn(`Could not check for ${sim} preset updates`, error);
    return undefined;
  }
}

async function downloadPresets(sim: SimType, last: string | undefined) {
  const res = await fetch(
    process.env.NEXT_PUBLIC_HUBHOP_API_BASEURL + "/" + sim + "/presets",
    { redirect: "follow" }
  );
  if (!res.ok) throw new Error(`Downloading ${sim} presets failed: ${res.status}`);
  const fetchedPresets = await res.json();
  const table = presetTable(sim);
  await db.transaction("rw", table, async () => {
    await table.clear();
    await table.bulkAdd(fetchedPresets);
  });
  // stamp with the server's date, so the client clock doesn't matter
  if (last) localStorage.setItem(config[sim].stampKey, last);
}

async function runSync(sim: SimType, onDownload?: () => void) {
  const { stampKey, legacyStampKey } = config[sim];
  const isEmpty = (await presetTable(sim).count()) === 0;
  const stamp =
    localStorage.getItem(stampKey) || localStorage.getItem(legacyStampKey) || "";
  // without a stamp the table only holds single presets, not a full list
  const needsFullList = isEmpty || !stamp;
  const last = await fetchLast(sim);

  // keep a full list if we cannot tell whether it is stale
  if (!needsFullList && (!last || last <= stamp)) return;

  onDownload?.();
  await downloadPresets(sim, last);
}

// Makes sure the local IndexedDB copy of one sim's presets is current.
// Downloads the full list only if the table is empty or the server has newer data.
export function syncSim(sim: SimType, onDownload?: () => void): Promise<void> {
  if (!pending[sim]) {
    pending[sim] = runSync(sim, onDownload).finally(() => {
      delete pending[sim];
    });
  }
  return pending[sim]!;
}
