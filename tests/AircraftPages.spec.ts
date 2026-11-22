import { test, expect } from "@/tests/fixtures"
import {
  aircraftList,
  aircraftSheet,
  aircraftSystemUrl,
  aircraftUrl,
  sheetDescription,
  isIndexed,
  largeSystems,
  previewCounts,
  systemSheets,
  SYSTEM_PREVIEW,
} from "@/lib/aircraftPages"
import type { Preset } from "@/interfaces/preset"
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import sharp from "sharp"

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

  test("Aircraft pages - a cheat sheet shows up to 20 presets per system, split between inputs and outputs", () => {
    expect(SYSTEM_PREVIEW).toBe(20)
    expect(previewCounts(10, 5, 20)).toEqual({ inputs: 10, outputs: 5 })
    expect(previewCounts(40, 40, 20)).toEqual({ inputs: 10, outputs: 10 })
    // what one side doesn't need goes to the other
    expect(previewCounts(40, 4, 20)).toEqual({ inputs: 16, outputs: 4 })
    expect(previewCounts(3, 40, 20)).toEqual({ inputs: 3, outputs: 17 })
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
    expect(fcu.inputs).toHaveLength(10)
    expect(fcu.outputs).toHaveLength(10)
    expect(fcu.inputs[0].label).toBe("Preset 00")
  })

  test("Aircraft pages - systems with more than 20 presets get a page of their own", () => {
    const presets = [
      ...many(SYSTEM_PREVIEW + 1, { system: "FCU" }),
      ...many(SYSTEM_PREVIEW, { system: "EFIS" }),
    ]
    expect(largeSystems(presets)).toEqual(["fcu"])
    expect(systemSheets(presets, Infinity)[1].inputs).toHaveLength(
      SYSTEM_PREVIEW + 1,
    )
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

test.describe("Aircraft pages - texts and sitemap", () => {
  test("Aircraft pages - the description names the largest systems for home cockpit builders", () => {
    expect(
      sheetDescription(
        aircraftSheet([
          ...many(3, { system: "FCU" }),
          ...many(2, { system: "EFIS" }),
          preset({ system: "Overhead" }),
          preset({ system: "Lights" }),
        ]),
      ),
    ).toBe(
      "Build your FenixSim A320 home cockpit: 7 presets for every switch, knob and light in 4 systems, including FCU, EFIS and Lights. Copy the code and connect your hardware with MobiFlight.",
    )
    expect(sheetDescription(aircraftSheet([preset({ system: "FCU" })]))).toBe(
      "Build your FenixSim A320 home cockpit: 1 preset for every switch, knob and light in the FCU system. Copy the code and connect your hardware with MobiFlight.",
    )
  })

  test("Aircraft pages - the description names the MobiFlight profiles first", () => {
    const sheet = aircraftSheet([preset({ system: "FCU" })])
    expect(sheetDescription(sheet, 37)).toBe(
      "Build your FenixSim A320 home cockpit: 37 ready-made MobiFlight profiles and 1 preset for every switch, knob and light in the FCU system. Copy the code and connect your hardware with MobiFlight.",
    )
    expect(sheetDescription(sheet, 1)).toMatch(
      /home cockpit: 1 ready-made MobiFlight profile and 1 preset/,
    )
  })

  test("Aircraft pages - the sitemap lists pages with a canonical URL that aren't noindex", () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "sitemap-"))
    const page = (dir: string, head: string) => {
      fs.mkdirSync(path.join(out, dir), { recursive: true })
      fs.writeFileSync(
        path.join(out, dir, "index.html"),
        `<html><head>${head}</head></html>`,
      )
    }
    const canonical = (url: string) => `<link rel="canonical" href="${url}"/>`
    page("", canonical("https://hubhop.mobiflight.com/"))
    page(
      "aircraft/msfs/asobo/a320neo",
      canonical("https://hubhop.mobiflight.com/aircraft/msfs/asobo/a320neo/"),
    )
    page(
      "aircraft/msfs/asobo/c172",
      `<meta name="robots" content="noindex"/>${canonical("https://hubhop.mobiflight.com/aircraft/msfs/asobo/c172/")}`,
    )
    // the preset tool's shell has no canonical URL
    page("presets/[[...slug]]", "")

    execFileSync("node", ["scripts/sitemap.mjs", out])

    expect(fs.readFileSync(path.join(out, "sitemap.xml"), "utf8"))
      .toBe(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://hubhop.mobiflight.com/</loc></url>
  <url><loc>https://hubhop.mobiflight.com/aircraft/msfs/asobo/a320neo/</loc></url>
</urlset>
`)
    expect(fs.readFileSync(path.join(out, "robots.txt"), "utf8")).toContain(
      "Sitemap: https://hubhop.mobiflight.com/sitemap.xml",
    )
    fs.rmSync(out, { recursive: true })
  })

  test("Aircraft pages - every cheat sheet gets a link preview image after the build", async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "og-"))
    const dir = path.join(out, "aircraft", "msfs", "fenixsim", "a320")
    fs.mkdirSync(path.join(dir, "fcu"), { recursive: true })
    const pageProps = {
      sim: "msfs2020",
      sheet: {
        vendor: "FenixSim",
        aircraft: "A320",
        presets: 2287,
        systems: [{ name: "FCU" }, { name: "EFIS" }],
      },
      profiles: [{ id: 1 }],
    }
    fs.writeFileSync(
      path.join(dir, "index.html"),
      `<html><body><script id="__NEXT_DATA__" type="application/json">${JSON.stringify({ props: { pageProps } })}</script></body></html>`,
    )
    // a system page is no cheat sheet
    fs.writeFileSync(path.join(dir, "fcu", "index.html"), "<html></html>")

    execFileSync("node", ["scripts/ogImages.mjs", out])

    const image = path.join(
      out,
      "og",
      "aircraft",
      "msfs",
      "fenixsim",
      "a320.jpg",
    )
    expect(await sharp(image).metadata()).toMatchObject({
      format: "jpeg",
      width: 1200,
      height: 630,
    })
    expect(
      fs.readdirSync(path.join(out, "og", "aircraft", "msfs", "fenixsim")),
    ).toEqual(["a320.jpg"])
    fs.rmSync(out, { recursive: true })
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
      "Asobo A320neo home cockpit presets for MobiFlight (MSFS)",
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

  test("Aircraft pages - a cheat sheet has a canonical URL, preview tags and breadcrumb data", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto("/aircraft/msfs/asobo/c172/")
    const url = "https://hubhop.mobiflight.com/aircraft/msfs/asobo/c172/"

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      url,
    )
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      url,
    )
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Asobo C172 home cockpit presets for MobiFlight (MSFS)",
    )
    // its own image, drawn after the build (scripts/ogImages.mjs)
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      "https://hubhop.mobiflight.com/og/aircraft/msfs/asobo/c172.jpg",
    )
    const breadcrumbs = JSON.parse(
      (await page
        .locator('script[type="application/ld+json"]')
        .textContent()) ?? "",
    )
    expect(breadcrumbs.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Aircraft",
        item: "https://hubhop.mobiflight.com/aircraft/msfs/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Asobo C172",
        item: url,
      },
    ])
  })

  test("Aircraft pages - the preset list of an aircraft links to its cheat sheet", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage("msfs/asobo/c172/")

    await expect(
      page.getByRole("link", { name: "Cheat sheet for the Asobo C172 →" }),
    ).toHaveAttribute("href", "/aircraft/msfs/asobo/c172/")
  })

  test("Aircraft pages - a single preset links to its cheat sheet and isn't indexed", async ({
    presetViewPage,
    page,
  }) => {
    await presetViewPage.gotoPage("00000000-0000-4000-8000-000000000009")

    await expect(
      page.getByRole("link", {
        name: "All presets of the Asobo C172: cheat sheet →",
      }),
    ).toHaveAttribute("href", "/aircraft/msfs/asobo/c172/")
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex",
    )
  })

  test("Aircraft pages - the search opens the preset search with the aircraft selected", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto("/aircraft/msfs/asobo/a320neo/")

    await page
      .getByRole("searchbox", { name: "Search the Asobo A320neo presets" })
      .fill("AP master")
    await page.keyboard.press("Enter")

    await expect(page).toHaveURL(
      /\/presets\/msfs\/asobo\/a320neo\/\?search=AP\+master$/,
    )
    await expect(
      page.getByRole("row", { name: /AP master toggle/ }),
    ).toHaveCount(1)
    await expect(
      page.getByRole("row", { name: /AP heading hold/ }),
    ).toHaveCount(0)
  })
})
