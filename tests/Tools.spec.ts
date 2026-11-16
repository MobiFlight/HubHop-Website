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
})
