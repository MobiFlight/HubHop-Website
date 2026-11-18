import { test, expect } from "./fixtures"
import { CONSENT_STORAGE_KEY } from "../lib/consent"

const GTM_URL = "https://www.googletagmanager.com/gtm.js?id=GTM-TEST"

test.describe("Cookie consent", () => {
  test.describe("without a stored choice", () => {
    test.use({ cookieConsent: "unset" })

    test("Cookie consent - banner asks before anything is loaded from Google", async ({
      hubHopPage,
    }) => {
      await hubHopPage.goto("/")

      await expect(hubHopPage.cookieBanner).toBeVisible()
      await expect(
        hubHopPage.cookieBanner.getByRole("link", { name: "privacy policy" }),
      ).toHaveAttribute("href", "/privacy/")
      expect(hubHopPage.tagManagerRequests).toEqual([])
    })

    test("Cookie consent - accept loads Tag Manager with ad signals denied", async ({
      hubHopPage,
      page,
    }) => {
      await hubHopPage.goto("/")

      await test.step("Accept analytics cookies", async () => {
        await hubHopPage.cookieBanner
          .getByRole("button", { name: "Accept" })
          .click()
      })

      await expect(hubHopPage.cookieBanner).toBeHidden()
      await expect.poll(() => hubHopPage.tagManagerRequests).toEqual([GTM_URL])
      const consentCommands = await page.evaluate(() =>
        (window.dataLayer ?? [])
          .filter(
            (entry) =>
              Object.prototype.toString.call(entry) === "[object Arguments]",
          )
          .map((entry) => Array.from(entry as ArrayLike<unknown>)),
      )
      expect(consentCommands).toEqual([
        [
          "consent",
          "default",
          {
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
            analytics_storage: "denied",
          },
        ],
        ["consent", "update", { analytics_storage: "granted" }],
      ])

      await test.step("Reload: the choice is remembered", async () => {
        await hubHopPage.reload()
        await expect.poll(() => hubHopPage.tagManagerRequests).toHaveLength(2)
        await expect(hubHopPage.cookieBanner).toBeHidden()
      })
    })

    test("Cookie consent - reject loads nothing and hides the banner", async ({
      hubHopPage,
    }) => {
      await hubHopPage.goto("/")

      await test.step("Reject analytics cookies", async () => {
        await hubHopPage.cookieBanner
          .getByRole("button", { name: "Reject" })
          .click()
      })
      await expect(hubHopPage.cookieBanner).toBeHidden()

      await test.step("Reload: the choice is remembered", async () => {
        await hubHopPage.reload()
        await expect(hubHopPage.cookieBanner).toBeHidden()
      })
      expect(hubHopPage.tagManagerRequests).toEqual([])
    })

    test("Cookie consent - banner asks again after a year", async ({
      hubHopPage,
      page,
    }) => {
      await page.addInitScript((key) => {
        const date = new Date()
        date.setMonth(date.getMonth() - 13)
        localStorage.setItem(
          key,
          JSON.stringify({ analytics: true, date: date.toISOString() }),
        )
      }, CONSENT_STORAGE_KEY)

      await hubHopPage.goto("/")

      await expect(hubHopPage.cookieBanner).toBeVisible()
      expect(hubHopPage.tagManagerRequests).toEqual([])
    })
  })

  test.describe("after accepting", () => {
    test.use({ cookieConsent: "accepted" })

    test("Cookie consent - reject in the cookie settings withdraws consent and deletes analytics cookies", async ({
      hubHopPage,
      page,
    }) => {
      await page.context().addCookies([
        { name: "_ga", value: "GA1.1.1", domain: "localhost", path: "/" },
        { name: "_ga_TEST", value: "GS1.1.1", domain: "localhost", path: "/" },
        { name: "other", value: "kept", domain: "localhost", path: "/" },
      ])
      await hubHopPage.goto("/")
      await expect.poll(() => hubHopPage.tagManagerRequests).toHaveLength(1)

      await test.step("Open the cookie settings from the footer", async () => {
        await page.getByRole("button", { name: "Cookie settings" }).click()
        await expect(hubHopPage.cookieBanner).toContainText(
          "Your current choice: accepted.",
        )
      })

      await test.step("Reject: the page reloads without Tag Manager", async () => {
        const reloaded = page.waitForEvent("load")
        await hubHopPage.cookieBanner
          .getByRole("button", { name: "Reject" })
          .click()
        await reloaded
        await hubHopPage.waitForHydration()
      })

      await expect(hubHopPage.cookieBanner).toBeHidden()
      const cookies = await page.context().cookies()
      const names = cookies.map((cookie) => cookie.name)
      expect(names).toContain("other")
      expect(names.filter((name) => name.startsWith("_ga"))).toEqual([])
      expect(hubHopPage.tagManagerRequests).toHaveLength(1)
    })
  })
})
