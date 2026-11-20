import { test, expect } from "./fixtures"

test.describe("Home page", () => {
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

  test("Home - View contributions opens the preset list", async ({ page }) => {
    await page.getByRole("button", { name: "View contributions" }).click()
    await expect(page).toHaveURL(/\/presets\/msfs2020\/$/)
    await expect(page.getByRole("table")).toBeVisible()
  })
})
