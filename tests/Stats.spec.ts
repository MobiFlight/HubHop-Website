import { test, expect } from "./fixtures"

test.describe("Stats", () => {
  test.beforeEach(async ({ hubHopPage }) => {
    await hubHopPage.goto("/stats/")
  })

  test("Stats - shows general statistics for MSFS", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "General statistics" }),
    ).toBeVisible()
    await expect(page.getByText("Total presets")).toBeVisible()
    await expect(page.getByText("17", { exact: true })).toBeVisible()
    await expect(page.getByText("Asobo - A320neo")).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Latest added presets" }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Latest updated presets" }),
    ).toBeVisible()
  })

  test("Stats - switching to X-Plane shows X-Plane statistics", async ({
    page,
  }) => {
    await expect(page.getByText("Asobo - A320neo")).toBeVisible()

    await page.getByRole("radio", { name: "X-Plane" }).click()

    await expect(page.getByText("Laminar Research - C172")).toBeVisible()
    await expect(page.getByText("5", { exact: true }).first()).toBeVisible()
  })

  test("Stats - expanding a latest added preset shows its details", async ({
    page,
  }) => {
    const latestAdded = page
      .locator("div")
      .filter({
        has: page.getByRole("heading", { name: "Latest added presets" }),
      })
      .last()

    await latestAdded
      .getByRole("row", { name: /AP master toggle/ })
      .getByRole("cell")
      .last()
      .click()

    await expect(
      latestAdded.getByRole("heading", { name: "AP master toggle" }),
    ).toBeVisible()
    await expect(latestAdded.getByText("(>K:TEST_0001)")).toBeVisible()
    await expect(
      latestAdded.getByText("Test description for AP master toggle"),
    ).toBeVisible()
  })

  test("Stats - contributors list counts added and updated presets", async ({
    page,
  }) => {
    await page.getByText("Total contributors").click()

    const dialog = (title: string) =>
      page
        .locator("div")
        .filter({ has: page.getByRole("heading", { name: title }) })
        .filter({ has: page.getByRole("table") })
        .last()
    const contributors = dialog("Contributors").getByRole("table").first()
    await test.step("Contributors are sorted by their presets", async () => {
      await expect(contributors.getByRole("row")).toHaveText([
        /Name.*Submissions or updates/,
        /Test Author.*16/,
        /Test User.*2/,
      ])
    })

    await test.step("Search for a contributor", async () => {
      await page.getByPlaceholder("Search contributor").fill("user")
      await expect(contributors.getByRole("row")).toHaveCount(2)
    })

    await test.step("Open the presets of a contributor", async () => {
      await contributors.getByRole("row", { name: /Test User/ }).click()
      await expect(
        page.getByRole("heading", { name: "Presets by Test User" }),
      ).toBeVisible()
      const presets = dialog("Presets by Test User").getByRole("table")
      await expect(presets.getByRole("row")).toHaveText([
        /Preset name/,
        /AP master toggle/,
        /Landing lights on/,
      ])
      await page.getByPlaceholder("Search preset").fill("landing")
      await expect(presets.getByRole("row")).toHaveText([
        /Preset name/,
        /Landing lights on/,
      ])
    })
  })
})
