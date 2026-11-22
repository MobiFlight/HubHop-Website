import { test, expect } from "@/tests/fixtures"
import {
  matchProfile,
  profilesByAircraft,
  type FlightsimAddon,
  type MatchableAircraft,
} from "@/lib/flightsimProfiles"
import { timeAgo } from "@/lib/aircraftPages"

const aircraft: MatchableAircraft[] = [
  ["PMDG", "pmdg", "B737-700", "b737-700"],
  ["PMDG", "pmdg", "B737-800 2024", "b737-800-2024"],
  ["FlightFX", "flightfx", "Citation X", "citation-x"],
  ["Fly By Wire", "fly-by-wire", "A320", "a320"],
  ["iniBuilds", "inibuilds", "A320", "a320"],
  ["iniBuilds", "inibuilds", "A330", "a330"],
  ["iniBuilds", "inibuilds", "A350 2020", "a350-2020"],
  ["iniBuilds", "inibuilds", "A350 2024", "a350-2024"],
].map(([vendor, vendorSlug, name, aircraftSlug]) => ({
  vendor,
  vendorSlug,
  aircraft: name,
  aircraftSlug,
}))

const addon = (
  title: string,
  fields: Partial<FlightsimAddon> = {},
): FlightsimAddon => ({
  id: 1,
  title,
  link: "https://flightsim.to/addon/1/profile",
  updated_at: "2026-11-01T10:00:00Z",
  ...fields,
})

test.describe("MobiFlight profiles - matching", () => {
  test("MobiFlight profiles - the title has to name the maker and the model", () => {
    expect(
      matchProfile(addon("PMDG 737-800 | WinWing PAP3"), aircraft),
    ).toEqual(["pmdg/b737-800-2024"])
    // no maker: "800" alone must not find the PMDG 737-800
    expect(
      matchProfile(addon("Hawker 800XP - WINCTRL FCU/EFIS"), aircraft),
    ).toEqual([])
  })

  test("MobiFlight profiles - nicknames and the affiliation find the aircraft", () => {
    expect(matchProfile(addon("FBW A32NX | WinWing PFP 3N"), aircraft)).toEqual(
      ["fly-by-wire/a320"],
    )
    expect(
      matchProfile(
        addon("WinWing MobiFlight Profile", {
          affiliation: { name: "FlyByWire A32NX" },
        }),
        aircraft,
      ),
    ).toEqual(["fly-by-wire/a320"])
  })

  test("MobiFlight profiles - a profile goes to every version of an aircraft, and to the first aircraft named", () => {
    expect(
      matchProfile(addon("iniBuilds A350 | WinWing FCU"), aircraft),
    ).toEqual(["inibuilds/a350-2020", "inibuilds/a350-2024"])
    // the A320 is the hardware here
    expect(
      matchProfile(
        addon("PROFIL A330 Inibuilds With Sim Gauges AIRBUS A320 PEDESTAL"),
        aircraft,
      ),
    ).toEqual(["inibuilds/a330"])
  })

  test("MobiFlight profiles - profiles per aircraft, newest update first", () => {
    const byAircraft = profilesByAircraft(
      [
        addon("iniBuilds A330 old", { id: 1, updated_at: "2026-01-01" }),
        addon("iniBuilds A330 new", { id: 2, updated_at: "2026-11-01" }),
        addon("Generic G1000 profile", { id: 3 }),
      ],
      aircraft,
    )
    expect(byAircraft.get("inibuilds/a330")?.map((p) => p.id)).toEqual([2, 1])
    expect([...byAircraft.keys()]).toEqual(["inibuilds/a330"])
  })
})

test.describe("MobiFlight profiles - dates", () => {
  test("MobiFlight profiles - updates show how long ago they were", () => {
    const now = new Date("2026-01-15T12:00:00Z").getTime()
    const ago = (iso: string) => timeAgo(iso, now)
    expect(ago("2026-01-15T08:00:00Z")).toBe("today")
    expect(ago("2026-01-14T10:00:00Z")).toBe("1 day ago")
    expect(ago("2026-01-12T10:00:00Z")).toBe("3 days ago")
    expect(ago("2026-01-08T10:00:00Z")).toBe("1 week ago")
    expect(ago("2025-12-31T10:00:00Z")).toBe("2 weeks ago")
    expect(ago("2025-12-10T10:00:00Z")).toBe("1 month ago")
    expect(ago("2024-11-01T10:00:00Z")).toBe("1 year ago")
  })
})

test.describe("MobiFlight profiles - cheat sheet", () => {
  test("MobiFlight profiles - a cheat sheet names the hardware, shows the newest profiles first, links to them and shows all on request", async ({
    hubHopPage,
    page,
  }) => {
    // "1 day ago" is calculated with the browser's clock
    await page.clock.setFixedTime(new Date("2026-01-15T12:00:00Z"))
    await hubHopPage.goto("/aircraft/msfs/asobo/a320neo/")

    await test.step("Search results and link previews mention the profiles", async () => {
      for (const selector of [
        'meta[name="description"]',
        'meta[property="og:description"]',
      ])
        await expect(page.locator(selector)).toHaveAttribute(
          "content",
          /^9 MobiFlight profiles for WINCTRL \(formerly WinWing\) PAP3, PFP 3N and FCU, Rowsfire A107, MiniCockpit miniFCU and more, plus 8 presets for every switch, knob and light of your Asobo A320neo home cockpit/,
        )
      await expect(page).toHaveTitle(
        "Asobo A320neo MobiFlight profiles and presets (MSFS)",
      )
    })

    await test.step("The profiles come first, and the header links to them", async () => {
      await expect(page.getByRole("heading", { level: 2 }).first()).toHaveText(
        "MobiFlight profiles for WINCTRL (formerly WinWing), Rowsfire and MiniCockpit",
      )
      await expect(
        page.getByRole("link", { name: "9 on flightsim.to" }),
      ).toHaveAttribute("href", "#mobiflight-profiles")
    })

    const section = page.getByRole("region", {
      name: "MobiFlight profiles for WINCTRL (formerly WinWing), Rowsfire and MiniCockpit",
    })
    await expect(section.locator("p", { hasText: /^Hardware:/ })).toHaveText(
      "Hardware: WINCTRL (formerly WinWing) PAP3, PFP 3N, FCU, MCDU · Rowsfire A107 · MiniCockpit miniFCU · Honeycomb Bravo · Thrustmaster TCA · MOZA MB7F",
    )
    await expect(section.getByRole("listitem")).toHaveCount(6)
    await expect(section.getByRole("listitem").first()).toMatchAriaSnapshot(`
      - link "Asobo A320neo | WinWing FCU | MobiFlight Profile by Test Pilot 1 · rated 4.5 · updated 1 day ago":
        - /url: https://flightsim.to/addon/900001/asobo-a320neo-profile-1
    `)
    // the exact date on hover
    await expect(section.locator("time").first()).toHaveAttribute(
      "title",
      "14 Jan 2026",
    )

    await test.step("Show all profiles", async () => {
      await section.getByRole("button", { name: "Show all 9 profiles" }).click()
      await expect(section.getByRole("listitem")).toHaveCount(9)
      await expect(section.getByRole("button")).toHaveCount(0)
    })
  })

  test("MobiFlight profiles - aircraft without profiles show no profiles section", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto("/aircraft/msfs/asobo/c172/")

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Asobo C172 preset cheat sheet",
    )
    await expect(
      page.getByRole("region", { name: /^MobiFlight profiles/ }),
    ).toHaveCount(0)
    await expect(page.getByText("on flightsim.to")).toHaveCount(0)
  })
})
