import type { GetStaticProps } from "next"
import Link from "next/link"
import Layout from "@/components/Layout"
import {
  brandUrl,
  hardwareIndexDescription,
  hardwareIndexTitle,
  hardwareIndexUrl,
  type BrandPage,
} from "@/lib/hardwarePages"
import { brandLabel } from "@/lib/profileHardware"
import { loadBrandPages } from "@/services/hardwarePages"

// only what the overview shows, not every profile
type BrandSummary = Pick<
  BrandPage,
  "name" | "formerly" | "slug" | "profiles"
> & {
  products: { family: string; slug: string; profiles: number }[]
}

type HardwareIndexProps = {
  brands: BrandSummary[]
  // profiles that name any brand
  profiles: number
}

export const getStaticProps: GetStaticProps<HardwareIndexProps> = async () => {
  const pages = await loadBrandPages()
  const ids = new Set(
    pages.flatMap((brand) =>
      [...brand.products.flatMap((p) => p.profiles), ...brand.other].map(
        (profile) => profile.id,
      ),
    ),
  )
  return {
    props: {
      profiles: ids.size,
      brands: pages.map(({ name, formerly, slug, profiles, products }) => ({
        name,
        ...(formerly ? { formerly } : {}),
        slug,
        profiles,
        products: products.map((product) => ({
          family: product.family,
          slug: product.slug,
          profiles: product.profiles.length,
        })),
      })),
    },
  }
}

const count = (value: number, one: string, many: string) =>
  `${value.toLocaleString("en-US")} ${value === 1 ? one : many}`

/** All hardware brands with MobiFlight profiles, most profiles first */
const HardwareIndex = ({ brands, profiles }: HardwareIndexProps) => (
  <Layout
    title={hardwareIndexTitle()}
    description={hardwareIndexDescription(brands.length, profiles)}
    path={hardwareIndexUrl()}
  >
    <main className="container mx-auto flex flex-col gap-8 px-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold">
          Cockpit hardware{" "}
          <span className="text-primary">with MobiFlight profiles</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          {count(profiles, "ready-made profile", "ready-made profiles")} for{" "}
          {count(brands.length, "brand", "brands")} in MSFS, shared by the
          community on flightsim.to. Pick your hardware to find the profile for
          your aircraft.
        </p>
      </div>
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => (
          <section
            key={brand.slug}
            aria-labelledby={`${brand.slug}-heading`}
            className="flex flex-col gap-2"
          >
            <h2 id={`${brand.slug}-heading`} className="text-xl font-bold">
              <Link
                href={brandUrl(brand.slug)}
                className="flex justify-between gap-3 hover:underline"
              >
                {brandLabel(brand)}
                <span className="text-sm font-normal text-muted-foreground">
                  {count(brand.profiles, "profile", "profiles")}
                </span>
              </Link>
            </h2>
            {brand.products.length > 0 && (
              <ul className="flex flex-col gap-1">
                {brand.products.map((product) => (
                  <li key={product.slug}>
                    <Link
                      href={`${brandUrl(brand.slug)}#${product.slug}`}
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
    </main>
  </Layout>
)

export default HardwareIndex
