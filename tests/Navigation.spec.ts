import { test, expect } from "./fixtures"

test.describe("Navigation", () => {
  test.beforeEach(async ({ hubHopPage }) => {
    await hubHopPage.goto("/")
  })

  test("Navigation - navbar links open each page", async ({ page }) => {
    const nav = page.getByRole("navigation")

    await test.step("Presets", async () => {
      await nav.getByRole("link", { name: "Presets" }).click()
      await expect(page).toHaveURL(/\/presets\/$/)
    })
    await test.step("Tools", async () => {
      await nav.getByRole("link", { name: "Tools" }).click()
      await expect(page).toHaveURL(/\/tools\/$/)
      await expect(
        page.getByRole("heading", { name: "Potentiometer RPN-Tool" }),
      ).toBeVisible()
    })
    await test.step("Stats", async () => {
      await nav.getByRole("link", { name: "Stats" }).click()
      await expect(page).toHaveURL(/\/stats\/$/)
      await expect(
        page.getByRole("heading", { name: "General statistics" }),
      ).toBeVisible()
    })
    await test.step("Home", async () => {
      await nav.getByRole("link", { name: "Home" }).click()
      await expect(
        page.getByRole("heading", { name: "Create, Share, Improve" }),
      ).toBeVisible()
    })
  })

  test("Navigation - footer shows the build number", async ({ page }) => {
    // "dev" locally; the GitHub run number and commit in deployed builds
    await expect(page.locator("footer")).toContainText(/Build (dev|\d+)/)
  })

  test("Navigation - footer links", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "Join us on Discord" }),
    ).toHaveAttribute("href", /discord\.gg/)

    await page.getByRole("link", { name: "Terms of Service" }).click()
    await expect(page).toHaveURL(/\/terms\/$/)

    await page.getByRole("link", { name: "Privacy Policy" }).click()
    await expect(page).toHaveURL(/\/privacy\/$/)
  })
})
