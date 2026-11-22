// Downloads MobiFlight's sponsor list before `next build` (npm "prebuild") into
// .build-data/, where the hardware pages read it (services/hardwarePages.ts).
// The list lives in the mobiflight-website repository; HubHop keeps no copy.
// Its `amount` gives the tier, as on mobiflight.com (lib/sponsors.ts).
// mobiflight.com/sponsors.json lists gold sponsors only: it's for the
// MobiFlight app. If the download fails, the site is built without sponsors.
import fs from "node:fs"
import path from "node:path"

const SPONSORS_FILE = path.join(".build-data", "sponsors.json")
const SPONSORS_URL =
  "https://raw.githubusercontent.com/MobiFlight/mobiflight-website/main/astro/src/data/sponsors.json"

let sponsors = []
try {
  const res = await fetch(SPONSORS_URL)
  if (!res.ok) throw new Error(`download failed: ${res.status}`)
  sponsors = await res.json()
  if (!Array.isArray(sponsors)) throw new Error("not a list")
  console.info(`MobiFlight sponsors: ${sponsors.length} downloaded`)
} catch (error) {
  // sponsors are an extra: build the site without them
  sponsors = []
  console.warn(`MobiFlight sponsors not loaded: ${error.message}`)
}
fs.mkdirSync(path.dirname(SPONSORS_FILE), { recursive: true })
fs.writeFileSync(SPONSORS_FILE, JSON.stringify(sponsors))
