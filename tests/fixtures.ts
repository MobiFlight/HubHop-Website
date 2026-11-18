/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from "@playwright/test"
import { HubHopPage, type CookieConsentOption } from "./fixtures/HubHopPage"
import { PresetsPage } from "./fixtures/PresetsPage"
import { PresetViewPage } from "./fixtures/PresetViewPage"

type HHFixtures = {
  /** Cookie choice before the test; tests default to "rejected" so the banner stays hidden */
  cookieConsent: CookieConsentOption
  hubHopPage: HubHopPage
  presetsPage: PresetsPage
  presetViewPage: PresetViewPage
}

export const test = base.extend<HHFixtures>({
  cookieConsent: ["rejected", { option: true }],
  hubHopPage: async ({ page, cookieConsent }, use) => {
    const hubHopPage = new HubHopPage(page)
    await hubHopPage.init(cookieConsent)
    await use(hubHopPage)
  },
  presetsPage: async ({ hubHopPage }, use) => {
    await use(new PresetsPage(hubHopPage))
  },
  presetViewPage: async ({ hubHopPage }, use) => {
    await use(new PresetViewPage(hubHopPage))
  },
})

export { expect } from "@playwright/test"
export { authFile, testUser } from "./fixtures/auth"
