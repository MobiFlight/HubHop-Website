import { test, expect } from "@/tests/fixtures"

test.describe("Legal pages", () => {
  test("Legal - terms page shows the imprint", async ({ hubHopPage, page }) => {
    await hubHopPage.goto("/terms/")
    await expect(
      page.getByRole("heading", { name: "Impressum / Terms" }),
    ).toBeVisible()
  })

  test("Legal - privacy page shows the privacy policy", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto("/privacy/")
    await expect(
      page.getByRole("heading", { name: "Datenschutzerklärung:" }),
    ).toBeVisible()
  })
})
