import { test, expect, authFile } from "./fixtures"
import type { Page } from "@playwright/test"

// Screenshots of the main pages, to review every visual change of the
// shadcn/ui migration (#154). Update them with `--update-snapshots` when a
// change is intended, and review the new images in the pull request.

// Fixed time, locale and time zone: dates in tables are rendered with toLocaleString()
test.use({ locale: "en-US", timezoneId: "UTC" })

const themes = ["dark"] as const

const screenshotOptions = {
  fullPage: true,
  animations: "disabled",
  // anti-aliasing differs by a few pixels between the devcontainer and CI;
  // real changes are thousands of pixels (a ratio would hide them)
  maxDiffPixels: 100,
} as const

/** Makes promotions and dates deterministic. Call before the first navigation. */
const freeze = async (page: Page) => {
  await page.clock.setFixedTime(new Date("2026-01-15T12:00:00Z"))
  // the first of the best-ranked promotions
  await page.addInitScript(() => {
    Math.random = () => 0
  })
}

for (const theme of themes) {
  test.describe(`Visual - ${theme} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await freeze(page)
    })

    test(`Visual - home page in ${theme} theme`, async ({
      hubHopPage,
      page,
    }) => {
      await hubHopPage.goto("/")
      await expect(
        page.getByRole("heading", { name: "Create, Share, Improve" }),
      ).toBeVisible()
      await expect(page).toHaveScreenshot(
        `home-${theme}.png`,
        screenshotOptions,
      )
    })

    test(`Visual - preset list with an expanded row in ${theme} theme`, async ({
      presetsPage,
      page,
    }) => {
      await presetsPage.gotoPage()
      const details = await presetsPage.expand("Battery master on")
      await expect(details.getByRole("button", { name: "View" })).toBeVisible()
      await expect(page).toHaveScreenshot(
        `presets-${theme}.png`,
        screenshotOptions,
      )
    })

    test(`Visual - stats page in ${theme} theme`, async ({
      hubHopPage,
      page,
    }) => {
      await hubHopPage.goto("/stats/")
      await expect(page.getByText("Asobo - A320neo")).toBeVisible()
      await expect(page).toHaveScreenshot(
        `stats-${theme}.png`,
        screenshotOptions,
      )
    })

    test(`Visual - tools page in ${theme} theme`, async ({
      hubHopPage,
      page,
    }) => {
      await hubHopPage.goto("/tools/")
      await expect(
        page.getByRole("textbox", { name: "Generated RPN Code" }),
      ).toHaveValue("RPN Code will be displayed here")
      await expect(page).toHaveScreenshot(
        `tools-${theme}.png`,
        screenshotOptions,
      )
    })
  })
}

test.describe("Visual - preset dialogs", () => {
  test.use({ storageState: authFile.moderator })

  test.beforeEach(async ({ page, presetsPage }) => {
    await freeze(page)
    await presetsPage.gotoPage()
  })

  test("Visual - add preset dialog", async ({ page }) => {
    await page.getByRole("button", { name: "Add preset" }).click()
    const dialog = page.getByRole("dialog")
    await expect(
      dialog.getByRole("heading", { name: "Add Preset" }),
    ).toBeVisible()
    await expect(dialog).toHaveScreenshot(
      "dialog-add-preset.png",
      screenshotOptions,
    )
  })

  test("Visual - export presets dialog", async ({ page }) => {
    await page.getByRole("button", { name: "Export presets" }).click()
    const dialog = page.getByRole("dialog")
    await expect(
      dialog.getByRole("heading", { name: "Export Presets" }),
    ).toBeVisible()
    await expect(dialog).toHaveScreenshot(
      "dialog-export-presets.png",
      screenshotOptions,
    )
  })

  test("Visual - delete confirmation", async ({ page, presetsPage }) => {
    const details = await presetsPage.expand("Battery master on")
    await details.getByRole("button", { name: "Delete" }).click()
    const dialog = page.getByRole("alertdialog")
    await expect(
      dialog.getByRole("heading", { name: "Delete Preset" }),
    ).toBeVisible()
    await expect(dialog).toHaveScreenshot(
      "dialog-delete-preset.png",
      screenshotOptions,
    )
  })
})
