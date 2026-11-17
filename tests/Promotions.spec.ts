import { test, expect } from "./fixtures"
import {
  bestPromotions,
  pickWeighted,
  PROMOTIONS,
  promotionUrl,
  sponsors,
  type Promotion,
} from "../lib/promotions"

const promotion = (id: string, extra: Partial<Promotion> = {}): Promotion => ({
  id,
  kind: "club",
  title: id,
  text: "",
  cta: "Open",
  url: "https://www.mobiflight.com/",
  ...extra,
})

test.describe("Promotion selection", () => {
  test("Promotion selection - only promotions allowed in the slot are used", () => {
    const promotions = [
      promotion("everywhere"),
      promotion("sidebar only", { slots: ["filter-sidebar"] }),
    ]

    expect(bestPromotions("loading", {}, promotions).map((p) => p.id)).toEqual([
      "everywhere",
    ])
    expect(
      bestPromotions("filter-sidebar", {}, promotions).map((p) => p.id),
    ).toEqual(["everywhere", "sidebar only"])
  })

  test("Promotion selection - the most specific matching promotion wins", () => {
    const promotions = [
      promotion("generic"),
      promotion("airbus", { match: { aircraft: ["A320"] } }),
      promotion("airbus fcu", {
        match: { aircraft: ["A320"], keywords: ["fcu"] },
      }),
      promotion("x-plane", { match: { sims: ["xplane"] } }),
    ]
    const best = (context: Parameters<typeof bestPromotions>[1]) =>
      bestPromotions("below-results", context, promotions).map((p) => p.id)

    expect(best({ sim: "msfs2020" })).toEqual(["generic"])
    expect(best({ sim: "msfs2020", aircraft: "FBW A320neo" })).toEqual([
      "airbus",
    ])
    expect(
      best({ sim: "msfs2020", aircraft: "FBW A320neo", search: "FCU speed" }),
    ).toEqual(["airbus fcu"])
    expect(best({ sim: "xplane" })).toEqual(["x-plane"])
  })

  test("Promotion selection - vendors must match exactly, ignoring case", () => {
    const promotions = [
      promotion("generic"),
      promotion("asobo", { match: { vendors: ["Asobo"] } }),
    ]

    expect(
      bestPromotions("filter-sidebar", { vendor: "asobo" }, promotions).map(
        (p) => p.id,
      ),
    ).toEqual(["asobo"])
    expect(
      bestPromotions("filter-sidebar", { vendor: "Asobo2" }, promotions).map(
        (p) => p.id,
      ),
    ).toEqual(["generic"])
  })

  test("Promotion selection - excluded promotions are skipped", () => {
    const promotions = [promotion("a"), promotion("b")]

    expect(
      bestPromotions("loading", {}, promotions, ["a"]).map((p) => p.id),
    ).toEqual(["b"])
  })

  test("Promotion selection - weights decide the chance", () => {
    const promotions = [
      promotion("light", { weight: 1 }),
      promotion("heavy", { weight: 3 }),
    ]

    expect(pickWeighted(promotions, () => 0)?.id).toBe("light")
    expect(pickWeighted(promotions, () => 0.24)?.id).toBe("light")
    expect(pickWeighted(promotions, () => 0.25)?.id).toBe("heavy")
    expect(pickWeighted(promotions, () => 0.99)?.id).toBe("heavy")
    expect(pickWeighted([], () => 0.5)).toBeUndefined()
  })

  test("Promotion selection - sponsors are listed Gold first", () => {
    const promotions = [
      promotion("silver", { kind: "sponsor", sponsorTier: "silver" }),
      promotion("club"),
      promotion("gold", { kind: "sponsor", sponsorTier: "gold" }),
    ]

    expect(sponsors(promotions).map((p) => p.id)).toEqual(["gold", "silver"])
  })

  test("Promotion selection - links carry the slot as UTM parameters", () => {
    const url = new URL(
      promotionUrl(
        promotion("club", { url: "https://www.mobiflight.com/?lang=en" }),
        "loading",
      ),
    )

    expect(url.searchParams.get("lang")).toBe("en")
    expect(url.searchParams.get("utm_source")).toBe("hubhop")
    expect(url.searchParams.get("utm_campaign")).toBe("club")
    expect(url.searchParams.get("utm_content")).toBe("loading")
  })
})

test.describe("Promotion slots", () => {
  test("Promotion slots - the preset list shows two different promotions", async ({
    presetsPage,
  }) => {
    await presetsPage.gotoPage()
    const promotions = presetsPage.hubHopPage.promotions

    await expect(promotions).toHaveCount(2)
    const titles = await promotions.getByRole("heading").allTextContents()
    expect(new Set(titles).size).toBe(2)

    await test.step("Links name their slot", async () => {
      await expect(promotions.first().getByRole("link")).toHaveAttribute(
        "href",
        /utm_source=hubhop.*utm_content=filter-sidebar/,
      )
      await expect(promotions.last().getByRole("link")).toHaveAttribute(
        "href",
        /utm_source=hubhop.*utm_content=below-results/,
      )
    })
  })

  test("Promotion slots - a search shows the promotion that matches it", async ({
    presetsPage,
  }) => {
    const matching = PROMOTIONS.find(
      (p) =>
        p.match?.keywords?.length &&
        Object.keys(p.match).length === 1 &&
        (!p.slots || p.slots.includes("filter-sidebar")),
    )
    test.skip(!matching, "no promotion matches search keywords only")
    await presetsPage.gotoPage()

    await presetsPage.searchFilter.fill(matching!.match!.keywords![0])

    await expect(
      presetsPage.hubHopPage.promotions.filter({ hasText: matching!.title }),
    ).toHaveCount(1)
  })

  test("Promotion slots - the loading screen shows a promotion while presets download", async ({
    presetsPage,
    page,
  }) => {
    const release = Promise.withResolvers<void>()
    await page.route("**/msfs2020/presets", async (route) => {
      await release.promise
      await route.fallback()
    })

    await presetsPage.hubHopPage.goto("/presets/")

    await expect(page.getByText("Downloading MSFS Presets")).toBeVisible()
    await expect(presetsPage.hubHopPage.promotions).toHaveCount(1)
    await expect(
      presetsPage.hubHopPage.promotions.getByRole("link"),
    ).toHaveAttribute("href", /utm_content=loading/)

    release.resolve()
    await expect(presetsPage.table).toBeVisible()
  })

  test("Promotion slots - the preset view shows a promotion", async ({
    presetViewPage,
    page,
  }) => {
    await presetViewPage.gotoPage("msfs-0009")

    await expect(
      page.getByRole("heading", { name: "Battery master on" }),
    ).toBeVisible()
    await expect(presetViewPage.hubHopPage.promotions).toHaveCount(1)
    await expect(
      presetViewPage.hubHopPage.promotions.getByRole("link"),
    ).toHaveAttribute("href", /utm_content=preset-detail/)
  })
})
