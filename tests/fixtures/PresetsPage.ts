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

  /** Data rows of the preset table (excludes header, details and empty-state rows) */
  get rows(): Locator {
    return this.table
      .getByRole("row")
      .filter({ has: this.page.getByRole("button", { name: "Details" }) })
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

  /** Picks an option of a filter (combobox or select) */
  async choose(filter: Locator, option: string) {
    await filter.click()
    await this.page.getByRole("option", { name: option, exact: true }).click()
  }

  /** Opens a filter, checks its options and closes it again */
  async expectOptions(filter: Locator, options: string[]) {
    await filter.click()
    await expect(this.page.getByRole("listbox").getByRole("option")).toHaveText(
      options,
    )
    await this.page.keyboard.press("Escape")
  }

  /** The X-Plane option of the MSFS / X-Plane switch */
  get xplaneSwitch() {
    return this.page.getByRole("radio", { name: "X-Plane" })
  }

  /** Expands a preset row and returns the expanded details area */
  async expand(label: string): Promise<Locator> {
    await this.row(label).getByRole("cell").last().click()
    // the details are the row right after it
    return this.row(label).locator("xpath=following-sibling::*[@role='row'][1]")
  }
}
