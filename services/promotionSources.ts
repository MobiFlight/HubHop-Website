import {
  feedPromotions,
  sponsorPromotions,
  type FeedItem,
  type Promotion,
  type Sponsor,
} from "../lib/promotions"

const FEED_URL = process.env.NEXT_PUBLIC_MOBIFLIGHT_FEED_URL || ""
const SPONSORS_URL = process.env.NEXT_PUBLIC_MOBIFLIGHT_SPONSORS_URL || ""
// the feed's media paths start below its parent folder ("media/…" in /feed/)
const FEED_MEDIA_URL = FEED_URL ? new URL("../", FEED_URL).toString() : ""

const CACHE_KEY = "mobiflightSources"

const fetchJson = async <T>(url: string): Promise<T | undefined> => {
  if (!url) return undefined
  try {
    const res = await fetch(url)
    return res.ok ? ((await res.json()) as T) : undefined
  } catch {
    // e.g. blocked by CORS: the slots fall back to our own promotions
    return undefined
  }
}

type Sources = { feed?: { community?: FeedItem[] }; sponsors?: Sponsor[] }

// The responses are cached as they are, so expiry dates and changes to the
// conversion apply to cached data too.
const fetchSources = async (): Promise<Sources> => {
  const cached = sessionStorage.getItem(CACHE_KEY)
  if (cached) return JSON.parse(cached) as Sources

  const [feed, sponsors] = await Promise.all([
    fetchJson<Sources["feed"]>(FEED_URL),
    fetchJson<Sponsor[]>(SPONSORS_URL),
  ])
  // cache only complete results, so a failed source is tried again on the next page
  if (feed && sponsors) {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ feed, sponsors }))
  }
  return { feed, sponsors }
}

const load = async (): Promise<Promotion[]> => {
  const { feed, sponsors } = await fetchSources()
  return [
    ...feedPromotions(feed?.community ?? [], FEED_MEDIA_URL),
    ...sponsorPromotions(sponsors ?? [], SPONSORS_URL),
  ]
}

// One request per page load, shared by all slots.
const pending: { promise?: Promise<Promotion[]> } = {}

/** News and sponsors from mobiflight.com, once per browser session */
export const loadMobiFlightPromotions = (): Promise<Promotion[]> => {
  pending.promise ??= load()
  return pending.promise
}
