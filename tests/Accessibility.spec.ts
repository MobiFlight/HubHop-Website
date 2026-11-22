import AxeBuilder from "@axe-core/playwright"
import { test, expect } from "@/tests/fixtures"
import type { Page } from "@playwright/test"
import type { HubHopPage } from "@/tests/fixtures/HubHopPage"
import type { PresetsPage } from "@/tests/fixtures/PresetsPage"

// Automated accessibility check (axe, WCAG 2.1 A and AA) of the main pages.
// Violations that existed before the shadcn/ui migration (#154) are listed per
// page with the number of affected elements. New rules or more elements fail
// the test. Remove entries when a pull request fixes them.

type KnownViolations = Record<string, number>

type PageCheck = {
  name: string
  open: (fixtures: {
    page: Page
    hubHopPage: HubHopPage
    presetsPage: PresetsPage
  }) => Promise<void>
  known: KnownViolations
}

const pages: PageCheck[] = [
  {
    name: "home page",
    open: async ({ hubHopPage, page }) => {
      await hubHopPage.goto("/")
      await expect(
        page.getByRole("heading", { name: "Create, Share, Improve" }),
      ).toBeVisible()
    },
    known: {},
  },
  {
    name: "preset list with an expanded row",
    open: async ({ presetsPage }) => {
      await presetsPage.gotoPage()
      const details = await presetsPage.expand("Battery master on")
      await expect(details.getByRole("button", { name: "View" })).toBeVisible()
    },
    known: {},
  },
  {
    name: "aircraft index",
    open: async ({ hubHopPage, page }) => {
      await hubHopPage.goto("/aircraft/msfs/")
      await expect(page.getByRole("link", { name: "A32NX 1 profile · 4 presets" })).toBeVisible()
    },
    known: {},
  },
  {
    name: "aircraft cheat sheet",
    open: async ({ hubHopPage, page }) => {
      await hubHopPage.goto("/aircraft/msfs/asobo/a320neo/")
      await expect(
        page.getByRole("heading", { name: "Lights 3 presets" }),
      ).toBeVisible()
    },
    known: {},
  },
  {
    name: "stats page",
    open: async ({ hubHopPage, page }) => {
      await hubHopPage.goto("/stats/")
      await expect(page.getByText("Asobo - A320neo")).toBeVisible()
    },
    known: {},
  },
  {
    name: "tools page",
    open: async ({ hubHopPage, page }) => {
      await hubHopPage.goto("/tools/")
      await expect(
        page.getByRole("textbox", { name: "Generated RPN Code" }),
      ).toHaveValue("RPN Code will be displayed here")
    },
    known: {},
  },
]

test.describe("Accessibility", () => {
  for (const { name, open, known } of pages) {
    test(`Accessibility - ${name} has no new axe violations`, async ({
      page,
      hubHopPage,
      presetsPage,
    }) => {
      await open({ page, hubHopPage, presetsPage })
      // fade-ins would make axe measure the colour contrast of half-transparent text;
      // endless animations (the homepage's hub arrows) never finish
      await page.waitForFunction(() =>
        document
          .getAnimations()
          .every(
            (a) =>
              a.playState !== "running" ||
              a.effect?.getTiming().iterations === Infinity,
          ),
      )

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()

      const newViolations = results.violations
        .filter((v) => v.nodes.length > (known[v.id] ?? 0))
        .map((v) => ({
          rule: v.id,
          help: v.help,
          elements: v.nodes.map((n) => n.target.join(" ")),
        }))
      expect(newViolations).toEqual([])
    })
  }
})
