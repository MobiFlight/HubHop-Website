import { expect, type Locator } from "@playwright/test"
import type { HubHopPage } from "./HubHopPage"

export class PresetsPage {
  constructor(public readonly hubHopPage: HubHopPage) {}

  get page() {
    return this.hubHopPage.page
  }

  /** Opens the preset list and waits until the table is rendered */
  async gotoPage(query = "") {
    await this.hubHopPage.goto(`/presets/${query}`)
    await expect(this.table).toBeVisible()
  }

  get table(): Locator {
    return this.page.getByRole("table")
  }

  /** Data rows of the preset table (excludes the header row) */
  get rows(): Locator {
    return this.table
      .getByRole("row")
      .filter({ has: this.page.getByRole("cell") })
  }

  row(label: string): Locator {
    return this.rows.filter({ hasText: label })
  }

  get searchFilter() {
    return this.page.getByLabel("Search Preset")
  }
  get vendorFilter() {
    return this.page.getByLabel("Select Vendor")
  }
  get aircraftFilter() {
    return this.page.getByLabel("Search Aircraft")
  }
  get systemFilter() {
    return this.page.getByLabel("Select System")
  }
  get presetTypeFilter() {
    return this.page.getByLabel("Select Input/Output")
  }
  get codeTypeFilter() {
    return this.page.getByLabel("Select Code Type")
  }

  /** The MSFS 2020 / X-Plane switch */
  get simToggle() {
    return this.page.getByRole("button", { name: /MSFS 2020.*X-Plane/ })
  }

  /** Expands a preset row and returns the expanded details area */
  async expand(label: string) {
    await this.row(label).getByRole("cell").last().click()
  }
}
