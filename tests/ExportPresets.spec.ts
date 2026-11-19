import { test, expect, authFile } from "./fixtures"

test.describe("Export presets", () => {
  test.use({ storageState: authFile.user })

  test("Export presets - downloads events.txt for the WASM module", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage()
    await page.getByRole("button", { name: "Export presets" }).click()
    await expect(
      page.getByRole("heading", { name: "Export Presets" }),
    ).toBeVisible()

    const download = page.waitForEvent("download")
    await page
      .getByRole("button", { name: "events.txt" })
      .and(page.locator(":enabled"))
      .click()

    expect((await download).suggestedFilename()).toBe("events.txt")
  })

  test("Export presets - cancel and the close button hide the dialog", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage()
    const heading = page.getByRole("heading", { name: "Export Presets" })

    await test.step("Cancel", async () => {
      await page.getByRole("button", { name: "Export presets" }).click()
      await expect(heading).toBeVisible()
      await page.getByRole("button", { name: "Cancel" }).click()
      await expect(heading).toHaveCount(0)
    })

    await test.step("Close button", async () => {
      await page.getByRole("button", { name: "Export presets" }).click()
      await expect(heading).toBeVisible()
      await page.getByRole("button", { name: "Close dialog" }).click()
      await expect(heading).toHaveCount(0)
    })
  })
})
