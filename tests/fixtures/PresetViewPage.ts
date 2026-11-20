import type { Sim, HubHopPage } from "./HubHopPage"

export class PresetViewPage {
  constructor(public readonly hubHopPage: HubHopPage) {}

  get page() {
    return this.hubHopPage.page
  }

  /** Opens a preset by its id; the page adds vendor, aircraft and label to the URL */
  async gotoPage(id: string, sim: Sim = "msfs2020") {
    await this.hubHopPage.goto(`/presets/${sim}/-/-/${id}/`)
  }

  get title() {
    return this.page.getByRole("heading", { level: 2 }).first()
  }

  get historyToggle() {
    return this.page.getByRole("button", { name: /Preset history with/ })
  }
}
