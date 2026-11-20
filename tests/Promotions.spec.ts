import type { Page } from "@playwright/test"
import { test, expect } from "./fixtures"
import {
  bestPromotions,
  feedPromotions,
  pickWeighted,
  PROMOTIONS,
  promotionUrl,
  sponsorPromotions,
  type Promotion,
} from "../lib/promotions"

const promotion = (id: string, extra: Partial<Promotion> = {}): Promotion => ({
  id,
  kind: "club",
  title: id,
  content: [],
  action: { title: "Open", url: "https://mobiflight.com/" },
  ...extra,
})

// Math.random() close to 1 picks the last of the best promotions:
// our own first, then the feed items, then the sponsors.
const pickLast = (page: Page) =>
  page.addInitScript(() => {
    Math.random = () => 0.999
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

  test("Promotion selection - the homepage slots show one kind each", () => {
    const promotions = [
      promotion("club"),
      promotion("news", { kind: "news" }),
      promotion("sponsor", { kind: "sponsor" }),
    ]
    const ids = (slot: Parameters<typeof bestPromotions>[0]) =>
      bestPromotions(slot, {}, promotions).map((p) => p.id)
    expect(ids("home-news")).toEqual(["news"])
    expect(ids("home-sponsor")).toEqual(["sponsor"])
    expect(ids("home-club")).toEqual(["club"])
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

  test("Promotion selection - links carry the slot as UTM parameters", () => {
    const url = new URL(
      promotionUrl(
        promotion("club", {
          action: { title: "Open", url: "https://partner.example.com/?ref=mf" },
        }),
        "loading",
      ),
    )

    expect(url.searchParams.get("ref")).toBe("mf")
    expect(url.searchParams.get("utm_source")).toBe("hubhop")
    expect(url.searchParams.get("utm_campaign")).toBe("club")
    expect(url.searchParams.get("utm_content")).toBe("loading")
  })

  test("Promotion selection - feed items tagged promo, shop or community with a button become promotions", () => {
    const promotions = feedPromotions(
      [
        {
          date: "2026-11-11",
          title: "Deal",
          content: ["Line 1", "Line 2"],
          media: { type: "image", src: "media/deal.jpg", alt: "Deal image" },
          tags: ["community", "promo"],
          action: { title: "Save now!", url: "https://partner.example.com/" },
        },
        {
          date: "2026-06-01",
          title: "Event without a link",
          content: ["Line"],
          tags: ["promo"],
        },
        {
          date: "2026-11-01",
          title: "Shop item",
          content: ["Line"],
          tags: ["shop"],
          action: { title: "Buy", url: "https://shop.mobiflight.com/" },
        },
        {
          date: "2026-09-28",
          title: "Event with another tag",
          content: ["Line"],
          tags: ["events"],
          action: { title: "Watch", url: "https://www.youtube.com/" },
        },
      ],
      "https://mobiflight.com/feed/",
      "2026-11-18",
    )

    expect(promotions).toEqual([
      {
        id: "news-2026-11-11-Deal",
        kind: "news",
        tag: "promo",
        date: "2026-11-11",
        title: "Deal",
        content: ["Line 1", "Line 2"],
        media: {
          type: "image",
          src: "https://mobiflight.com/feed/media/deal.jpg",
          alt: "Deal image",
        },
        action: { title: "Save now!", url: "https://partner.example.com/" },
      },
      {
        id: "news-2026-11-01-Shop item",
        kind: "news",
        tag: "shop",
        date: "2026-11-01",
        title: "Shop item",
        content: ["Line"],
        media: undefined,
        action: { title: "Buy", url: "https://shop.mobiflight.com/" },
      },
    ])
  })

  test("Promotion selection - feed items dated in the future or expired are left out", () => {
    const item = (title: string, date: string, expires?: string) => ({
      date,
      expires,
      title,
      content: [],
      tags: ["promo"],
      action: { title: "Open", url: "https://partner.example.com/" },
    })

    const promotions = feedPromotions(
      [
        item("Published today", "2026-11-18"),
        item("Published tomorrow", "2026-11-19"),
        item("Expires today", "2026-11-01", "2026-11-18"),
        item("Expired yesterday", "2026-11-01", "2026-11-17"),
      ],
      "https://mobiflight.com/feed/",
      "2026-11-18",
    )

    expect(promotions.map((promotion) => promotion.title)).toEqual([
      "Published today",
      "Expires today",
    ])
  })

  test("Promotion selection - the filter sidebar prefers promo, then shop, then community items", () => {
    const promo = promotion("promo", { tag: "promo" })
    const shop = promotion("shop", { tag: "shop" })
    const community = promotion("community", { tag: "community" })
    const own = promotion("own")
    const promotions = [own, community, shop, promo]

    expect(bestPromotions("filter-sidebar", {}, promotions)).toEqual([promo])
    expect(bestPromotions("filter-sidebar", {}, promotions, ["promo"])).toEqual(
      [shop],
    )
    expect(
      bestPromotions("filter-sidebar", {}, promotions, ["promo", "shop"]),
    ).toEqual([community])
    expect(
      bestPromotions("filter-sidebar", {}, [own, promo], ["promo"]),
    ).toEqual([own])
    expect(bestPromotions("below-results", {}, promotions)).toEqual(promotions)
  })

  test("Promotion selection - donations go to the HubHop PayPal button", () => {
    const donation = PROMOTIONS.find((p) => p.kind === "donation")

    expect(donation?.action).toEqual({
      title: "Donate via PayPal",
      url: "https://www.paypal.com/donate/?hosted_button_id=URY7DDNXZ8Q3U",
    })
  })

  test("Promotion selection - sponsors become sponsor promotions with their logo", () => {
    const [sponsor] = sponsorPromotions(
      [
        {
          name: "VKB Sim",
          logo: "/sponsors/vkb_logo.png",
          href: "https://vkb-sim.pro/",
        },
      ],
      "https://mobiflight.com/sponsors.json",
    )

    expect(sponsor.kind).toBe("sponsor")
    expect(sponsor.title).toBe("VKB Sim")
    expect(sponsor.media).toEqual({
      type: "logo",
      src: "https://mobiflight.com/sponsors/vkb_logo.png",
      alt: "VKB Sim logo",
    })
    expect(sponsor.action.url).toBe("https://vkb-sim.pro/")
  })
})

test.describe("Promotion slots", () => {
  test("Promotion slots - the preset list shows four different promotions", async ({
    presetsPage,
  }) => {
    await presetsPage.gotoPage()
    const promotions = presetsPage.hubHopPage.promotions

    await expect(promotions).toHaveCount(4)
    const titles = await promotions.getByRole("heading").allTextContents()
    expect(new Set(titles).size).toBe(4)

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

  test("Promotion slots - sponsors and news from mobiflight.com are shown", async ({
    presetsPage,
    page,
  }) => {
    await pickLast(page)
    await presetsPage.gotoPage()
    const sidebar = presetsPage.hubHopPage.promotions.first()
    const belowResults = presetsPage.hubHopPage.promotions.nth(1)

    await test.step("The filter sidebar shows the promo item with its image, text and button", async () => {
      await expect(sidebar.getByRole("heading")).toHaveText("Test partner deal")
      await expect(sidebar).toContainText("A partner has a test deal.")
      await expect(sidebar.locator("strong")).toHaveText("test deal")
      await expect(
        sidebar.getByRole("link", { name: "Test deal now!" }),
      ).toHaveAttribute("rel", "noopener")
      await expect(sidebar.locator("img")).toHaveAttribute(
        "src",
        "https://mobiflight.com/feed/media/test/deal.jpg",
      )
    })

    await test.step("The sponsor is labelled and linked as sponsored", async () => {
      await expect(belowResults.getByRole("heading")).toHaveText("Test Sponsor")
      await expect(belowResults).toContainText("Sponsored")
      await expect(belowResults.getByRole("link")).toHaveAttribute(
        "rel",
        "sponsored noopener",
      )
      await expect(belowResults.locator("img")).toHaveAttribute(
        "src",
        "https://mobiflight.com/sponsors/test-sponsor-logo.png",
      )
    })
  })

  test("Promotion slots - our own promotions fill in when mobiflight.com can't be reached", async ({
    presetsPage,
    page,
  }) => {
    await page.route("https://mobiflight.com/**", (route) => route.abort())
    await pickLast(page)
    await presetsPage.gotoPage()
    const promotions = presetsPage.hubHopPage.promotions

    await expect(promotions).toHaveCount(4)
    const titles = await promotions.getByRole("heading").allTextContents()
    expect(PROMOTIONS.map((p) => p.title)).toEqual(
      expect.arrayContaining(titles),
    )
  })

  test("Promotion slots - mobiflight.com is asked once per browser session", async ({
    presetsPage,
    page,
  }) => {
    const feedRequests: string[] = []
    page.on("request", (request) => {
      if (request.url().endsWith("/feed/en/feed.json")) {
        feedRequests.push(request.url())
      }
    })

    await presetsPage.gotoPage()
    await expect(presetsPage.hubHopPage.promotions).toHaveCount(4)
    await presetsPage.hubHopPage.reload()
    await expect(presetsPage.hubHopPage.promotions).toHaveCount(4)

    expect(feedRequests).toHaveLength(1)
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
    await presetViewPage.gotoPage("00000000-0000-4000-8000-000000000009")

    await expect(
      page.getByRole("heading", { name: "Battery master on" }),
    ).toBeVisible()
    await expect(presetViewPage.hubHopPage.promotions).toHaveCount(1)
    await expect(
      presetViewPage.hubHopPage.promotions.getByRole("link"),
    ).toHaveAttribute("href", /utm_content=preset-detail/)
  })
})
