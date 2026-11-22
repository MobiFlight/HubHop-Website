import type { GetStaticPaths, GetStaticProps } from "next"
import Link from "next/link"
import { useEffect, useState } from "react"
import Layout from "@/components/Layout"
import BreadcrumbJsonLd from "@/components/sections/aircraft/BreadcrumbJsonLd"
import ProfileSection from "@/components/sections/hardware/ProfileSection"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  brandDescription,
  brandImageUrl,
  brandTitle,
  brandUrl,
  hardwareIndexUrl,
  MIN_INDEXED_PROFILES,
  MIN_PRODUCTS_FOR_SIDEBAR,
  productHeading,
  PROFILE_SIMS,
  type BrandPage,
} from "@/lib/hardwarePages"
import { brandLabel } from "@/lib/profileHardware"
import { simFromSegment, simSegment, type Sim } from "@/lib/presetUrls"
import { tierLabel } from "@/lib/sponsors"
import { track } from "@/services/analytics"
import { loadBrandPages } from "@/services/hardwarePages"

type BrandProps = {
  sim: Sim
  brand: BrandPage
  // when the page was built: "3 days ago" in the HTML, recalculated in the browser
  builtAt: string
}

const OTHER_ANCHOR = "other-profiles"

export const getStaticPaths: GetStaticPaths = async () => {
  const brands = await loadBrandPages()
  return {
    paths: PROFILE_SIMS.flatMap((sim) =>
      brands.map((brand) => ({
        params: { sim: simSegment(sim), brand: brand.slug },
      })),
    ),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<BrandProps> = async ({
  params,
}) => {
  const sim = simFromSegment(String(params?.sim))
  if (!sim || !PROFILE_SIMS.includes(sim)) return { notFound: true }
  const brand = (await loadBrandPages()).find(
    (page) => page.slug === String(params?.brand),
  )
  if (!brand) return { notFound: true }
  return { props: { sim, brand, builtAt: new Date().toISOString() } }
}

/** A hardware brand: its MobiFlight profiles on flightsim.to, by product */
const Brand = ({ sim, brand, builtAt }: BrandProps) => {
  // the page is built at night: the browser knows how long ago it really was
  const [now, setNow] = useState(() => new Date(builtAt).getTime())
  useEffect(() => setNow(Date.now()), [])
  const name = brandLabel(brand)
  const path = brandUrl(sim, brand.slug)
  const aircraft = new Set(
    [...brand.products.flatMap((p) => p.profiles), ...brand.other].flatMap(
      (profile) => profile.aircraft.map((entry) => entry.url),
    ),
  ).size
  const sections = [
    ...brand.products.map((product) => ({
      id: product.slug,
      heading: productHeading(product),
      profiles: product.profiles,
    })),
    ...(brand.other.length
      ? [
          {
            id: OTHER_ANCHOR,
            heading: brand.products.length
              ? `Other ${brand.name} profiles`
              : `${brand.name} profiles`,
            profiles: brand.other,
          },
        ]
      : []),
  ]
  const sidebar = brand.products.length >= MIN_PRODUCTS_FOR_SIDEBAR

  return (
    <Layout
      title={brandTitle(brand)}
      description={brandDescription(brand)}
      path={path}
      noindex={brand.profiles < MIN_INDEXED_PROFILES}
      image={brandImageUrl(sim, brand.slug)}
    >
      <BreadcrumbJsonLd
        items={[
          { name: "Profiles", path: hardwareIndexUrl(sim) },
          { name, path },
        ]}
      />
      <main className="container mx-auto flex flex-col gap-10 px-6 py-10">
        <div className="flex flex-col gap-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={hardwareIndexUrl(sim)}>Profiles</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{brand.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-4xl font-extrabold">
            {name} <span className="text-primary">MobiFlight profiles</span>
          </h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            {brand.profiles} ready-to-go MobiFlight{" "}
            {brand.profiles === 1 ? "profile" : "profiles"} for {name} hardware
            {aircraft > 0 && `, for ${aircraft} aircraft`}. Shared by the
            community on flightsim.to: download the profile for your aircraft
            and connect your home cockpit in MSFS.
          </p>
          {brand.sponsor && (
            <aside
              aria-label="Sponsor"
              className="flex flex-wrap items-center gap-x-4 gap-y-2 self-start rounded-lg border bg-card px-4 py-3"
            >
              <p>
                <span className="font-semibold text-primary">
                  {tierLabel[brand.sponsor.tier]}
                </span>{" "}
                of MobiFlight and HubHop
              </p>
              <Button asChild>
                <a
                  href={brand.sponsor.href}
                  target="_blank"
                  rel="sponsored noopener"
                  onClick={() =>
                    track("sponsor_click", { slot: "hardware-brand" })
                  }
                >
                  Visit {brand.sponsor.name}
                </a>
              </Button>
            </aside>
          )}
        </div>
        <div
          className={`grid gap-8 ${sidebar ? "lg:grid-cols-[14rem_1fr]" : ""}`}
        >
          {sidebar && (
            <nav
              aria-label="Products"
              className="lg:sticky lg:top-4 lg:self-start"
            >
              <ul className="flex flex-wrap gap-1 lg:flex-col">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex justify-between gap-3 rounded-md px-2 py-1 text-primary hover:bg-card"
                    >
                      {section.id === OTHER_ANCHOR
                        ? "Other"
                        : (brand.products.find((p) => p.slug === section.id)
                            ?.family ?? section.heading)}
                      <span className="text-muted-foreground">
                        {section.profiles.length}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <div className="flex min-w-0 flex-col gap-10">
            {sections.map((section) => (
              <ProfileSection
                key={section.id}
                id={section.id}
                heading={section.heading}
                profiles={section.profiles}
                now={now}
              />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Brand
