import { test, expect } from "@/tests/fixtures"
import {
  matchProfile,
  profilesByAircraft,
  type FlightsimAddon,
  type MatchableAircraft,
} from "@/lib/flightsimProfiles"

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

test.describe("MobiFlight profiles - cheat sheet", () => {
  test("MobiFlight profiles - a cheat sheet shows the newest profiles, links to them and shows all on request", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto("/aircraft/msfs/asobo/a320neo/")

    await test.step("The header and the sidebar link to the profiles", async () => {
      await expect(
        page.getByRole("link", { name: "7 on flightsim.to" }),
      ).toHaveAttribute("href", "#mobiflight-profiles")
      await expect(
        page
          .getByRole("navigation", { name: "Systems" })
          .getByRole("link", { name: "MobiFlight profiles 7" }),
      ).toHaveAttribute("href", "#mobiflight-profiles")
    })

    const section = page.getByRole("region", {
      name: "MobiFlight profiles on flightsim.to",
    })
    await expect(section.getByRole("listitem")).toHaveCount(6)
    await expect(section.getByRole("listitem").first()).toMatchAriaSnapshot(`
      - link "Asobo A320neo | WinWing FCU | MobiFlight Profile by Test Pilot 1 · rated 4.5 Updated 20 Nov 2026 View on flightsim.to":
        - /url: https://flightsim.to/addon/900001/asobo-a320neo-profile-1
    `)

    await test.step("Show all profiles", async () => {
      await section.getByRole("button", { name: "Show all 7 profiles" }).click()
      await expect(section.getByRole("listitem")).toHaveCount(7)
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
      page.getByRole("region", { name: "MobiFlight profiles on flightsim.to" }),
    ).toHaveCount(0)
    await expect(page.getByText("on flightsim.to")).toHaveCount(0)
  })
})
