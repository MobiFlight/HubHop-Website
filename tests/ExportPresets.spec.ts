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
})
