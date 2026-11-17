// Promotions for MobiFlight shown in slots across HubHop (#98).
//
// Content brief
// - title: at most 40 characters
// - text: at most 120 characters, one or two short sentences
// - cta: the link text, two or three words ("Join the Club")
// - image per slot:
//   - list-inline: small logo or none
//   - filter-sidebar, below-results, preset-detail, home-featured: 16:9
//   - loading: larger image
//   - home-sponsors: logo on a transparent background
// - tone: community, thankful, not pushy
// - sponsor promotions are labelled "Sponsored" and their links use rel="sponsored"
//
// The entries in PROMOTIONS are placeholders until the real content exists (see #98).

export type PromotionKind = "club" | "donation" | "sponsor" | "news" | "shop"

export type SlotId =
  | "filter-sidebar"
  | "below-results"
  | "loading"
  | "preset-detail"
  | "list-inline"
  | "home-featured"
  | "home-sponsors"

export type PromotionSim = "msfs2020" | "xplane"

// Every listed criterion must match. Within a criterion, one value is enough.
export type PromotionMatch = {
  sims?: PromotionSim[]
  vendors?: string[]
  aircraft?: string[]
  keywords?: string[]
}

export type Promotion = {
  id: string
  kind: PromotionKind
  title: string
  text: string
  cta: string
  url: string
  image?: string
  sponsorTier?: "gold" | "silver"
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

const MOBIFLIGHT_URL = "https://www.mobiflight.com/"

export const PROMOTIONS: Promotion[] = [
  {
    id: "club",
    kind: "club",
    title: "Join the MobiFlight Club",
    text: "HubHop is free for everyone. Club members keep it that way and get early access to new features.",
    cta: "Join the Club",
    url: MOBIFLIGHT_URL,
    weight: 3,
  },
  {
    id: "donation",
    kind: "donation",
    title: "Did HubHop help you?",
    text: "MobiFlight and HubHop are made by volunteers. A small donation helps us keep them running.",
    cta: "Donate via PayPal",
    url: MOBIFLIGHT_URL,
    weight: 2,
  },
  {
    id: "sponsor-gold",
    kind: "sponsor",
    sponsorTier: "gold",
    title: "Gold sponsor",
    text: "Placeholder for a Gold sponsor of MobiFlight.",
    cta: "Visit sponsor",
    url: MOBIFLIGHT_URL,
  },
  {
    id: "sponsor-silver",
    kind: "sponsor",
    sponsorTier: "silver",
    title: "Silver sponsor",
    text: "Placeholder for a Silver sponsor of MobiFlight.",
    cta: "Visit sponsor",
    url: MOBIFLIGHT_URL,
  },
  {
    id: "news",
    kind: "news",
    title: "What's new in MobiFlight",
    text: "Read about the latest MobiFlight releases and community projects.",
    cta: "Read the news",
    url: MOBIFLIGHT_URL,
    slots: ["filter-sidebar", "below-results", "loading", "home-featured"],
  },
  {
    id: "shop",
    kind: "shop",
    title: "Build your own cockpit",
    text: "Boards, displays and kits for your home cockpit from the MobiFlight shop.",
    cta: "Visit the shop",
    url: MOBIFLIGHT_URL,
    match: { keywords: ["display", "led", "panel", "switch", "encoder"] },
  },
]

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

// The promotions that fit the slot and match the context best.
export const bestPromotions = (
  slot: SlotId,
  context: PromotionContext,
  promotions: Promotion[] = PROMOTIONS,
  excludeIds: string[] = [],
): Promotion[] => {
  const scored = promotions
    .filter((promotion) => !promotion.slots || promotion.slots.includes(slot))
    .filter((promotion) => !excludeIds.includes(promotion.id))
    .map((promotion) => ({ promotion, score: matchScore(promotion, context) }))
    .filter(({ score }) => score >= 0)
  const best = Math.max(...scored.map(({ score }) => score))
  return scored
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

// Gold sponsors first, then Silver; for the sponsor strip.
export const sponsors = (promotions: Promotion[] = PROMOTIONS): Promotion[] =>
  promotions
    .filter((promotion) => promotion.kind === "sponsor")
    .sort(
      (a, b) =>
        Number(b.sponsorTier === "gold") - Number(a.sponsorTier === "gold"),
    )

// Adds UTM parameters so clicks can be counted on the target site.
export const promotionUrl = (promotion: Promotion, slot: SlotId): string => {
  const url = new URL(promotion.url)
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
