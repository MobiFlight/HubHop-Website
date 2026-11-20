import { test, expect } from "./fixtures"
import { recentChanges, todaysActivity } from "../lib/recentActivity"
import msfsStatsData from "./data/msfs-stats.testdata.json"
import type { Statistics } from "../interfaces/preset"

const msfsStats = msfsStatsData as unknown as Statistics

// the day the newest test preset was added
const NEWEST_ADDED_DAY = new Date("2024-03-01T12:00:00Z")

test.describe("Home page", () => {
  test.use({ timezoneId: "UTC" })

  test.beforeEach(async ({ hubHopPage }) => {
    await hubHopPage.goto("/")
  })

  test("Home - shows the hero section", async ({ page }) => {
    await expect(page).toHaveTitle("Home | Hubhop by Mobiflight")
    await expect(
      page.getByRole("heading", { name: "Create, Share, Improve" }),
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: /Created and sponsored by Mobiflight/ }),
    ).toHaveAttribute("href", "https://www.mobiflight.com/en/index.html")
  })

  test("Home - search opens the preset list of the selected sim", async ({
    page,
  }) => {
    const search = page.getByRole("searchbox", { name: "Search presets" })
    await expect(search).toHaveAttribute(
      "placeholder",
      "Search 17 presets — try “Fenix A320 APU”",
    )

    await search.fill("apu")
    await page.getByRole("button", { name: "Search" }).click()

    await expect(page).toHaveURL(/\/presets\/msfs2020\/\?search=apu$/)
    await expect(page.getByRole("table")).toBeVisible()
  })

  test("Home - search for X-Plane", async ({ page }) => {
    await page.getByRole("radio", { name: "X-Plane" }).click()
    const search = page.getByRole("searchbox", { name: "Search presets" })
    await expect(search).toHaveAttribute(
      "placeholder",
      "Search 5 presets — try “C172 beacon”",
    )

    await search.fill("beacon")
    await search.press("Enter")

    await expect(page).toHaveURL(/\/presets\/xplane\/\?search=beacon$/)
  })

  test("Home - an empty search opens all presets", async ({ page }) => {
    await page.getByRole("button", { name: "Search" }).click()

    await expect(page).toHaveURL(/\/presets\/msfs2020\/$/)
  })

  test("Home - popular aircraft link to their presets", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "Asobo A320neo" }),
    ).toHaveAttribute("href", "/presets/msfs2020/asobo/a320neo/")

    await test.step("X-Plane shows its own popular aircraft", async () => {
      await page.getByRole("radio", { name: "X-Plane" }).click()
      await expect(
        page.getByRole("link", { name: "Laminar Research C172" }),
      ).toHaveAttribute("href", "/presets/xplane/laminar-research/c172/")
    })
  })

  test("Home - switching the sim shows its statistics without loading them again", async ({
    hubHopPage,
    page,
  }) => {
    await expect(
      page.getByRole("link", { name: "Asobo A320neo" }),
    ).toBeVisible()

    await page.getByRole("radio", { name: "X-Plane" }).click()
    await expect(
      page.getByRole("link", { name: "Laminar Research C172" }),
    ).toBeVisible()
    await expect(page.locator("body")).toHaveClass(/xplane/)

    await page.getByRole("radio", { name: "MSFS" }).click()
    await expect(
      page.getByRole("link", { name: "Asobo A320neo" }),
    ).toBeVisible()
    await expect(page.locator("body")).not.toHaveClass(/xplane/)

    const statsRequests = hubHopPage.requests
      .filter(({ path }) => path.endsWith("/statistics/general"))
      .map(({ path }) => path)
      .sort()
    expect(statsRequests).toEqual([
      "/msfs2020/statistics/general",
      "/xplane/statistics/general",
    ])
  })

  test("Home - stats strip shows library size and leaders", async ({
    page,
  }) => {
    const numbers = page.getByRole("region", { name: "HubHop in numbers" })
    await expect(numbers).toMatchAriaSnapshot(`
      - term: presets in the library
      - definition: "17"
      - term: community contributors
      - definition: "2"
      - term: presets for the Asobo A320neo — the most covered aircraft
      - definition: "8"
      - term: presets by Test Author, top contributor
      - definition: "120"
    `)
  })

  test("Home - recent changes list the newest presets first", async ({
    page,
  }) => {
    const list = page
      .getByRole("region", { name: "Fresh from the community" })
      .getByRole("listitem")
    await expect(list).toHaveCount(5)
    await expect(list.first()).toContainText("AddedAP master toggle")
    await expect(list.nth(1)).toContainText("UpdatedAP master toggle")
    await expect(list.nth(1)).toContainText("by Test User")
    await expect(list.nth(2)).toContainText("AP NAV mode")
    await expect(
      list.first().getByRole("link", { name: "AP master toggle" }),
    ).toHaveAttribute(
      "href",
      "/presets/msfs2020/asobo/a320neo/ap-master-toggle-00000000-0000-4000-8000-000000000001/",
    )
    await expect(
      page.getByRole("link", { name: "All recent changes" }),
    ).toHaveAttribute("href", "/stats/")
  })

  test("Home - no activity note without presets added today", async ({
    page,
  }) => {
    await expect(page.getByText(/new presets? for the/)).toHaveCount(0)
  })
})

test.describe("Home page - activity", () => {
  test.use({ timezoneId: "UTC" })

  test("Home - presets added today are announced", async ({
    hubHopPage,
    page,
  }) => {
    await page.clock.setFixedTime(NEWEST_ADDED_DAY)
    await hubHopPage.goto("/")

    await expect(
      page.getByText("1 new preset for the Asobo A320neo today"),
    ).toBeVisible()
  })
})

test.describe("Home page - recent activity", () => {
  test("Recent activity - added and updated presets are merged by date", () => {
    const changes = recentChanges(msfsStats, 3)
    expect(changes.map(({ kind, preset }) => [kind, preset.label])).toEqual([
      ["added", "AP master toggle"],
      ["updated", "AP master toggle"],
      ["added", "AP NAV mode"],
    ])
    expect(changes[1].by).toBe("Test User")
  })

  test("Recent activity - the aircraft with the most presets today wins", () => {
    const preset = (aircraft: string, createdDate: string) => ({
      ...msfsStats.presetsAdded[0],
      aircraft,
      createdDate,
    })
    const today = new Date("2024-03-01T15:00:00")
    expect(
      todaysActivity(
        [
          preset("A", "2024-03-01T09:00:00"),
          preset("B", "2024-03-01T10:00:00"),
          preset("B", "2024-03-01T11:00:00"),
          preset("C", "2024-02-29T23:00:00"),
          preset("C", "2024-02-29T22:00:00"),
          preset("C", "2024-02-29T21:00:00"),
        ],
        today,
      ),
    ).toEqual({ count: 2, vendor: "Asobo", aircraft: "B" })
    expect(todaysActivity([preset("C", "2024-02-29T23:00:00")], today)).toBe(
      undefined,
    )
  })
})
