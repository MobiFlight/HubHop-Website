import { test, expect } from "@/tests/fixtures"
import type { FlightsimAddon } from "@/lib/flightsimProfiles"
import { brandPages, productHeading } from "@/lib/hardwarePages"

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

test.describe("Hardware pages", () => {
  test("Hardware pages - the overview lists the brands with their products", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto("/hardware/")

    await expect(page).toHaveTitle(
      "Cockpit hardware with MobiFlight profiles (MSFS) | HubHop",
    )
    await expect(
      page.getByRole("region", {
        name: "WINCTRL (formerly WinWing) 5 profiles",
      }),
    ).toMatchAriaSnapshot(`
      - region:
        - heading "WINCTRL (formerly WinWing) 5 profiles" [level=2]:
          - link:
            - /url: /hardware/winctrl/
        - list:
          - listitem:
            - link "PAP 1 profile":
              - /url: /hardware/winctrl/#pap
          - listitem:
            - link "PFP 1 profile":
              - /url: /hardware/winctrl/#pfp
          - listitem:
            - link "FCU 1 profile":
              - /url: /hardware/winctrl/#fcu
          - listitem:
            - link "MCDU 1 profile":
              - /url: /hardware/winctrl/#mcdu
          - listitem:
            - link "RMP 1 profile":
              - /url: /hardware/winctrl/#rmp
    `)
  })

  test("Hardware pages - a brand page lists its profiles by product, with the aircraft's cheat sheet", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto("/hardware/winctrl/")

    await expect(page).toHaveTitle(
      "WINCTRL (formerly WinWing) MobiFlight profiles for your home cockpit (MSFS)",
    )
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0)
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
    await hubHopPage.goto("/hardware/rowsfire/")

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
    await expect(page).toHaveURL(/\/hardware\/winctrl\/$/)
  })
})
