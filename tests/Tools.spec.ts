import { test, expect } from "@/tests/fixtures"
import type { Page } from "@playwright/test"

/** Picks an option of a shadcn Select */
const choose = async (page: Page, select: string, option: string) => {
  await page.getByRole("combobox", { name: select }).click()
  await page.getByRole("option", { name: option, exact: true }).click()
}

test.describe("Tools", () => {
  test.beforeEach(async ({ hubHopPage }) => {
    await hubHopPage.goto("/tools/")
  })

  test("Tools - RPN tool shows a placeholder until a range is set", async ({
    page,
  }) => {
    await expect(
      page.getByRole("textbox", { name: "Generated RPN Code" }),
    ).toHaveValue("RPN Code will be displayed here")
  })

  test("Tools - RPN tool generates code for Arduino and aileron", async ({
    page,
  }) => {
    await test.step("Choose device and event presets", async () => {
      await choose(page, "Device preset", "Arduino")
      await choose(page, "Event preset", "Aileron")
    })

    const code = page.getByRole("textbox", { name: "Generated RPN Code" })
    await expect(code).toHaveValue(/^@ /)
    await expect(code).toHaveValue(/\(>K:AILERON_SET\)$/)
  })

  test("Tools - RPN tool uses typed ranges and can invert the event range", async ({
    page,
  }) => {
    const code = page.getByRole("textbox", { name: "Generated RPN Code" })

    await test.step("Type a device range and choose flaps", async () => {
      await choose(page, "Device preset", "Custom")
      await page.getByLabel("Min device output range").fill("100")
      await page.getByLabel("Max device output range").fill("900")
      await choose(page, "Event preset", "Flaps")
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
