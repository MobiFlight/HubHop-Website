/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from "@playwright/test"
import { HubHopPage } from "./fixtures/HubHopPage"
import { PresetsPage } from "./fixtures/PresetsPage"
import { PresetViewPage } from "./fixtures/PresetViewPage"

type HHFixtures = {
  hubHopPage: HubHopPage
  presetsPage: PresetsPage
  presetViewPage: PresetViewPage
}

export const test = base.extend<HHFixtures>({
  hubHopPage: async ({ page }, use) => {
    const hubHopPage = new HubHopPage(page)
    await hubHopPage.init()
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
