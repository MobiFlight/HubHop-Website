// MobiFlight's sponsors, from the mobiflight-website repository
// (astro/src/data/sponsors.json, downloaded by scripts/sponsors.mjs).
// The hardware pages link a brand to its sponsor and show its tier.

/** An entry of the sponsor list, as the website stores it */
export type Sponsor = {
  name: string
  href: string | null
  // the monthly amount; it decides the tier
  amount: number
}

export type SponsorTier = "gold" | "silver" | "bronze"

/** A hardware brand's sponsor entry, as the pages show it */
export type BrandSponsor = {
  name: string
  href: string
  tier: SponsorTier
}

// the tiers of mobiflight.com's sponsor wall; below bronze isn't shown there
const TIERS: { tier: SponsorTier; amount: number }[] = [
  { tier: "gold", amount: 200 },
  { tier: "silver", amount: 100 },
  { tier: "bronze", amount: 50 },
]

export const tierOf = (amount: number): SponsorTier | undefined =>
  TIERS.find((tier) => amount >= tier.amount)?.tier

export const TIER_ORDER: SponsorTier[] = TIERS.map((tier) => tier.tier)

export const tierLabel: Record<SponsorTier, string> = {
  gold: "Gold sponsor",
  silver: "Silver sponsor",
  bronze: "Bronze sponsor",
}

/**
 * The sponsor entry of a brand: its name starts with the brand's name,
 * ignoring case ("Honeycomb Aeronautical" for Honeycomb, "VKB Sim" for VKB).
 * Only sponsors with a tier and a link count.
 */
export const sponsorOf = (
  brand: string,
  sponsors: Sponsor[],
): BrandSponsor | undefined => {
  const name = brand.toLowerCase()
  const found = sponsors.find((sponsor) => {
    const other = sponsor.name.toLowerCase()
    return (
      other === name ||
      (other.startsWith(name) && /^\s/.test(other.slice(name.length)))
    )
  })
  const tier = found && tierOf(found.amount)
  return found?.href && tier
    ? { name: found.name, href: found.href, tier }
    : undefined
}
