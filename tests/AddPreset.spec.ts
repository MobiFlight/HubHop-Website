import type { Locator } from "@playwright/test"
import { test, expect, authFile } from "./fixtures"

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

const fillForm = (form: Locator) =>
  test.step("Fill in the form", async () => {
    const selects = form.getByRole("combobox")
    await selects.nth(0).selectOption("Asobo")
    await selects.nth(1).selectOption("C172")
    await selects.nth(2).selectOption("Electrical")
    await selects.nth(3).selectOption("Input")
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
    await fillForm(form)

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
    const selects = page.locator("form").getByRole("combobox")
    const [vendor, aircraft, system] = [0, 1, 2].map((i) => selects.nth(i))

    await vendor.selectOption("FlyByWire")

    await expect(aircraft.getByRole("option")).toHaveText([
      "All Aircraft",
      "A32NX",
    ])
    await test.step("All systems stay available", async () => {
      await expect(system.getByRole("option")).toHaveText([
        "All Systems",
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
    const selects = page.locator("form").getByRole("combobox")
    const [vendor, aircraft] = [0, 1].map((i) => selects.nth(i))

    await aircraft.selectOption("C172")

    await expect(vendor).toHaveValue("Asobo")
    await expect(vendor.getByRole("option")).toHaveText([
      "All Vendors",
      "Asobo",
    ])
  })

  test("Add preset - Input/Output offers only the known values", async ({
    page,
  }) => {
    const presetType = page.locator("form").getByRole("combobox").nth(3)

    await expect(presetType.getByRole("option")).toHaveText([
      "All Inputs/Outputs",
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
    const selects = form.getByRole("combobox")

    await test.step("Select aircraft and system", async () => {
      await selects.nth(1).selectOption("C172")
      await selects.nth(2).selectOption("Electrical")
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
      await selects.nth(3).selectOption("Output")
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
    await fillForm(form)

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
    const form = page.locator("form")

    await expect(
      form.getByRole("button", { name: "Enter a new vendor" }),
    ).toBeVisible()
    await expect(
      form.getByRole("button", { name: "Enter a new aircraft" }),
    ).toBeVisible()
    await expect(
      form.getByRole("button", { name: "Enter a new system" }),
    ).toHaveCount(0)
  })

  test("Add preset - close hides the dialog", async ({ page }) => {
    await page.getByRole("button", { name: "Close", exact: true }).click()

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
    const form = page.locator("form")

    await form.getByRole("button", { name: "Enter a new system" }).click()

    await expect(form.getByPlaceholder("Provide a system name")).toBeVisible()
    await expect(
      form.getByRole("button", { name: "Choose an existing system" }),
    ).toBeVisible()
  })
})
