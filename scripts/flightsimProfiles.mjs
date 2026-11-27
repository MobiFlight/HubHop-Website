// Downloads the MobiFlight profiles from flightsim.to's partner API before
// `next build` (npm "prebuild") into .build-data/, where the cheat sheets read
// them (services/flightsimProfiles.ts). Once per build: Next.js builds pages
// in several processes, and the API allows 60 searches per minute.
// The token is the repository secret FLIGHTSIM_TO_TOKEN (or .env.local).
// Without it the site is built without profiles. With it, a failed download
// fails the build, so a short outage at flightsim.to doesn't remove the
// profiles from the live site; the next nightly build tries again.
import fs from "node:fs"
import path from "node:path"
import nextEnv from "@next/env"

nextEnv.loadEnvConfig(process.cwd())

const PROFILES_FILE = path.join(".build-data", "flightsim-profiles.json")
const SEARCH_URL = "https://flightsim.to/api/v1/addon/search"
// 50 per page is the API's maximum; today there are about 500 profiles
const PER_PAGE = 50
const MAX_PAGES = 40

const fetchPage = async (token, page) => {
  const params = new URLSearchParams({
    subcategory: "mobiflight-profiles",
    sort: "newest",
    per_page: String(PER_PAGE),
    page: String(page),
  })
  const res = await fetch(`${SEARCH_URL}?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`search failed: ${res.status}`)
  return res.json()
}

const download = async (token) => {
  const first = await fetchPage(token, 1)
  const pages = Math.min(first.meta.total_pages, MAX_PAGES)
  const profiles = [...first.data]
  for (let page = 2; page <= pages; page++)
    profiles.push(...(await fetchPage(token, page)).data)
  return profiles
}

const loadProfiles = async (token) => {
  if (!token) {
    console.info("MobiFlight profiles: no FLIGHTSIM_TO_TOKEN, building without")
    return []
  }
  try {
    const profiles = await download(token)
    if (profiles.length === 0) throw new Error("no profiles returned")
    console.info(`MobiFlight profiles: ${profiles.length} downloaded`)
    return profiles
  } catch (error) {
    console.error(`MobiFlight profiles not loaded: ${error.message}`)
    process.exit(1)
  }
}

const profiles = await loadProfiles(process.env.FLIGHTSIM_TO_TOKEN)
fs.mkdirSync(path.dirname(PROFILES_FILE), { recursive: true })
fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles))
