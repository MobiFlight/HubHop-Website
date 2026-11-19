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

  /** Data rows of the preset table (excludes header and empty-state rows) */
  get rows(): Locator {
    return (
      this.table
        .getByRole("row")
        .filter({ hasNot: this.page.getByRole("columnheader") })
        // the "no records" message is rendered as a row, too
        .filter({ hasNot: this.page.getByRole("status") })
    )
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

  /** The X-Plane option of the MSFS 2020 / X-Plane switch */
  get xplaneSwitch() {
    return this.page.getByRole("radio", { name: "X-Plane" })
  }

  /** Expands a preset row and returns the expanded details area */
  async expand(label: string): Promise<Locator> {
    await this.row(label).getByRole("cell").last().click()
    // the table renders the details right after the row, without a role
    return this.row(label).locator("xpath=following-sibling::div[1]")
  }
}
