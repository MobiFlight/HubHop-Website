import type { Sim, HubHopPage } from "./HubHopPage"

export class PresetViewPage {
  constructor(public readonly hubHopPage: HubHopPage) {}

  get page() {
    return this.hubHopPage.page
  }

  async gotoPage(id: string, simType: Sim = "msfs2020") {
    await this.hubHopPage.goto(`/preset/?simType=${simType}&id=${id}`)
  }

  get title() {
    return this.page.getByRole("heading", { level: 2 }).first()
  }

  get historyToggle() {
    return this.page.getByRole("button", { name: /Preset history with/ })
  }
}
