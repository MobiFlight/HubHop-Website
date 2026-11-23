import { test, expect } from "@/tests/fixtures"

test.describe("Navigation", () => {
  test.beforeEach(async ({ hubHopPage }) => {
    await hubHopPage.goto("/")
  })

  test("Navigation - navbar links open each page", async ({ page }) => {
    const nav = page.getByRole("navigation")

    await test.step("Presets", async () => {
      await nav.getByRole("link", { name: "Presets" }).click()
      await expect(page).toHaveURL(/\/presets\/msfs\/$/)
    })
    await test.step("Aircraft", async () => {
      await nav.getByRole("link", { name: "Aircraft" }).click()
      await expect(page).toHaveURL(/\/aircraft\/msfs\/$/)
      await expect(
        page.getByRole("heading", {
          name: "MSFS aircraft preset cheat sheets",
        }),
      ).toBeVisible()
    })
    await test.step("Profiles", async () => {
      await nav.getByRole("link", { name: "Profiles" }).click()
      await expect(page).toHaveURL(/\/profiles\/msfs\/$/)
      await expect(
        page.getByRole("heading", {
          name: "MobiFlight profiles that make your hardware plug-and-play",
        }),
      ).toBeVisible()
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
        page.getByRole("heading", {
          name: "Get the most out of your flight sim hardware",
        }),
      ).toBeVisible()
    })
  })

  test("Navigation - footer shows the build number", async ({ page }) => {
    // "dev" locally; the GitHub run number and commit in deployed builds
    await expect(page.locator("footer")).toContainText(/Build (dev|\d+)/)
  })

  test("Navigation - footer links", async ({ page }) => {
    const footer = page.getByRole("contentinfo")
    await expect(
      footer.getByRole("link", { name: "Join us on Discord" }),
    ).toHaveAttribute("href", /discord\.gg/)

    await footer.getByRole("link", { name: "Terms of Service" }).click()
    await expect(page).toHaveURL(/\/terms\/$/)

    await footer.getByRole("link", { name: "Privacy Policy" }).click()
    await expect(page).toHaveURL(/\/privacy\/$/)
  })
})
