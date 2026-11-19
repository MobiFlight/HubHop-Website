import type { Page, Request, Route } from "@playwright/test"
import { FakeIdentityProvider } from "./FakeIdentityProvider"
import { ANALYTICS, CONSENT_COOKIE } from "../../lib/cookieConsent"
import msfsPresets from "../data/msfs-presets.testdata.json"
import xplanePresets from "../data/xplane-presets.testdata.json"
import msfsLast from "../data/msfs-last.testdata.json"
import xplaneLast from "../data/xplane-last.testdata.json"
import msfsStats from "../data/msfs-stats.testdata.json"
import xplaneStats from "../data/xplane-stats.testdata.json"
import msfsHistory from "../data/msfs-history.testdata.json"
import mobiflightFeed from "../data/mobiflight-feed.testdata.json"
import mobiflightSponsors from "../data/mobiflight-sponsors.testdata.json"

export const API_HOST = "https://hubhop-api-mgtm.azure-api.net"
/** mobiflight.com: news feed, sponsors and their images */
export const MOBIFLIGHT_HOST = "https://mobiflight.com"
export const GTM_HOST = "https://www.googletagmanager.com"

/** Cookie choice stored before the page loads; "unset" shows the consent dialog */
export type CookieConsentOption = "accepted" | "rejected" | "unset"

// 1 x 1 pixel PNG, served for every image on mobiflight.com
const PIXEL = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
)
const API_BASE = "/api/v1"

export type Sim = "msfs2020" | "xplane"

export interface ApiData {
  presets: Record<Sim, unknown[]>
  last: Record<Sim, unknown[]>
  stats: Record<Sim, unknown>
  history: unknown[]
  roles: string
  /** status codes returned for write requests */
  writeStatus: { POST: number; PUT: number; DELETE: number }
}

export interface RecordedRequest {
  method: string
  path: string
  body: unknown
  headers: Record<string, string>
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

export const defaultApiData = (): ApiData => ({
  presets: { msfs2020: clone(msfsPresets), xplane: clone(xplanePresets) },
  last: { msfs2020: clone(msfsLast), xplane: clone(xplaneLast) },
  stats: { msfs2020: clone(msfsStats), xplane: clone(xplaneStats) },
  history: clone(msfsHistory),
  roles: "user",
  writeStatus: { POST: 200, PUT: 201, DELETE: 200 },
})

/** The consent cookie as vanilla-cookieconsent stores it */
const consentCookie = (categories: string[]) => {
  const now = new Date()
  const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const value = {
    categories,
    revision: 0,
    data: null,
    consentTimestamp: now.toISOString(),
    consentId: "00000000-0000-4000-8000-000000000000",
    services: { necessary: [], [ANALYTICS]: [] },
    languageCode: "en",
    lastConsentTimestamp: now.toISOString(),
    expirationTime: expires.getTime(),
  }
  return {
    name: CONSENT_COOKIE,
    value: encodeURIComponent(JSON.stringify(value)),
    url: "http://localhost:3000",
    expires: Math.round(expires.getTime() / 1000),
  }
}

/**
 * Base page object: mocks the HubHop API and the B2C login, and records
 * every write request so tests can assert on them.
 */
export class HubHopPage {
  readonly api: ApiData = defaultApiData()
  readonly requests: RecordedRequest[] = []
  /** number of full preset list downloads per sim */
  readonly downloads: Record<Sim, number> = { msfs2020: 0, xplane: 0 }
  /** URLs of requests to Google Tag Manager */
  readonly tagManagerRequests: string[] = []

  constructor(public readonly page: Page) {}

  readonly identityProvider = new FakeIdentityProvider()

  /** Installs all mocks. Must be called before the first navigation. */
  async init(cookieConsent: CookieConsentOption = "rejected") {
    const context = this.page.context()
    // Mocks are installed on the browser context, so the login popup gets them too.
    await this.identityProvider.install(context)
    await context.route(`${API_HOST}/**`, (route, request) =>
      this.handleApi(route, request),
    )
    await context.route(`${MOBIFLIGHT_HOST}/**`, (route, request) => {
      const path = new URL(request.url()).pathname
      if (path === "/feed/en/feed.json") {
        return route.fulfill({ json: mobiflightFeed })
      }
      if (path === "/sponsors.json") {
        return route.fulfill({ json: mobiflightSponsors })
      }
      return route.fulfill({ contentType: "image/png", body: PIXEL })
    })
    // Google Tag Manager is answered with an empty script, nothing reaches Google.
    await context.route(`${GTM_HOST}/**`, (route, request) => {
      this.tagManagerRequests.push(request.url())
      return route.fulfill({ contentType: "text/javascript", body: "" })
    })
    // vanilla-cookieconsent hides its dialog from automated browsers
    await context.addInitScript(() =>
      Object.defineProperty(Navigator.prototype, "webdriver", {
        get: () => false,
      }),
    )
    if (cookieConsent !== "unset") {
      await context.addCookies([
        consentCookie(
          cookieConsent === "accepted"
            ? ["necessary", ANALYTICS]
            : ["necessary"],
        ),
      ])
    }
    await context.addInitScript(() => {
      // The Next.js dev overlay (shown for console errors) would cover page controls.
      document.addEventListener("DOMContentLoaded", () => {
        const style = document.createElement("style")
        style.textContent = "nextjs-portal { display: none !important; }"
        document.head.appendChild(style)
      })
    })
  }

  /**
   * Logs in through the UI: Log-in button, login popup (answered by the fake
   * identity provider), then the app loads the user's roles from the API.
   */
  async login(roles = this.api.roles) {
    this.api.roles = roles
    if (!this.page.url().startsWith("http")) await this.goto("/")
    const popup = this.page.waitForEvent("popup")
    await this.page.getByRole("button", { name: "Log-in" }).click()
    await (await popup).waitForEvent("close")
    await this.page.waitForFunction(
      (expected) => localStorage.getItem("roles") === expected,
      roles,
    )
  }

  /** Navigates and waits until React has hydrated the page */
  async goto(path: string) {
    await this.page.goto(path)
    await this.waitForHydration()
  }

  async reload() {
    await this.page.reload()
    await this.waitForHydration()
  }

  /** The Layout sets a default `simType` in a mount effect, i.e. after hydration */
  async waitForHydration() {
    await this.page.waitForFunction(
      () => localStorage.getItem("simType") !== null,
    )
  }

  /** The cookie consent dialog */
  get cookieDialog() {
    return this.page.getByRole("dialog", { name: "We use cookies" })
  }

  /** The cookie preferences dialog ("Cookie settings" in the footer) */
  get cookiePreferences() {
    return this.page.getByRole("dialog", { name: "Cookie preferences" })
  }

  /** Promotion slots for MobiFlight on the current page */
  get promotions() {
    return this.page.getByRole("complementary", { name: "Promotion" })
  }

  /** Write requests (POST, PUT, DELETE) received by the mocked API */
  writeRequests(method?: string) {
    return this.requests.filter(
      (r) => r.method !== "GET" && (!method || r.method === method),
    )
  }

  private async handleApi(route: Route, request: Request) {
    const url = new URL(request.url())
    const path = url.pathname.replace(API_BASE, "")
    const method = request.method()

    if (method !== "GET") {
      this.requests.push({
        method,
        path,
        body: request.postData() ? request.postDataJSON() : undefined,
        headers: request.headers(),
      })
      const status =
        this.api.writeStatus[method as keyof ApiData["writeStatus"]] ?? 200
      return route.fulfill({ status, json: {} })
    }
    this.requests.push({ method, path, body: undefined, headers: {} })

    const simRoute = path.match(/^\/(msfs2020|xplane)\/(.+)$/)
    if (simRoute) {
      const sim = simRoute[1] as Sim
      const resource = simRoute[2]
      if (resource === "statistics/last") {
        return route.fulfill({ json: this.api.last[sim] })
      }
      if (resource === "statistics/general") {
        return route.fulfill({ json: this.api.stats[sim] })
      }
      if (resource === "presets") {
        this.downloads[sim]++
        return route.fulfill({ json: this.api.presets[sim] })
      }
      if (resource.startsWith("presets/")) {
        const id = resource.slice("presets/".length)
        const preset = (this.api.presets[sim] as { id: string }[]).find(
          (p) => p.id === id,
        )
        return preset
          ? route.fulfill({ json: preset })
          : route.fulfill({ status: 404, json: {} })
      }
      if (sim === "msfs2020" && resource.startsWith("history/presets/")) {
        return route.fulfill({ json: this.api.history })
      }
    }
    if (path === "/export/presets") {
      return route.fulfill({
        contentType: "text/plain",
        body: "TEST_EVENT#(>K:TEST_0001)\n",
      })
    }
    if (path === "/settings/user") {
      return route.fulfill({ json: { roles: this.api.roles } })
    }
    return route.fulfill({ status: 404, json: { error: `unmocked ${path}` } })
  }
}
