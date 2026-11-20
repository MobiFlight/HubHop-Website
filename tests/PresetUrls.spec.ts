import { test, expect } from "@/tests/fixtures"
import {
  parsePresetsPath,
  presetListUrl,
  presetUrl,
  slugify,
} from "@/lib/presetUrls"

const BATTERY_ID = "00000000-0000-4000-8000-000000000009"
const BATTERY_URL = `/presets/msfs/asobo/c172/battery-master-on-${BATTERY_ID}/`

test.describe("Preset URLs", () => {
  test("Preset URLs - names become lowercase slugs", () => {
    expect(slugify("Fly By Wire")).toBe("fly-by-wire")
    expect(slugify("A350 (2020)")).toBe("a350-2020")
    expect(slugify("HSI to/from")).toBe("hsi-to-from")
    expect(slugify("INSTR – Avionic ON")).toBe("instr-avionic-on")
    expect(slugify("Škoda")).toBe("skoda")
  })

  test("Preset URLs - vendor and aircraft are path segments, other filters query parameters", () => {
    expect(presetListUrl({ sim: "msfs2020" })).toBe("/presets/msfs/")
    expect(
      presetListUrl({
        sim: "msfs2020",
        vendor: "fenixsim",
        aircraft: "a320",
        search: "apu",
        system: "Lights",
      }),
    ).toBe("/presets/msfs/fenixsim/a320/?search=apu&system=Lights")
    // the path needs the vendor before the aircraft
    expect(presetListUrl({ sim: "xplane", aircraft: "c172" })).toBe(
      "/presets/xplane/?aircraft=c172",
    )
  })

  test("Preset URLs - a preset URL ends with its id", () => {
    expect(
      presetUrl("msfs2020", {
        id: BATTERY_ID,
        vendor: "Asobo",
        aircraft: "C172",
        label: "Battery master on",
      }),
    ).toBe(BATTERY_URL)
  })

  test("Preset URLs - paths are parsed into list, preset or not found", () => {
    expect(parsePresetsPath([])).toEqual({ kind: "default" })
    expect(parsePresetsPath(["msfs", "asobo"])).toEqual({
      kind: "list",
      sim: "msfs2020",
      vendor: "asobo",
      aircraft: undefined,
    })
    expect(parsePresetsPath(["msfs", "a", "b", `label-${BATTERY_ID}`])).toEqual(
      { kind: "preset", sim: "msfs2020", id: BATTERY_ID },
    )
    // older presets have MongoDB ids
    expect(
      parsePresetsPath([
        "xplane",
        "a",
        "b",
        "ap-engage-650000000000000000000001",
      ]),
    ).toEqual({ kind: "preset", sim: "xplane", id: "650000000000000000000001" })
    // links from before the sim was called "msfs" in URLs
    expect(parsePresetsPath(["msfs2020", "asobo", "c172"])).toEqual({
      kind: "moved",
      path: "/presets/msfs/asobo/c172/",
    })
    expect(parsePresetsPath(["msfs2024"])).toEqual({
      kind: "unknownSim",
      sim: "msfs2024",
    })
    expect(parsePresetsPath(["msfs", "a", "b", "no-id"])).toEqual({
      kind: "notFound",
    })
  })

  test("Preset URLs - /presets/ opens the last used sim", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage("xplane/")
    await presetsPage.gotoPage()

    await expect(page).toHaveURL(/\/presets\/xplane\/$/)
    await expect(presetsPage.row("Beacon toggle")).toHaveCount(1)
  })

  test("Preset URLs - switching the sim keeps the other filters", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage("msfs/?search=toggle")

    await presetsPage.xplaneSwitch.click()

    await expect(page).toHaveURL(/\/presets\/xplane\/\?search=toggle$/)
    await expect(presetsPage.row("Beacon toggle")).toHaveCount(1)
  })

  test("Preset URLs - old preset list links open the new URL", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage("?vendor=Asobo&aircraft=C172&system=Engine")

    await expect(page).toHaveURL(
      /\/presets\/msfs\/asobo\/c172\/\?system=Engine$/,
    )
    await expect(presetsPage.rows).toHaveCount(2)
  })

  test("Preset URLs - old preset links open the new URL", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto(`/preset/?simType=msfs2020&id=${BATTERY_ID}`)

    await expect(page).toHaveURL(new RegExp(`${BATTERY_URL}$`))
    await expect(
      page.getByRole("heading", { name: "Battery master on" }),
    ).toBeVisible()
  })

  test("Preset URLs - an outdated name in a preset URL is corrected", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto(
      `/presets/msfs/old-vendor/old-aircraft/old-name-${BATTERY_ID}/`,
    )

    await expect(page).toHaveURL(new RegExp(`${BATTERY_URL}$`))
  })

  test("Preset URLs - msfs2020 links open the msfs URL with their filters", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage("msfs2020/asobo/c172/?system=Engine")

    await expect(page).toHaveURL(
      /\/presets\/msfs\/asobo\/c172\/\?system=Engine$/,
    )
    await expect(presetsPage.rows).toHaveCount(2)
  })

  test("Preset URLs - an unknown sim shows page not found", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto("/presets/msfs2024/")

    await expect(
      page.getByRole("heading", { name: "Page not found" }),
    ).toBeVisible()
    await expect(
      page.getByText('HubHop has no presets for "msfs2024".'),
    ).toBeVisible()
  })
})
