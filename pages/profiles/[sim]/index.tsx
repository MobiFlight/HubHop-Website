import type { GetStaticPaths, GetStaticProps } from "next"
import Link from "next/link"
import Layout from "@/components/Layout"
import { Badge } from "@/components/ui/badge"
import {
  brandUrl,
  hardwareIndexDescription,
  hardwareIndexImageUrl,
  hardwareIndexTitle,
  hardwareIndexUrl,
  PROFILE_SIMS,
  profileCount,
  sponsorsFirst,
  type BrandPage,
} from "@/lib/hardwarePages"
import { brandLabel } from "@/lib/profileHardware"
import { simFromSegment, simSegment, type Sim } from "@/lib/presetUrls"
import type { SponsorTier } from "@/lib/sponsors"
import { loadBrandPages } from "@/services/hardwarePages"

// only what the overview shows, not every profile
type BrandSummary = Pick<
  BrandPage,
  "name" | "formerly" | "slug" | "profiles" | "sponsor"
> & {
  products: { family: string; slug: string; profiles: number }[]
}

type HardwareIndexProps = {
  sim: Sim
  brands: BrandSummary[]
  // profiles that name any brand
  profiles: number
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: PROFILE_SIMS.map((sim) => ({ params: { sim: simSegment(sim) } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps<HardwareIndexProps> = async ({
  params,
}) => {
  const sim = simFromSegment(String(params?.sim))
  if (!sim || !PROFILE_SIMS.includes(sim)) return { notFound: true }
  const pages = await loadBrandPages()
  return {
    props: {
      sim,
      profiles: profileCount(pages),
      brands: pages.map(
        ({ name, formerly, slug, profiles, products, sponsor }) => ({
          name,
          ...(formerly ? { formerly } : {}),
          ...(sponsor ? { sponsor } : {}),
          slug,
          profiles,
          products: products.map((product) => ({
            family: product.family,
            slug: product.slug,
            profiles: product.profiles.length,
          })),
        }),
      ),
    },
  }
}

const count = (value: number, one: string, many: string) =>
  `${value.toLocaleString("en-US")} ${value === 1 ? one : many}`

// gold stands out in the brand colour, silver and bronze stay quieter
const TIER_BADGE: Record<SponsorTier, "default" | "secondary" | "outline"> = {
  gold: "default",
  silver: "secondary",
  bronze: "outline",
}

// silver gets a border in its text colour
const TIER_CLASS: Partial<Record<SponsorTier, string>> = {
  silver: "border-secondary-foreground",
}

const TIER_NAME: Record<SponsorTier, string> = {
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
}

type BrandGridProps = { sim: Sim; brands: BrandSummary[] }

const BrandGrid = ({ sim, brands }: BrandGridProps) => (
  <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
    {brands.map((brand) => (
      <section
        key={brand.slug}
        aria-labelledby={`${brand.slug}-heading`}
        className="flex flex-col gap-2"
      >
        <h3 id={`${brand.slug}-heading`} className="text-xl font-bold">
          <Link
            href={brandUrl(sim, brand.slug)}
            className="flex justify-between gap-3 hover:underline"
          >
            <span className="flex items-center gap-2">
              {brandLabel(brand)}
              {brand.sponsor && (
                <Badge
                  variant={TIER_BADGE[brand.sponsor.tier]}
                  className={TIER_CLASS[brand.sponsor.tier]}
                >
                  {TIER_NAME[brand.sponsor.tier]}
                  <span className="sr-only"> sponsor</span>
                </Badge>
              )}
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              {count(brand.profiles, "profile", "profiles")}
            </span>
          </Link>
        </h3>
        {brand.products.length > 0 && (
          <ul className="flex flex-col gap-1">
            {brand.products.map((product) => (
              <li key={product.slug}>
                <Link
                  href={`${brandUrl(sim, brand.slug)}#${product.slug}`}
                  className="flex justify-between gap-3 rounded-md px-2 py-1 hover:bg-card"
                >
                  <span className="text-primary">{product.family}</span>
                  <span className="text-sm text-muted-foreground">
                    {count(product.profiles, "profile", "profiles")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    ))}
  </div>
)

/** All hardware brands with MobiFlight profiles: sponsors first, then by profiles */
const HardwareIndex = ({ sim, brands, profiles }: HardwareIndexProps) => {
  const { sponsors, others } = sponsorsFirst(brands)
  return (
    <Layout
      title={hardwareIndexTitle()}
      description={hardwareIndexDescription(brands.length, profiles)}
      path={hardwareIndexUrl(sim)}
      image={hardwareIndexImageUrl(sim)}
    >
      <main className="container mx-auto flex flex-col gap-8 px-6 py-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold">
            MobiFlight profiles{" "}
            <span className="text-primary">
              that make your hardware plug-and-play
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            {count(profiles, "ready-to-go profile", "ready-to-go profiles")} for{" "}
            {count(brands.length, "hardware brand", "hardware brands")} in MSFS,
            shared by the community on flightsim.to. Pick your brand, then find
            the profile for your aircraft.
          </p>
        </div>
        {sponsors.length > 0 && (
          <section
            aria-labelledby="sponsors-heading"
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <h2 id="sponsors-heading" className="text-2xl font-extrabold">
                MobiFlight sponsors
              </h2>
              <p className="text-muted-foreground">
                These hardware makers support MobiFlight and HubHop.
              </p>
            </div>
            <BrandGrid sim={sim} brands={sponsors} />
          </section>
        )}
        {others.length > 0 && (
          <section
            aria-labelledby="brands-heading"
            className="flex flex-col gap-4"
          >
            {sponsors.length > 0 && (
              <h2 id="brands-heading" className="text-2xl font-extrabold">
                More brands
              </h2>
            )}
            <BrandGrid sim={sim} brands={others} />
          </section>
        )}
        {/* the words builders use for their hardware */}
        <p className="max-w-3xl text-muted-foreground">
          A MobiFlight profile connects your flight sim hardware to your
          favorite add-on aircraft. Controllers, panels, yokes, joysticks,
          throttle quadrants, switches and radio panels are set up in just a few
          moments. Load the profile in MobiFlight, and your home cockpit
          hardware feels plug-and-play.
        </p>
      </main>
    </Layout>
  )
}

export default HardwareIndex
