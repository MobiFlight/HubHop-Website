import { test, expect } from "./fixtures"

test.describe("Preset list", () => {
  test("Preset list - downloads the presets and shows the first page", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage()

    await expect(presetsPage.rows).toHaveCount(15)
    expect(presetsPage.hubHopPage.downloads.msfs2020).toBe(1)

    await test.step("Go to the next page", async () => {
      await page.getByRole("button", { name: "Next Page" }).click()
      await expect(presetsPage.rows).toHaveCount(2)
    })
  })

  test("Preset list - rows per page can be changed", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage()

    await page
      .getByRole("combobox", { name: "Rows per page:" })
      .selectOption("20")
    await expect(presetsPage.rows).toHaveCount(17)
  })

  test("Preset list - search filters by name and updates the URL", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage()

    await presetsPage.searchFilter.fill("landing lights")
    await expect(presetsPage.rows).toHaveCount(2)
    await expect(presetsPage.row("Landing lights on")).toHaveCount(1)
    await expect(page).toHaveURL(
      /search=landing\+lights|search=landing%20lights/,
    )
  })

  test("Preset list - search also matches the code", async ({
    presetsPage,
  }) => {
    await presetsPage.gotoPage()

    await presetsPage.searchFilter.fill("TEST_0007")
    await expect(presetsPage.rows).toHaveCount(1)
    await expect(presetsPage.row("Landing lights off")).toHaveCount(1)
  })

  test("Preset list - search matches who updated a preset", async ({
    presetsPage,
  }) => {
    await presetsPage.gotoPage()

    await presetsPage.searchFilter.fill("Test User")
    // authored by Test User, and updated by Test User
    await expect(presetsPage.rows).toHaveCount(2)
    await expect(presetsPage.row("Landing lights on")).toHaveCount(1)
    await expect(presetsPage.row("AP master toggle")).toHaveCount(1)
  })

  test("Preset list - presets without an aircraft are listed", async ({
    presetsPage,
  }) => {
    const presets = presetsPage.hubHopPage.api.presets.msfs2020 as object[]
    presets.push({
      ...presets[0],
      id: "msfs-generic",
      label: "Generic gear lever",
      aircraft: "",
    })
    await presetsPage.gotoPage()

    await presetsPage.searchFilter.fill("Generic gear lever")
    await expect(presetsPage.rows).toHaveCount(1)
  })

  test("Preset list - vendor, aircraft, system and type filters", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage()

    await test.step("Vendor", async () => {
      await presetsPage.vendorFilter.selectOption("FlyByWire")
      await expect(page).toHaveURL(/vendor=FlyByWire/)
      await expect(presetsPage.rows).toHaveCount(4)
    })
    await test.step("System", async () => {
      await presetsPage.systemFilter.selectOption("Autopilot")
      await expect(presetsPage.rows).toHaveCount(2)
      // filter changes are synced via the URL; wait before the next change
      await expect(page).toHaveURL(/system=Autopilot/)
    })
    await test.step("Options only list values of the filtered presets", async () => {
      await expect(presetsPage.presetTypeFilter.getByRole("option")).toHaveText(
        ["All Inputs/Outputs", "Input"],
      )
      await presetsPage.presetTypeFilter.selectOption("Input")
      await expect(page).toHaveURL(/presetType=Input/)
      await expect(presetsPage.rows).toHaveCount(2)
    })
    await test.step("No matches", async () => {
      await presetsPage.searchFilter.fill("does not exist")
      await expect(page).toHaveURL(/search=does/)
      await expect(presetsPage.rows).toHaveCount(0)
      await expect(
        page.getByText("There are no records to display"),
      ).toBeVisible()
    })
    await test.step("Reset", async () => {
      await page.getByRole("button", { name: "Reset Filters" }).click()
      await expect(presetsPage.rows).toHaveCount(15)
      await expect(presetsPage.vendorFilter).toHaveValue("")
    })
    await test.step("Aircraft", async () => {
      await presetsPage.aircraftFilter.selectOption("C172")
      await expect(presetsPage.rows).toHaveCount(5)
    })
  })

  test("Preset list - filters are prefilled from the URL", async ({
    presetsPage,
  }) => {
    await presetsPage.gotoPage("?vendor=Asobo&aircraft=C172&system=Engine")

    await expect(presetsPage.vendorFilter).toHaveValue("Asobo")
    await expect(presetsPage.aircraftFilter).toHaveValue("C172")
    await expect(presetsPage.rows).toHaveCount(2)
    await expect(presetsPage.row("Oil temperature")).toHaveCount(1)
  })

  test("Preset list - sorts by preset name", async ({ presetsPage, page }) => {
    await presetsPage.gotoPage()

    await page.getByRole("columnheader", { name: "Preset name" }).click()
    // sorting is case-sensitive: "AP ..." sorts before "Al..."
    await expect(presetsPage.rows.first()).toContainText("AP NAV mode")

    await page.getByRole("columnheader", { name: "Preset name" }).click()
    await expect(presetsPage.rows.first()).toContainText("Strobe toggle")
  })

  test("Preset list - switching to X-Plane shows X-Plane presets", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage()
    await expect(presetsPage.codeTypeFilter).toHaveCount(0)

    await presetsPage.simToggle.click()

    await expect(presetsPage.rows).toHaveCount(5)
    await expect(presetsPage.row("Beacon toggle")).toHaveCount(1)
    expect(presetsPage.hubHopPage.downloads.xplane).toBe(1)

    await test.step("Code type filter is available for X-Plane", async () => {
      await expect(presetsPage.codeTypeFilter.getByRole("option")).toHaveText([
        "All Code Types",
        "DataRef",
        "Command",
      ])
      await presetsPage.codeTypeFilter.selectOption("DataRef")
      await expect(presetsPage.rows).toHaveCount(2)
    })
    await expect(page.locator("body")).toHaveClass(/xplane/)
  })

  test("Preset list - expanding a row shows the preset details", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage()

    await presetsPage.expand("Battery master on")

    await expect(page.getByRole("textbox", { name: "Code" })).toHaveValue(
      "(>K:TEST_0009)",
    )
    await expect(
      page.getByRole("textbox", { name: "Description" }),
    ).toHaveValue("Test description for Battery master on")
    await expect(
      page.getByRole("link", { name: "View Details" }),
    ).toHaveAttribute("href", "/preset/?simType=msfs2020&id=msfs-0009")
  })
})

test.describe("Preset list - local cache", () => {
  test("Preset cache - does not download again when nothing changed", async ({
    presetsPage,
  }) => {
    await presetsPage.gotoPage()
    await expect(presetsPage.rows).toHaveCount(15)

    await presetsPage.hubHopPage.reload()
    await expect(presetsPage.rows).toHaveCount(15)

    expect(presetsPage.hubHopPage.downloads.msfs2020).toBe(1)
  })

  test("Preset cache - downloads again when the server has newer presets", async ({
    presetsPage,
  }) => {
    await presetsPage.gotoPage()
    await expect(presetsPage.rows).toHaveCount(15)

    await test.step("Server gets a new preset", async () => {
      const api = presetsPage.hubHopPage.api
      ;(api.presets.msfs2020 as any[]).push({
        ...(api.presets.msfs2020[1] as object),
        id: "msfs-new",
        label: "Brand new preset",
        createdDate: "2024-04-01T10:00:00.000Z",
      })
      api.last.msfs2020 = [
        { _id: "msfs-new", createdDate: "2024-04-01T10:00:00.000Z" },
      ]
    })

    await presetsPage.hubHopPage.reload()
    await presetsPage.searchFilter.fill("Brand new")
    await expect(presetsPage.row("Brand new preset")).toHaveCount(1)
    expect(presetsPage.hubHopPage.downloads.msfs2020).toBe(2)
  })
})
