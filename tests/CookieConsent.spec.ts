import { test, expect } from "@/tests/fixtures"
import { CONSENT_COOKIE } from "@/lib/cookieConsent"

const GTM_URL = "https://www.googletagmanager.com/gtm.js?id=GTM-TEST"
const DAY = 24 * 60 * 60

test.describe("Cookie consent", () => {
  test.describe("without a stored choice", () => {
    test.use({ cookieConsent: "unset" })

    test("Cookie consent - dialog asks before anything is loaded from Google", async ({
      hubHopPage,
    }) => {
      await hubHopPage.goto("/")

      const dialog = hubHopPage.cookieDialog
      await expect(dialog).toBeVisible()
      await expect(
        dialog.getByRole("button", { name: "Accept all" }),
      ).toBeVisible()
      await expect(
        dialog.getByRole("button", { name: "Reject all" }),
      ).toBeVisible()
      await expect(
        dialog.getByRole("link", { name: "Privacy Policy" }),
      ).toHaveAttribute("href", "/privacy/")
      await expect(
        dialog.getByRole("link", { name: "Imprint" }),
      ).toHaveAttribute("href", "/terms/")
      expect(hubHopPage.tagManagerRequests).toEqual([])
    })

    test("Cookie consent - dialog blocks the page until a choice is made", async ({
      hubHopPage,
      page,
    }) => {
      await hubHopPage.goto("/")

      await expect(hubHopPage.cookieDialog).toBeVisible()
      await expect(page.locator("html")).toHaveClass(/disable--interaction/)
      await expect(
        hubHopPage.cookieDialog.getByRole("button", { name: "Close" }),
      ).toHaveCount(0)

      await test.step("Escape doesn't close the dialog", async () => {
        await page.keyboard.press("Escape")
        await expect(hubHopPage.cookieDialog).toBeVisible()
      })
    })

    test("Cookie consent - accept loads Tag Manager with ad signals denied", async ({
      hubHopPage,
      page,
    }) => {
      await hubHopPage.goto("/")

      await test.step("Accept all cookies", async () => {
        await hubHopPage.cookieDialog
          .getByRole("button", { name: "Accept all" })
          .click()
      })

      await expect(hubHopPage.cookieDialog).toBeHidden()
      await expect(page.locator("html")).not.toHaveClass(/disable--interaction/)
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
        await expect(hubHopPage.cookieDialog).toBeHidden()
      })
    })

    test("Cookie consent - reject loads nothing and closes the dialog", async ({
      hubHopPage,
    }) => {
      await hubHopPage.goto("/")

      await test.step("Reject all cookies", async () => {
        await hubHopPage.cookieDialog
          .getByRole("button", { name: "Reject all" })
          .click()
      })
      await expect(hubHopPage.cookieDialog).toBeHidden()

      await test.step("Reload: the choice is remembered", async () => {
        await hubHopPage.reload()
        await expect(hubHopPage.cookieDialog).toBeHidden()
      })
      expect(hubHopPage.tagManagerRequests).toEqual([])
    })

    test("Cookie consent - analytics can be allowed in the preferences", async ({
      hubHopPage,
    }) => {
      await hubHopPage.goto("/")

      await test.step("Allow analytics in the preferences", async () => {
        await hubHopPage.cookieDialog
          .getByRole("button", { name: "Manage preferences" })
          .click()
        await hubHopPage.cookiePreferences
          .getByRole("checkbox", { name: "Analytics" })
          .check({ force: true })
        await hubHopPage.cookiePreferences
          .getByRole("button", { name: "Save preferences" })
          .click()
      })

      await expect(hubHopPage.cookiePreferences).toBeHidden()
      await expect.poll(() => hubHopPage.tagManagerRequests).toEqual([GTM_URL])
    })

    test("Cookie consent - the choice is stored in a HubHop cookie for a year", async ({
      hubHopPage,
      page,
    }) => {
      await hubHopPage.goto("/")
      await hubHopPage.cookieDialog
        .getByRole("button", { name: "Reject all" })
        .click()
      await expect(hubHopPage.cookieDialog).toBeHidden()

      const cookies = await page.context().cookies()
      const consent = cookies.find((cookie) => cookie.name === CONSENT_COOKIE)
      const days = ((consent?.expires ?? 0) - Date.now() / 1000) / DAY
      expect(days).toBeGreaterThan(364)
      expect(days).toBeLessThanOrEqual(365)
    })
  })

  test.describe("German browser", () => {
    test.use({ cookieConsent: "unset", locale: "de-DE" })

    test("Cookie consent - dialog speaks the browser language", async ({
      hubHopPage,
      page,
    }) => {
      await hubHopPage.goto("/")

      const dialog = page.getByRole("dialog", { name: "Wir verwenden Cookies" })
      await expect(
        dialog.getByRole("button", { name: "Alle ablehnen" }),
      ).toBeVisible()
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
      await expect(hubHopPage.cookieDialog).toBeHidden()
      await expect.poll(() => hubHopPage.tagManagerRequests).toHaveLength(1)

      await test.step("Open the cookie settings from the footer", async () => {
        await page.getByRole("button", { name: "Cookie settings" }).click()
        await expect(
          hubHopPage.cookiePreferences.getByRole("checkbox", {
            name: "Analytics",
          }),
        ).toBeChecked()
      })

      await test.step("Reject all: the page reloads without Tag Manager", async () => {
        const reloaded = page.waitForEvent("load")
        await hubHopPage.cookiePreferences
          .getByRole("button", { name: "Reject all" })
          .click()
        await reloaded
        await hubHopPage.waitForHydration()
      })

      await expect(hubHopPage.cookieDialog).toBeHidden()
      const names = (await page.context().cookies()).map(
        (cookie) => cookie.name,
      )
      expect(names).toContain("other")
      expect(names.filter((name) => name.startsWith("_ga"))).toEqual([])
      expect(hubHopPage.tagManagerRequests).toHaveLength(1)
    })

    test("Cookie consent - cookie settings can be closed without a new choice", async ({
      hubHopPage,
      page,
    }) => {
      await hubHopPage.goto("/")
      await expect.poll(() => hubHopPage.tagManagerRequests).toHaveLength(1)
      const stored = async () =>
        (await page.context().cookies()).find(
          (cookie) => cookie.name === CONSENT_COOKIE,
        )?.value
      const before = await stored()

      await test.step("Close with the close button", async () => {
        await page.getByRole("button", { name: "Cookie settings" }).click()
        await hubHopPage.cookiePreferences
          .getByRole("button", { name: "Close" })
          .click()
        await expect(hubHopPage.cookiePreferences).toBeHidden()
      })

      await test.step("Close with Escape", async () => {
        await page.getByRole("button", { name: "Cookie settings" }).click()
        await expect(hubHopPage.cookiePreferences).toBeVisible()
        await page.keyboard.press("Escape")
        await expect(hubHopPage.cookiePreferences).toBeHidden()
      })

      expect(await stored()).toBe(before)
      expect(hubHopPage.tagManagerRequests).toHaveLength(1)
    })
  })
})
