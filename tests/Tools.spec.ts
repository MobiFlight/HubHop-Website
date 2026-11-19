import { test, expect } from "./fixtures"

test.describe("Tools", () => {
  test.beforeEach(async ({ hubHopPage }) => {
    await hubHopPage.goto("/tools/")
  })

  test("Tools - RPN tool shows a placeholder until a range is set", async ({
    page,
  }) => {
    await expect(page.getByRole("textbox").last()).toHaveValue(
      "RPN Code will be displayed here",
    )
  })

  test("Tools - RPN tool generates code for Arduino and aileron", async ({
    page,
  }) => {
    const selects = page.getByRole("combobox")

    await test.step("Choose device and event presets", async () => {
      await selects.nth(0).selectOption({ label: "Arduino" })
      await selects.nth(1).selectOption({ label: "Aileron" })
    })

    const code = page.getByRole("textbox").last()
    await expect(code).toHaveValue(/^@ /)
    await expect(code).toHaveValue(/\(>K:AILERON_SET\)$/)
  })

  test("Tools - RPN tool uses typed ranges and can invert the event range", async ({
    page,
  }) => {
    const fields = page.getByRole("textbox")
    const code = fields.last()

    await test.step("Type a device range and choose flaps", async () => {
      await page.getByRole("combobox").nth(0).selectOption({ label: "Custom" })
      await fields.nth(0).fill("100")
      await fields.nth(1).fill("900")
      await page.getByRole("combobox").nth(1).selectOption({ label: "Flaps" })
      await expect(code).toHaveValue(
        "@ 100 - 20.4788 * 0 max 16383 min (>K:FLAPS_SET)",
      )
    })

    await test.step("Invert the event range", async () => {
      await page.getByRole("button", { name: "Invert Values" }).click()
      await expect(code).toHaveValue(
        "@ 100 - -20.4788 * 16383 + 0 max 16383 min (>K:FLAPS_SET)",
      )
    })
  })
})
