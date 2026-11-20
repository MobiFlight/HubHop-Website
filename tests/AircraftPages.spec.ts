import { test, expect } from "./fixtures"
import {
  aircraftList,
  aircraftSheet,
  aircraftSystemUrl,
  aircraftUrl,
  isIndexed,
  largeSystems,
  previewCounts,
  systemSheets,
  SYSTEM_PREVIEW,
} from "../lib/aircraftPages"
import type { Preset } from "../interfaces/preset"

const preset = (fields: Partial<Preset>): Preset => ({
  id: String(Math.random()),
  vendor: "FenixSim",
  aircraft: "A320",
  system: "FCU",
  label: "AP1 push",
  code: "1 (>L:S_FCU_AP1)",
  presetType: "Input",
  version: 1,
  author: "Jaime",
  ...fields,
})

const many = (count: number, fields: Partial<Preset>) =>
  Array.from({ length: count }, (_, index) =>
    preset({ label: `Preset ${String(index).padStart(2, "0")}`, ...fields }),
  )

test.describe("Aircraft pages - data", () => {
  test("Aircraft pages - URLs use the sim's URL name and slugs", () => {
    expect(aircraftUrl("msfs2020", "fenixsim", "a320")).toBe(
      "/aircraft/msfs/fenixsim/a320/",
    )
    expect(aircraftSystemUrl("xplane", "zibo", "b737-800", "fms")).toBe(
      "/aircraft/xplane/zibo/b737-800/fms/",
    )
  })

  test("Aircraft pages - spellings that share a slug share a page, named after the most used one", () => {
    const list = aircraftList([
      preset({ vendor: "VSkyLabs" }),
      preset({ vendor: "VSkyLabs" }),
      preset({ vendor: "vskylabs" }),
      preset({ vendor: "Asobo", aircraft: "C172" }),
    ])
    expect(list).toEqual([
      {
        vendor: "Asobo",
        vendorSlug: "asobo",
        aircraft: "C172",
        aircraftSlug: "c172",
        presets: 1,
      },
      {
        vendor: "VSkyLabs",
        vendorSlug: "vskylabs",
        aircraft: "A320",
        aircraftSlug: "a320",
        presets: 3,
      },
    ])
  })

  test("Aircraft pages - aircraft with fewer than 10 presets aren't indexed", () => {
    expect(isIndexed(9)).toBe(false)
    expect(isIndexed(10)).toBe(true)
  })

  test("Aircraft pages - a cheat sheet shows up to 30 presets per system, split between inputs and outputs", () => {
    expect(previewCounts(10, 5, 30)).toEqual({ inputs: 10, outputs: 5 })
    expect(previewCounts(40, 40, 30)).toEqual({ inputs: 15, outputs: 15 })
    // what one side doesn't need goes to the other
    expect(previewCounts(40, 4, 30)).toEqual({ inputs: 26, outputs: 4 })
    expect(previewCounts(3, 40, 30)).toEqual({ inputs: 3, outputs: 27 })
  })

  test("Aircraft pages - systems are grouped, sorted and split into inputs and outputs", () => {
    const [efis, fcu] = systemSheets([
      ...many(20, { system: "FCU" }),
      ...many(20, { system: "FCU", presetType: "Output" }),
      preset({ system: "EFIS", label: "FD on" }),
      preset({
        system: "Efis",
        label: "LS on",
        presetType: "Input (Potentiometer)",
      }),
    ])
    expect(efis).toMatchObject({
      name: "EFIS",
      slug: "efis",
      total: 2,
      inputCount: 2,
      outputCount: 0,
    })
    expect(efis.inputs.map((entry) => entry.label)).toEqual(["FD on", "LS on"])
    expect(fcu).toMatchObject({ total: 40, inputCount: 20, outputCount: 20 })
    expect(fcu.inputs).toHaveLength(15)
    expect(fcu.outputs).toHaveLength(15)
    expect(fcu.inputs[0].label).toBe("Preset 00")
  })

  test("Aircraft pages - systems with more than 30 presets get a page of their own", () => {
    const presets = [
      ...many(SYSTEM_PREVIEW + 1, { system: "FCU" }),
      ...many(SYSTEM_PREVIEW, { system: "EFIS" }),
    ]
    expect(largeSystems(presets)).toEqual(["fcu"])
    expect(systemSheets(presets, Infinity)[1].inputs).toHaveLength(31)
  })

  test("Aircraft pages - the header shows the newest change and the top contributors", () => {
    const sheet = aircraftSheet([
      preset({ author: "Jaime", createdDate: "2026-11-19T10:00:00.000Z" }),
      preset({ author: "Jaime", createdDate: "2026-01-01T10:00:00.000Z" }),
      preset({ author: "EddiZ" }),
      preset({ author: "Adnanso" }),
      preset({ author: "mkn" }),
      preset({ author: "mkn" }),
    ])
    expect(sheet.lastChange).toBe("2026-11-19T10:00:00.000Z")
    expect(sheet.topContributors).toEqual([
      { name: "Jaime", presets: 2 },
      { name: "mkn", presets: 2 },
      { name: "Adnanso", presets: 1 },
    ])
  })
})

test.describe("Aircraft pages", () => {
  test("Aircraft pages - the index lists the aircraft by maker", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto("/aircraft/msfs/")

    await expect(page.getByRole("main")).toMatchAriaSnapshot(`
      - heading "MSFS aircraft preset cheat sheets" [level=1]
      - paragraph: 3 aircraft from 2 makers. Pick yours to see every preset by system.
      - radiogroup "Simulator":
        - radio "MSFS" [checked]
        - radio "X-Plane"
      - region "Asobo":
        - heading "Asobo" [level=2]
        - list:
          - listitem:
            - link "A320neo 8":
              - /url: /aircraft/msfs/asobo/a320neo/
          - listitem:
            - link "C172 5":
              - /url: /aircraft/msfs/asobo/c172/
      - region "FlyByWire":
        - heading "FlyByWire" [level=2]
        - list:
          - listitem:
            - link "A32NX 4":
              - /url: /aircraft/msfs/flybywire/a32nx/
    `)
  })

  test("Aircraft pages - the sim switch opens the other sim's index", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto("/aircraft/msfs/")

    await page.getByRole("radio", { name: "X-Plane" }).click()

    await expect(page).toHaveURL(/\/aircraft\/xplane\/$/)
    await expect(page.getByRole("link", { name: "B738 2" })).toHaveAttribute(
      "href",
      "/aircraft/xplane/laminar-research/b738/",
    )
  })

  test("Aircraft pages - a cheat sheet shows every system with inputs and outputs", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto("/aircraft/msfs/asobo/a320neo/")

    await expect(page).toHaveTitle(
      "Asobo A320neo MobiFlight presets — cheat sheet for every switch (MSFS)",
    )
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Asobo A320neo preset cheat sheet",
    )
    await expect(page.getByRole("navigation", { name: "breadcrumb" }))
      .toMatchAriaSnapshot(`
      - list:
        - listitem:
          - link "Aircraft":
            - /url: /aircraft/msfs/
        - listitem:
          - link "Asobo":
            - /url: /aircraft/msfs/#asobo
        - listitem:
          - link "A320neo"
    `)
    await expect(
      page.getByRole("link", { name: "Open in preset search →" }),
    ).toHaveAttribute("href", "/presets/msfs/asobo/a320neo/")
    await expect(page.getByRole("navigation", { name: "Systems" }))
      .toMatchAriaSnapshot(`
      - list:
        - listitem:
          - link "Autopilot 5":
            - /url: "#autopilot"
        - listitem:
          - link "Lights 3":
            - /url: "#lights"
    `)
    await expect(page.getByRole("region", { name: "Lights 3 presets" }))
      .toMatchAriaSnapshot(`
      - heading "Lights 3 presets" [level=2]
      - heading "Inputs — what you press (3)" [level=3]
      - list:
        - listitem:
          - text: Landing lights off
          - code: (>K:TEST_0007)
          - text: by Test Author
        - listitem:
          - text: Landing lights on
          - code: (>K:TEST_0006)
          - text: by Test User
        - listitem:
          - text: Strobe toggle
          - code: (>K:TEST_0008)
          - text: by Test Author
      - heading "Outputs — what lights up (0)" [level=3]
      - paragraph: None yet
    `)
    await expect(
      page.getByRole("region", { name: "More from Asobo" }).getByRole("link"),
    ).toHaveAttribute("href", "/aircraft/msfs/asobo/c172/")
  })

  test("Aircraft pages - cheat sheets of aircraft with fewer than 10 presets aren't indexed", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto("/aircraft/msfs/asobo/a320neo/")

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex",
    )
  })
})
