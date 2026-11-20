import { test, expect } from "./fixtures"

test.describe("Preset list", () => {
  test("Preset list - downloads the presets and shows the first page", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage()

    await expect(presetsPage.rows).toHaveCount(15)
    await expect(page.getByText("1–15 of 17")).toBeVisible()
    expect(presetsPage.hubHopPage.downloads.msfs2020).toBe(1)

    await test.step("Go to the next page", async () => {
      await page.getByRole("button", { name: "Next Page" }).click()
      await expect(presetsPage.rows).toHaveCount(2)
    })
  })

  test("Preset list - rows per page can be changed and is remembered", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage()

    await presetsPage.choose(
      page.getByRole("combobox", { name: "Rows per page" }),
      "20",
    )
    await expect(presetsPage.rows).toHaveCount(17)

    await presetsPage.hubHopPage.reload()
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

  test("Preset list - search waits until typing pauses", async ({
    presetsPage,
    page,
  }) => {
    await page.clock.install()
    await presetsPage.gotoPage()
    const historyLength = await page.evaluate(() => history.length)

    await presetsPage.searchFilter.pressSequentially("landing lights")

    await test.step("Nothing is searched while typing", async () => {
      await expect(presetsPage.searchFilter).toHaveValue("landing lights")
      await expect(presetsPage.rows).toHaveCount(15)
      await expect(page).not.toHaveURL(/search=/)
    })

    await page.clock.runFor(300)

    await expect(presetsPage.rows).toHaveCount(2)
    await expect(page).toHaveURL(/search=landing/)
    await test.step("Typing adds no browser history entries", async () => {
      expect(await page.evaluate(() => history.length)).toBe(historyLength)
    })
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

  test("Preset list - search finds all words in any order, also in the system", async ({
    presetsPage,
  }) => {
    await presetsPage.gotoPage()

    // "autopilot" is the system, "hold" is in the name
    await presetsPage.searchFilter.fill("hold autopilot")

    await expect(presetsPage.rows).toHaveCount(3)
    await expect(presetsPage.row("AP heading hold")).toHaveCount(1)
  })

  test("Preset list - search results are sorted by relevance", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage()
    const relevance = page.getByRole("columnheader", { name: "Relevance" })
    await expect(relevance).toHaveCount(0)

    // both words are in "Landing lights on"; "on" is only in the
    // description ("Test description ...") of "Landing lights off"
    await presetsPage.searchFilter.fill("on landing")

    await expect(relevance).toHaveCount(1)
    await expect(presetsPage.rows).toHaveCount(2)
    await expect(presetsPage.rows.nth(0)).toContainText("Landing lights on")
    await expect(
      presetsPage.rows.nth(0).getByRole("meter", { name: "Relevance" }),
    ).toHaveAttribute("aria-valuenow", "100")
    await expect(presetsPage.rows.nth(1)).toContainText("Landing lights off")
    await expect(
      presetsPage.rows.nth(1).getByRole("meter", { name: "Relevance" }),
    ).toHaveAttribute("aria-valuenow", "80")

    await test.step("Typing letter by letter keeps the relevance order", async () => {
      await presetsPage.searchFilter.fill("")
      await presetsPage.searchFilter.pressSequentially("on landing")
      await expect(presetsPage.rows.nth(0)).toContainText("Landing lights on")
      await expect(presetsPage.rows.nth(1)).toContainText("Landing lights off")
    })

    await test.step("Clearing the search hides the relevance", async () => {
      await presetsPage.searchFilter.fill("")
      await expect(relevance).toHaveCount(0)
      await expect(presetsPage.rows).toHaveCount(15)
    })
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
      await presetsPage.choose(presetsPage.vendorFilter, "FlyByWire")
      await expect(page).toHaveURL(/\/presets\/msfs\/flybywire\/$/)
      await expect(presetsPage.rows).toHaveCount(4)
    })
    await test.step("System", async () => {
      await presetsPage.choose(presetsPage.systemFilter, "Autopilot")
      await expect(presetsPage.rows).toHaveCount(2)
      // filter changes are synced via the URL; wait before the next change
      await expect(page).toHaveURL(/system=Autopilot/)
    })
    await test.step("Options only list values of the filtered presets", async () => {
      await presetsPage.expectOptions(presetsPage.presetTypeFilter, [
        "All Inputs/Outputs",
        "Input",
      ])
      await presetsPage.choose(presetsPage.presetTypeFilter, "Input")
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
      await expect(presetsPage.vendorFilter).toHaveText("All Vendors")
    })
    await test.step("Aircraft", async () => {
      await presetsPage.choose(presetsPage.aircraftFilter, "C172")
      // without a vendor, the aircraft is a query parameter
      await expect(page).toHaveURL(/\/presets\/msfs\/\?aircraft=c172$/)
      await expect(presetsPage.rows).toHaveCount(5)
    })
  })

  test("Preset list - a selected filter keeps its sibling options", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage()

    await test.step("Selecting a vendor narrows the other filters only", async () => {
      await presetsPage.choose(presetsPage.vendorFilter, "FlyByWire")
      await expect(page).toHaveURL(/\/flybywire\//)
      await presetsPage.expectOptions(presetsPage.vendorFilter, [
        "All Vendors",
        "Asobo",
        "FlyByWire",
      ])
      await presetsPage.expectOptions(presetsPage.aircraftFilter, [
        "All Aircraft",
        "A32NX",
      ])
    })

    await test.step("Selecting a system keeps the other systems of the vendor", async () => {
      await presetsPage.choose(presetsPage.systemFilter, "Autopilot")
      await expect(page).toHaveURL(/system=Autopilot/)
      await presetsPage.expectOptions(presetsPage.systemFilter, [
        "All Systems",
        "Autopilot",
        "Overhead",
      ])
    })

    await test.step("The vendor can be switched directly", async () => {
      await presetsPage.choose(presetsPage.vendorFilter, "Asobo")
      await expect(page).toHaveURL(
        /\/presets\/msfs\/asobo\/\?system=Autopilot$/,
      )
      await expect(presetsPage.rows).toHaveCount(5)
      await presetsPage.expectOptions(presetsPage.systemFilter, [
        "All Systems",
        "Autopilot",
        "Electrical",
        "Engine",
        "Lights",
      ])
    })
  })

  test("Preset list - filters are prefilled from the URL", async ({
    presetsPage,
  }) => {
    await presetsPage.gotoPage("msfs/asobo/c172/?system=Engine")

    await expect(presetsPage.vendorFilter).toHaveText("Asobo")
    await expect(presetsPage.aircraftFilter).toHaveText("C172")
    await expect(presetsPage.rows).toHaveCount(2)
    await expect(presetsPage.row("Oil temperature")).toHaveCount(1)
  })

  // independent of the order the server sends or the cache returns (#61)
  test("Preset list - presets are listed by vendor, aircraft and name", async ({
    presetsPage,
  }) => {
    await presetsPage.gotoPage()

    const names = [
      "AP altitude hold",
      "AP heading hold",
      "AP master toggle",
      "AP NAV mode",
      "AP speed hold",
      "Landing lights off",
      "Landing lights on",
      "Strobe toggle",
      "Alternator 1 on",
    ]
    await Promise.all(
      names.map((name, index) =>
        expect(presetsPage.rows.nth(index)).toContainText(name),
      ),
    )
  })

  test("Preset list - sorts by preset name", async ({ presetsPage, page }) => {
    await presetsPage.gotoPage()

    await page.getByRole("columnheader", { name: "Preset name" }).click()
    // sorting ignores case: "Alternator ..." sorts before "AP ..."
    await expect(presetsPage.rows.first()).toContainText("Alternator 1 on")

    await page.getByRole("columnheader", { name: "Preset name" }).click()
    await expect(presetsPage.rows.first()).toContainText("Strobe toggle")
  })

  test("Preset list - switching to X-Plane shows X-Plane presets", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage()
    await expect(presetsPage.codeTypeFilter).toHaveCount(0)

    await presetsPage.xplaneSwitch.click()

    await expect(presetsPage.rows).toHaveCount(5)
    await expect(presetsPage.row("Beacon toggle")).toHaveCount(1)
    expect(presetsPage.hubHopPage.downloads.xplane).toBe(1)

    await test.step("Code type filter is available for X-Plane", async () => {
      await presetsPage.expectOptions(presetsPage.codeTypeFilter, [
        "All Code Types",
        "DataRef",
        "Command",
      ])
      await presetsPage.choose(presetsPage.codeTypeFilter, "DataRef")
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
    ).toHaveAttribute(
      "href",
      "/presets/msfs/asobo/c172/battery-master-on-00000000-0000-4000-8000-000000000009/",
    )
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
      api.presets.msfs2020.push({
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
