import { test, expect } from "./fixtures"
import type { Page } from "@playwright/test"

/** Events pushed by track(), without Tag Manager's own entries */
const trackedEvents = (page: Page) =>
  page.evaluate(() =>
    (window.dataLayer ?? [])
      .filter(
        (entry): entry is { event: string } =>
          Object.prototype.toString.call(entry) === "[object Object]" &&
          typeof (entry as { event?: unknown }).event === "string" &&
          !(entry as { event: string }).event.startsWith("gtm."),
      )
      .map((entry) => entry.event),
  )

const clickDiscordInFooter = async (page: Page) => {
  // the link opens Discord in a new tab; nothing must be loaded from there
  await page
    .context()
    .route("https://discord.gg/**", (route) => route.fulfill({ body: "" }))
  const popup = page.waitForEvent("popup")
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Join us on Discord" })
    .click()
  await (await popup).close()
}

test.describe("Analytics", () => {
  test.describe("with analytics accepted", () => {
    test.use({ cookieConsent: "accepted" })

    test("Analytics - a click on Discord is tracked", async ({
      hubHopPage,
      page,
    }) => {
      await hubHopPage.goto("/")

      await clickDiscordInFooter(page)

      await expect.poll(() => trackedEvents(page)).toEqual(["discord_click"])
    })

    test("Analytics - a homepage search is tracked with its sim, without the search text", async ({
      hubHopPage,
      page,
    }) => {
      await hubHopPage.goto("/")

      await page
        .getByRole("searchbox", { name: "Search presets" })
        .fill("my secret")
      await page.getByRole("button", { name: "Search" }).click()

      await expect(page).toHaveURL(/\/presets\/msfs2020\//)
      const entries = await page.evaluate(() =>
        (window.dataLayer ?? []).filter(
          (entry) =>
            (entry as { event?: string }).event === "home_search_submit",
        ),
      )
      expect(entries).toEqual([
        { event: "home_search_submit", sim: "msfs2020", has_query: true },
      ])
    })
  })

  test.describe("with analytics rejected", () => {
    test.use({ cookieConsent: "rejected" })

    test("Analytics - nothing is tracked without consent", async ({
      hubHopPage,
      page,
    }) => {
      await hubHopPage.goto("/")

      await clickDiscordInFooter(page)

      expect(await trackedEvents(page)).toEqual([])
      expect(hubHopPage.tagManagerRequests).toEqual([])
    })
  })
})
