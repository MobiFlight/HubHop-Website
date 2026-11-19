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

    await page.getByRole("button", { name: /MSFS 2020.*X-Plane/ }).click()

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
})
