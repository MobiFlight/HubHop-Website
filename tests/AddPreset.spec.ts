import type { Locator, Page } from "@playwright/test"
import { test, expect, authFile } from "@/tests/fixtures"

test.describe("Add preset - anonymous", () => {
  test("Add preset - anonymous users are asked to log in", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage()

    const popup = page.waitForEvent("popup")
    await page.getByRole("button", { name: "Add preset" }).click()

    await test.step("Login popup opens", async () => {
      await (await popup).waitForEvent("close")
    })
    await expect(page.getByRole("heading", { name: "Add Preset" })).toHaveCount(
      0,
    )
  })
})

/** A combobox or select of the add preset form, found by its label */
const field = (page: Page, label: string) =>
  page.locator("form").getByRole("combobox", { name: label })

/** Picks an option of a combobox or select */
const choose = async (page: Page, label: string, option: string) => {
  await field(page, label).click()
  await page.getByRole("option", { name: option, exact: true }).click()
}

const fillForm = (page: Page, form: Locator) =>
  test.step("Fill in the form", async () => {
    await choose(page, "Vendor", "Asobo")
    await choose(page, "Aircraft", "C172")
    await choose(page, "System", "Electrical")
    await choose(page, "Input/Output", "Input")
    await form.getByPlaceholder("Alternator 1 On").fill("Alternator 2 on")
    await form
      .getByPlaceholder("(>L:somecode) (>K:somecodeToo) * near")
      .fill("(>K:ALTERNATOR_2_ON)")
    await form
      .getByPlaceholder("This is your space for a nice description")
      .fill("Turns on alternator 2")
  })

test.describe("Add preset - user", () => {
  test.use({ storageState: authFile.user })

  test.beforeEach(async ({ presetsPage, page }) => {
    await presetsPage.gotoPage()
    await page.getByRole("button", { name: "Add preset" }).click()
    await expect(
      page.getByRole("heading", { name: "Add Preset" }),
    ).toBeVisible()
  })

  test("Add preset - required fields are validated", async ({
    hubHopPage,
    page,
  }) => {
    const form = page.locator("form")
    await form.getByRole("button", { name: "Add preset" }).click()

    await expect(form.getByText("Name required")).toBeVisible()
    await expect(form.getByText("Code required")).toBeVisible()
    expect(hubHopPage.writeRequests()).toHaveLength(0)
  })

  test("Add preset - submits a new preset", async ({ hubHopPage, page }) => {
    const form = page.locator("form")
    await fillForm(page, form)

    await form.getByRole("button", { name: "Add preset" }).click()

    await expect(page.getByText("Preset successfully added!")).toBeVisible()
    const requests = hubHopPage.writeRequests("POST")
    expect(requests).toHaveLength(1)
    expect(requests[0].path).toBe("/msfs2020/presets")
    expect(requests[0].headers["authorization"]).toBe(
      "Bearer fake-access-token",
    )
    expect(requests[0].body).toMatchObject({
      path: "Asobo.C172.Electrical.Input.Alternator 2 on",
      vendor: "Asobo",
      aircraft: "C172",
      system: "Electrical",
      presetType: "Input",
      label: "Alternator 2 on",
      code: "(>K:ALTERNATOR_2_ON)",
      description: "Turns on alternator 2",
      status: "Submitted",
      author: "Test User",
    })

    await test.step("Name and code are cleared for the next preset", async () => {
      await expect(form.getByPlaceholder("Alternator 1 On")).toHaveValue("")
    })
  })

  test("Add preset - selecting a vendor lists only its aircraft", async ({
    page,
  }) => {
    await choose(page, "Vendor", "FlyByWire")

    await field(page, "Aircraft").click()
    await expect(page.getByRole("option")).toHaveText(["A32NX"])
    await page.keyboard.press("Escape")
    await test.step("All systems stay available", async () => {
      await field(page, "System").click()
      await expect(page.getByRole("option")).toHaveText([
        "Autopilot",
        "Electrical",
        "Engine",
        "Lights",
        "Overhead",
      ])
    })
  })

  test("Add preset - selecting an aircraft first fills in its vendor", async ({
    page,
  }) => {
    await choose(page, "Aircraft", "C172")

    await expect(field(page, "Vendor")).toHaveText("Asobo")
    await field(page, "Vendor").click()
    await expect(page.getByRole("option")).toHaveText(["Asobo"])
  })

  test("Add preset - Input/Output offers only the known values", async ({
    page,
  }) => {
    await field(page, "Input/Output").click()

    await expect(page.getByRole("option")).toHaveText([
      "Input",
      "Output",
      "Input (Potentiometer)",
    ])
  })

  test("Add preset - shows similar presets while typing", async ({ page }) => {
    const form = page.locator("form")

    await form.getByPlaceholder("Alternator 1 On").fill("Landing lights")

    await expect(form.getByText("2 presets found.")).toBeVisible()
    await expect(
      form.getByRole("link", { name: "Landing lights on" }),
    ).toBeVisible()
  })

  test("Add preset - similar presets match the selected aircraft, system, type and description", async ({
    page,
  }) => {
    const form = page.locator("form")

    await test.step("Select aircraft and system", async () => {
      await choose(page, "Aircraft", "C172")
      await choose(page, "System", "Electrical")
      await expect(form.getByText("3 presets found.")).toBeVisible()
    })

    await test.step("Type a description", async () => {
      await form
        .getByPlaceholder("This is your space for a nice description")
        .fill("battery")
      await expect(form.getByText("1 presets found.")).toBeVisible()
      await expect(
        form.getByRole("link", { name: "Battery master on" }),
      ).toBeVisible()
    })

    await test.step("Select a type without presets", async () => {
      await choose(page, "Input/Output", "Output")
      await expect(form.getByText("No matches")).toBeVisible()
    })
  })

  test("Add preset - bulk upload explains the import file", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Bulk upload" }).click()

    await expect(
      page.getByRole("heading", { name: "Bulk Upload" }),
    ).toBeVisible()
    await expect(
      page.getByRole("link", {
        name: "Download import-file (MS Excel Required)",
      }),
    ).toHaveAttribute("href", /import_events_yourName\.xlsx$/)
  })

  test("Add preset - a failed request shows only the error and keeps the input", async ({
    hubHopPage,
    page,
  }) => {
    hubHopPage.api.writeStatus.POST = 500
    const form = page.locator("form")
    await fillForm(page, form)

    await form.getByRole("button", { name: "Add preset" }).click()

    await expect(page.getByText("Error - Preset not added!")).toBeVisible()
    await expect(page.getByText("Preset successfully added!")).toHaveCount(0)
    await expect(form.getByPlaceholder("Alternator 1 On")).toHaveValue(
      "Alternator 2 on",
    )
  })

  test("Add preset - users can enter a new vendor and aircraft but not a new system", async ({
    page,
  }) => {
    for (const label of ["Vendor", "Aircraft"]) {
      await test.step(label, async () => {
        await field(page, label).click()
        await page.getByPlaceholder("Search…").fill("Carenado")
        await page.getByRole("option", { name: 'Create "Carenado"' }).click()
        await expect(field(page, label)).toHaveText("Carenado")
      })
    }

    await test.step("System", async () => {
      await field(page, "System").click()
      await page.getByPlaceholder("Search…").fill("Hydraulics")
      await expect(page.getByText("No results")).toBeVisible()
      await expect(page.getByRole("option", { name: /Create/ })).toHaveCount(0)
    })
  })

  test("Add preset - close hides the dialog", async ({ page }) => {
    await page
      .locator("form")
      .getByRole("button", { name: "Close", exact: true })
      .click()

    await expect(page.getByRole("heading", { name: "Add Preset" })).toHaveCount(
      0,
    )
  })
})

test.describe("Add preset - moderator", () => {
  test.use({ storageState: authFile.moderator })

  test("Add preset - moderators can enter a new system", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage()
    await page.getByRole("button", { name: "Add preset" }).click()

    await field(page, "System").click()
    await page.getByPlaceholder("Search…").fill("Hydraulics")
    await page.getByRole("option", { name: 'Create "Hydraulics"' }).click()

    await expect(field(page, "System")).toHaveText("Hydraulics")
  })
})
