import { test, expect, authFile } from "./fixtures"

test.describe("Add preset - anonymous", () => {
  test("Add preset - anonymous users are sent to the login", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage()

    const loginRequest = page.waitForRequest(/b2clogin\.com/)
    await page.getByRole("button", { name: "Add preset" }).click()

    await loginRequest
    await expect(page.getByRole("heading", { name: "Add Preset" })).toHaveCount(
      0,
    )
  })
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
    const selects = form.getByRole("combobox")

    await test.step("Fill in the form", async () => {
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

  test("Add preset - shows similar presets while typing", async ({ page }) => {
    const form = page.locator("form")

    await form.getByPlaceholder("Alternator 1 On").fill("Landing lights")

    await expect(form.getByText("2 presets found.")).toBeVisible()
    await expect(
      form.getByRole("link", { name: "Landing lights on" }),
    ).toBeVisible()
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

  test("Add preset - close hides the dialog", async ({ page }) => {
    await page.getByRole("button", { name: "Close" }).click()

    await expect(page.getByRole("heading", { name: "Add Preset" })).toHaveCount(
      0,
    )
  })
})
