import { test, expect } from "@/tests/fixtures"
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import sharp from "sharp"
import type { FlightsimAddon } from "@/lib/flightsimProfiles"
import {
  brandPages,
  productHeading,
  sponsorsFirst,
  withSponsors,
} from "@/lib/hardwarePages"
import { sponsorOf, tierOf, type Sponsor } from "@/lib/sponsors"

const addon = (
  id: number,
  title: string,
  updated = "2026-01-01",
): FlightsimAddon => ({
  id,
  title,
  link: `https://flightsim.to/addon/${id}`,
  updated_at: `${updated}T00:00:00Z`,
})

const fenix = {
  vendor: "FenixSim",
  vendorSlug: "fenixsim",
  aircraft: "A320",
  aircraftSlug: "a320",
}

test.describe("Hardware pages - data", () => {
  test("Hardware pages - profiles are grouped by brand and product family, most profiles first", () => {
    const pages = brandPages(
      [
        addon(1, "Fenix A320 | WINCTRL PFP 3N | MobiFlight Profile"),
        addon(2, "Fenix A320 | WINCTRL PFP 7 + FCU", "2026-02-01"),
        addon(3, "Fenix A320 | WINCTRL PFP 3N"),
        addon(4, "Fenix A320 | Rowsfire A107"),
        addon(5, "Generic WINCTRL profile"),
        addon(6, "PMDG 737 MCDU profile"),
      ],
      [fenix],
    )

    expect(pages.map((page) => [page.name, page.slug, page.profiles])).toEqual([
      ["WINCTRL", "winctrl", 4],
      ["Rowsfire", "rowsfire", 1],
    ])
    const [winctrl] = pages
    expect(winctrl.products.map(productHeading)).toEqual([
      "PFP (PFP 3N, PFP 7)",
      "FCU",
    ])
    // newest update first
    expect(winctrl.products[0].profiles.map((p) => p.id)).toEqual([2, 1, 3])
    // a brand without a product
    expect(winctrl.other.map((p) => p.id)).toEqual([5])
    expect(winctrl.products[0].profiles[0].aircraft).toEqual([
      { name: "FenixSim A320", url: "/aircraft/msfs/fenixsim/a320/" },
    ])
    expect(winctrl.other[0].aircraft).toEqual([])
  })
})

test.describe("Hardware pages - link preview images", () => {
  test("Hardware pages - the overview and every brand page get a link preview image after the build", async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "og-hardware-"))
    const page = (dir: string, pageProps: object) => {
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(
        path.join(dir, "index.html"),
        `<html><body><script id="__NEXT_DATA__" type="application/json">${JSON.stringify({ props: { pageProps } })}</script></body></html>`,
      )
    }
    const profile = { aircraft: [{ url: "/aircraft/msfs/fenixsim/a320/" }] }
    page(path.join(out, "profiles", "msfs"), {
      sim: "msfs2020",
      brands: [{ name: "WINCTRL" }],
      profiles: 300,
    })
    page(path.join(out, "profiles", "msfs", "winctrl"), {
      sim: "msfs2020",
      brand: {
        name: "WINCTRL",
        formerly: "WinWing",
        profiles: 2,
        products: [{ profiles: [profile] }],
        other: [profile],
      },
    })

    execFileSync("node", ["scripts/ogImages.mjs", out])

    for (const image of ["profiles/msfs.jpg", "profiles/msfs/winctrl.jpg"])
      expect(await sharp(path.join(out, "og", image)).metadata()).toMatchObject(
        { format: "jpeg", width: 1200, height: 630 },
      )
    fs.rmSync(out, { recursive: true })
  })
})

test.describe("Hardware pages - sponsors", () => {
  const sponsor = (
    name: string,
    amount: number,
    href: string | null = "https://example.com/",
  ): Sponsor => ({
    name,
    amount,
    href,
  })

  test("Hardware pages - the amount decides the sponsor tier, as on mobiflight.com", () => {
    expect([200, 150, 100, 50, 25, 0].map(tierOf)).toEqual([
      "gold",
      "silver",
      "silver",
      "bronze",
      undefined,
      undefined,
    ])
  })

  test("Hardware pages - a sponsor matches the brand its name starts with", () => {
    const sponsors = [
      sponsor("Honeycomb Aeronautical", 200),
      sponsor("VKB Sim", 200),
      sponsor("miniCockpit", 100),
      sponsor("WingFlash", 200),
      sponsor("Thrustmaster Fans", 25),
      sponsor("Octavi", 100, null),
    ]

    expect(sponsorOf("Honeycomb", sponsors)?.name).toBe(
      "Honeycomb Aeronautical",
    )
    expect(sponsorOf("VKB", sponsors)?.tier).toBe("gold")
    // the brand's name ignoring case
    expect(sponsorOf("MiniCockpit", sponsors)?.tier).toBe("silver")
    // a whole word, not "WingFlash" for WingFlex
    expect(sponsorOf("WingFlex", sponsors)).toBeUndefined()
    // below bronze, or without a link
    expect(sponsorOf("Thrustmaster", sponsors)).toBeUndefined()
    expect(sponsorOf("Octavi", sponsors)).toBeUndefined()
  })

  test("Hardware pages - sponsors come first by tier, then the other brands by profiles", () => {
    const pages = withSponsors(
      brandPages(
        [
          addon(1, "WINCTRL FCU"),
          addon(2, "WINCTRL MCDU"),
          addon(3, "WINCTRL PAP3"),
          addon(4, "Rowsfire A107"),
          addon(5, "Honeycomb Bravo"),
          addon(6, "Octavi IFR-1"),
          addon(7, "Octavi IFR-1"),
        ],
        [],
      ),
      [sponsor("Rowsfire", 100), sponsor("Honeycomb Aeronautical", 200)],
    )
    const { sponsors, others } = sponsorsFirst(pages)

    expect(sponsors.map((brand) => brand.name)).toEqual([
      "Honeycomb",
      "Rowsfire",
    ])
    expect(others.map((brand) => brand.name)).toEqual(["WINCTRL", "Octavi"])
  })
})

test.describe("Hardware pages", () => {
  test("Hardware pages - the overview shows sponsors first, with a tier badge", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto("/profiles/msfs/")

    const brands = (name: string) =>
      page
        .getByRole("region", { name, exact: true })
        .getByRole("heading", { level: 3 })
    await expect(brands("MobiFlight sponsors")).toHaveText([
      /^Honeycomb\s*Gold sponsor\s*1 profile$/,
      /^Rowsfire\s*Silver sponsor\s*1 profile$/,
      /^miniCOCKPIT\s*Bronze sponsor\s*2 profiles$/,
    ])
    // the tier is a badge next to the name
    await expect(
      page.getByRole("heading", { name: "Honeycomb Gold sponsor 1 profile" }),
    ).toHaveCount(1)
    await expect(brands("More brands")).toHaveText([
      /^WINCTRL \(formerly WinWing\)\s*5 profiles$/,
      /^Thrustmaster\s*1 profile$/,
      /^MOZA\s*1 profile$/,
    ])
  })

  test("Hardware pages - a sponsor's brand page links to the sponsor, labelled with its tier", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto("/profiles/msfs/honeycomb/")

    const box = page.getByRole("complementary", { name: "Sponsor" })
    await expect(box).toContainText("Gold sponsor of MobiFlight and HubHop")
    const link = box.getByRole("link", { name: "Visit Honeycomb Aeronautical" })
    await expect(link).toHaveAttribute(
      "href",
      "https://example.com/honeycomb?ref=mobiflight",
    )
    await expect(link).toHaveAttribute("rel", "sponsored noopener")
    await expect(link).toHaveAttribute("target", "_blank")

    await test.step("Brands that aren't sponsors have no sponsor link", async () => {
      await hubHopPage.goto("/profiles/msfs/thrustmaster/")
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Thrustmaster MobiFlight profiles",
      )
      await expect(
        page.getByRole("complementary", { name: "Sponsor" }),
      ).toHaveCount(0)
    })
  })

  test("Hardware pages - the overview lists the brands with their products", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto("/profiles/msfs/")

    await expect(page).toHaveTitle(
      "MobiFlight profiles that make your hardware plug-and-play | HubHop",
    )
    await expect(page.getByRole("main")).toContainText(
      "11 ready-to-go profiles for 6 hardware brands in MSFS",
    )
    // the words builders use for their hardware
    await expect(page.getByRole("main")).toContainText(
      "Controllers, panels, yokes, joysticks, throttle quadrants, switches and radio panels",
    )
    await expect(
      page.getByRole("region", {
        name: "WINCTRL (formerly WinWing) 5 profiles",
      }),
    ).toMatchAriaSnapshot(`
      - region:
        - heading "WINCTRL (formerly WinWing) 5 profiles" [level=3]:
          - link:
            - /url: /profiles/msfs/winctrl/
        - list:
          - listitem:
            - link "PAP 1 profile":
              - /url: /profiles/msfs/winctrl/#pap
          - listitem:
            - link "PFP 1 profile":
              - /url: /profiles/msfs/winctrl/#pfp
          - listitem:
            - link "FCU 1 profile":
              - /url: /profiles/msfs/winctrl/#fcu
          - listitem:
            - link "MCDU 1 profile":
              - /url: /profiles/msfs/winctrl/#mcdu
          - listitem:
            - link "RMP 1 profile":
              - /url: /profiles/msfs/winctrl/#rmp
    `)
  })

  test("Hardware pages - a brand page lists its profiles by product, with the aircraft's cheat sheet", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto("/profiles/msfs/winctrl/")

    await expect(page).toHaveTitle(
      "WINCTRL (formerly WinWing) MobiFlight profiles for your home cockpit (MSFS)",
    )
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0)
    await expect(
      page
        .getByRole("navigation", { name: "breadcrumb" })
        .getByRole("link", { name: "Profiles" }),
    ).toHaveAttribute("href", "/profiles/msfs/")
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /\/og\/profiles\/msfs\/winctrl\.jpg$/,
    )
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "WINCTRL (formerly WinWing) MobiFlight profiles",
    )
    await expect(
      page.getByRole("navigation", { name: "Products" }).getByRole("link"),
    ).toHaveText(["PAP1", "PFP1", "FCU1", "MCDU1", "RMP1"])

    const pfp = page.getByRole("region", { name: "PFP (PFP 3N) 1 profile" })
    await expect(
      pfp.getByRole("link", { name: /WinWing PFP 3N/ }),
    ).toHaveAttribute("href", /^https:\/\/flightsim\.to\//)
    await test.step("The cheat sheet link opens the aircraft", async () => {
      await pfp
        .getByRole("link", { name: "Asobo A320neo", exact: true })
        .click()
      await expect(page).toHaveURL(/\/aircraft\/msfs\/asobo\/a320neo\/$/)
    })
  })

  test("Hardware pages - small brands aren't indexed and have no product list", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto("/profiles/msfs/rowsfire/")

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    )
    await expect(
      page.getByRole("navigation", { name: "Products" }),
    ).toHaveCount(0)
    await expect(page.getByRole("heading", { level: 2 })).toHaveText([
      "A107 1 profile",
    ])
  })

  test("Hardware pages - the cheat sheet links its hardware to the brand pages", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto("/aircraft/msfs/asobo/a320neo/")

    await page.getByRole("link", { name: "WINCTRL (formerly WinWing)" }).click()
    await expect(page).toHaveURL(/\/profiles\/msfs\/winctrl\/$/)
  })
})
