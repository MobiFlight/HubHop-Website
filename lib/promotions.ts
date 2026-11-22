// Promotions for MobiFlight shown in slots across HubHop (#98).
//
// Promotions use the item format of the MobiFlight news feed
// (https://mobiflight.com/feed/en/feed.json, source in MobiFlight/mobiflight-website),
// so news, partner deals and sponsors from mobiflight.com show up here without
// extra work. PROMOTIONS below are our own entries; they also fill the slots
// when the feed can't be loaded.
//
// Content brief, the same as for the news feed:
// - title: at most 40 characters
// - content: one or two short sentences
// - media: 16:9 image (the feed uses 500 x 281) with alt text; sponsor logos are shown on white
// - action: the button text, two or three words, and the link
// - tone: community, thankful, not pushy
// - sponsor promotions are labelled "Sponsored" and their links use rel="sponsored"

export type PromotionKind = "club" | "donation" | "sponsor" | "news" | "shop"

export type SlotId =
  | "filter-sidebar"
  | "below-results"
  | "loading"
  | "preset-detail"
  | "list-inline"
  // the homepage's "MobiFlight news & partners": one card of each kind
  | "home-news"
  | "home-sponsor"
  | "home-club"
  // aircraft cheat sheets: above the systems list (from lg on) and after the second system
  | "cheatsheet-sidebar"
  | "cheatsheet-inline"

export type PromotionSim = "msfs2020" | "xplane"

// Every listed criterion must match. Within a criterion, one value is enough.
export type PromotionMatch = {
  sims?: PromotionSim[]
  vendors?: string[]
  aircraft?: string[]
  keywords?: string[]
}

// An item of the MobiFlight news feed (NewsItem in mobiflight-website's news-card.astro)
export type FeedItem = {
  date: string
  title: string
  content: string[]
  media?: { type: string; src: string; alt: string }
  tags: string[]
  action?: { title: string; url: string }
  // last day the item is shown (YYYY-MM-DD)
  expires?: string
}

// An entry of https://mobiflight.com/sponsors.json
export type Sponsor = {
  name: string
  logo: string
  href: string
}

export type Promotion = {
  id: string
  kind: PromotionKind
  date?: string
  title: string
  content: string[]
  // "logo" is shown whole on a white background, "image" fills the area
  media?: { type: "image" | "logo"; src: string; alt: string }
  action: { title: string; url: string }
  // the feed tag of items from the MobiFlight news feed
  tag?: FeedTag
  // slots this promotion may appear in; all slots when missing
  slots?: SlotId[]
  match?: PromotionMatch
  // relative chance among equally specific promotions; 1 when missing
  weight?: number
}

export type PromotionContext = {
  sim?: PromotionSim
  vendor?: string
  aircraft?: string
  search?: string
}

export const PROMOTIONS: Promotion[] = [
  {
    id: "club",
    kind: "club",
    title: "Join the MobiFlight Club",
    content: [
      "HubHop and MobiFlight are free for everyone.",
      "Club members keep it that way.",
    ],
    action: { title: "Join the Club", url: "https://mobiflight.com/club/" },
    weight: 3,
  },
  {
    id: "donation",
    kind: "donation",
    title: "Did HubHop help you?",
    content: [
      "MobiFlight and HubHop are made by volunteers.",
      "Your support keeps them running.",
    ],
    action: {
      title: "Donate via PayPal",
      url: "https://www.paypal.com/donate/?hosted_button_id=URY7DDNXZ8Q3U",
    },
    weight: 2,
  },
  {
    id: "shop",
    kind: "shop",
    title: "Build your own cockpit",
    content: [
      "Boards, displays and kits for your home cockpit from the MobiFlight shop.",
    ],
    action: { title: "Visit the shop", url: "https://shop.mobiflight.com/" },
    match: { keywords: ["display", "led", "panel", "switch", "encoder"] },
  },
]

// Today in the user's time zone as YYYY-MM-DD, the format of the feed's dates.
const localDate = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")

// Feed items with one of these tags are shown, in the order the filter sidebar prefers them.
export const FEED_TAGS = ["promo", "shop", "community"] as const
export type FeedTag = (typeof FEED_TAGS)[number]

// Feed items with a button that are published and not expired;
// media paths are relative to mediaBaseUrl.
export const feedPromotions = (
  items: FeedItem[],
  mediaBaseUrl: string,
  today: string = localDate(new Date()),
): Promotion[] =>
  items.flatMap((item) => {
    const tag = FEED_TAGS.find((feedTag) => item.tags.includes(feedTag))
    const { action } = item
    const current =
      item.date <= today && (!item.expires || item.expires >= today)
    if (!tag || !action || !current) return []
    return [
      {
        id: `news-${item.date}-${item.title}`,
        kind: "news" as const,
        tag,
        date: item.date,
        title: item.title,
        content: item.content,
        media:
          item.media?.type === "image"
            ? {
                type: "image" as const,
                src: new URL(item.media.src, mediaBaseUrl).toString(),
                alt: item.media.alt,
              }
            : undefined,
        action,
      },
    ]
  })

// Logo paths are relative to the sponsors file.
export const sponsorPromotions = (
  sponsors: Sponsor[],
  sponsorsUrl: string,
): Promotion[] =>
  sponsors.map((sponsor) => ({
    id: `sponsor-${sponsor.name}`,
    kind: "sponsor",
    title: sponsor.name,
    content: [`${sponsor.name} sponsors MobiFlight. Thank you!`],
    media: {
      type: "logo",
      src: new URL(sponsor.logo, sponsorsUrl).toString(),
      alt: `${sponsor.name} logo`,
    },
    action: { title: `Visit ${sponsor.name}`, url: sponsor.href },
  }))

const normalize = (value: string) => value.trim().toLowerCase()

const includesAny = (value: string | undefined, candidates: string[]) => {
  if (!value) return false
  const text = normalize(value)
  return candidates.some((candidate) => text.includes(normalize(candidate)))
}

// Number of criteria that match the context, or -1 if one of them doesn't.
// A promotion without criteria scores 0 and fits every context.
export const matchScore = (
  promotion: Promotion,
  context: PromotionContext,
): number => {
  const { sims, vendors, aircraft, keywords } = promotion.match ?? {}
  const checks = [
    sims && context.sim !== undefined && sims.includes(context.sim),
    vendors &&
      vendors.some(
        (vendor) =>
          context.vendor !== undefined &&
          normalize(vendor) === normalize(context.vendor),
      ),
    aircraft && includesAny(context.aircraft, aircraft),
    keywords && includesAny(context.search, keywords),
  ].filter((check) => check !== undefined)
  return checks.every(Boolean) ? checks.length : -1
}

// Slots that only show promotions of these kinds
const SLOT_KINDS: Partial<Record<SlotId, readonly PromotionKind[]>> = {
  "home-news": ["news"],
  "home-sponsor": ["sponsor"],
  "home-club": ["club"],
}

// Slots that prefer feed items by tag, in this order; other promotions come after them.
const SLOT_TAG_ORDER: Partial<Record<SlotId, readonly FeedTag[]>> = {
  "filter-sidebar": FEED_TAGS,
}

// 0 for the preferred tag; the same for all promotions in other slots.
const tagRank = (promotion: Promotion, slot: SlotId): number => {
  const order = SLOT_TAG_ORDER[slot] ?? []
  const index = promotion.tag ? order.indexOf(promotion.tag) : -1
  return index === -1 ? order.length : index
}

// The promotions that fit the slot, have its preferred tag and match the context best.
export const bestPromotions = (
  slot: SlotId,
  context: PromotionContext,
  promotions: Promotion[] = PROMOTIONS,
  excludeIds: string[] = [],
): Promotion[] => {
  const ranked = promotions
    .filter((promotion) => !promotion.slots || promotion.slots.includes(slot))
    .filter(
      (promotion) =>
        !SLOT_KINDS[slot] || SLOT_KINDS[slot].includes(promotion.kind),
    )
    .filter((promotion) => !excludeIds.includes(promotion.id))
    .map((promotion) => ({
      promotion,
      rank: tagRank(promotion, slot),
      score: matchScore(promotion, context),
    }))
    .filter(({ score }) => score >= 0)
  const topRank = Math.min(...ranked.map(({ rank }) => rank))
  const preferred = ranked.filter(({ rank }) => rank === topRank)
  const best = Math.max(...preferred.map(({ score }) => score))
  return preferred
    .filter(({ score }) => score === best)
    .map(({ promotion }) => promotion)
}

// Picks one promotion by weight; random returns a number in [0, 1).
export const pickWeighted = (
  promotions: Promotion[],
  random: () => number = Math.random,
): Promotion | undefined => {
  const total = promotions.reduce((sum, p) => sum + (p.weight ?? 1), 0)
  const target = random() * total
  const found = promotions.reduce<{ pick?: Promotion; sum: number }>(
    (acc, promotion) => {
      if (acc.pick) return acc
      const sum = acc.sum + (promotion.weight ?? 1)
      return sum > target ? { pick: promotion, sum } : { sum }
    },
    { sum: 0 },
  )
  return found.pick ?? promotions[promotions.length - 1]
}

export const pickPromotion = (
  slot: SlotId,
  context: PromotionContext,
  promotions: Promotion[] = PROMOTIONS,
  random: () => number = Math.random,
  excludeIds: string[] = [],
): Promotion | undefined =>
  pickWeighted(bestPromotions(slot, context, promotions, excludeIds), random)

// Adds UTM parameters so clicks can be counted on the target site.
export const promotionUrl = (promotion: Promotion, slot: SlotId): string => {
  const url = new URL(promotion.action.url)
  url.searchParams.set("utm_source", "hubhop")
  url.searchParams.set("utm_medium", "promotion")
  url.searchParams.set("utm_campaign", promotion.id)
  url.searchParams.set("utm_content", slot)
  return url.toString()
}

export const promotionLabel: Record<PromotionKind, string> = {
  club: "MobiFlight Club",
  donation: "Support MobiFlight",
  sponsor: "Sponsored",
  news: "MobiFlight News",
  shop: "MobiFlight Shop",
}
