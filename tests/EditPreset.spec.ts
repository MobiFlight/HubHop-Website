import type { Locator, Page } from "@playwright/test"
import { test, expect, authFile } from "@/tests/fixtures"

/** Picks an option of a shadcn Select (its options open in a popup) */
const choose = async (page: Page, select: Locator, option: string) => {
  await select.click()
  await page.getByRole("option", { name: option, exact: true }).click()
}

test.describe("Edit preset - anonymous", () => {
  test("Edit preset - requires login", async ({ presetViewPage, page }) => {
    await presetViewPage.gotoPage("00000000-0000-4000-8000-000000000006")

    await page.getByRole("button", { name: "View" }).click()

    await expect(
      page.getByText("No permission to edit this preset."),
    ).toBeVisible()
    await expect(page.getByRole("button", { name: "Save" })).toHaveCount(0)
  })
})

test.describe("Edit preset - author", () => {
  test.use({ storageState: authFile.user })

  test("Edit preset - author can change and save their preset", async ({
    presetViewPage,
    page,
  }) => {
    // 00000000-0000-4000-8000-000000000006 "Landing lights on" is authored by the test user
    await presetViewPage.gotoPage("00000000-0000-4000-8000-000000000006")

    await page.getByRole("button", { name: "View" }).click()

    await test.step("Moderator-only fields stay read-only", async () => {
      await expect(page.getByRole("textbox", { name: "System" })).toHaveCount(0)
      await expect(
        page.getByRole("combobox", { name: "Input / Output" }),
      ).toHaveCount(0)
    })

    await test.step("Change vendor, aircraft, name, code and description", async () => {
      await page.getByRole("textbox", { name: "Vendor" }).fill("FlyByWire")
      await page.getByRole("textbox", { name: "Aircraft" }).fill("A32NX")
      await page
        .getByRole("textbox", { name: "Preset name" })
        .fill("Landing lights all on")
      await page.getByRole("textbox", { name: "Code" }).fill("(>K:LANDING_ON)")
      await page
        .getByRole("textbox", { name: "Description" })
        .fill("Turns on all landing lights")
      await page.getByRole("button", { name: "Save" }).click()
    })

    await expect
      .poll(() => presetViewPage.hubHopPage.writeRequests("PUT"))
      .toHaveLength(1)
    const [request] = presetViewPage.hubHopPage.writeRequests("PUT")
    expect(request.path).toBe(
      "/msfs2020/presets/00000000-0000-4000-8000-000000000006",
    )
    expect(request.headers["authorization"]).toBe("Bearer fake-access-token")
    expect(request.body).toMatchObject({
      label: "Landing lights all on",
      code: "(>K:LANDING_ON)",
      description: "Turns on all landing lights",
      vendor: "FlyByWire",
      aircraft: "A32NX",
      system: "Lights",
      path: "FlyByWire.A32NX.Lights.Input.Landing lights all on",
      status: "Updated",
      updatedBy: "Test User",
    })
    await expect(page.getByText("Saved")).toBeVisible()
  })

  test("Edit preset - user cannot edit presets of others", async ({
    presetViewPage,
    page,
  }) => {
    await presetViewPage.gotoPage("00000000-0000-4000-8000-000000000009")

    await page.getByRole("button", { name: "View" }).click()

    await expect(
      page.getByText("No permission to edit this preset."),
    ).toBeVisible()
  })
})

test.describe("Edit preset - moderator", () => {
  test.use({ storageState: authFile.moderator })

  test("Edit preset - moderator can change system and type", async ({
    presetViewPage,
    page,
  }) => {
    await presetViewPage.gotoPage("00000000-0000-4000-8000-000000000009")

    await page.getByRole("button", { name: "View" }).click()
    await page.getByRole("textbox", { name: "System" }).fill("Power")
    const presetType = page.getByRole("combobox", { name: "Input / Output" })
    await test.step("Input/Output offers only the known values", async () => {
      await presetType.click()
      await expect(page.getByRole("option")).toHaveText([
        "Input",
        "Output",
        "Input (Potentiometer)",
      ])
      await page.keyboard.press("Escape")
    })
    await choose(page, presetType, "Output")
    await page.getByRole("button", { name: "Save" }).click()

    await expect
      .poll(() => presetViewPage.hubHopPage.writeRequests("PUT"))
      .toHaveLength(1)
    expect(
      presetViewPage.hubHopPage.writeRequests("PUT")[0].body,
    ).toMatchObject({ system: "Power", presetType: "Output" })
  })

  test("Edit preset - code type can only be one of the known code types", async ({
    presetViewPage,
    page,
  }) => {
    await presetViewPage.gotoPage("650000000000000000000001", "xplane")

    await page.getByRole("button", { name: "View" }).click()

    const codeType = page.getByRole("combobox", { name: "Code Type" })
    await codeType.click()
    await expect(page.getByRole("option")).toHaveText(["DataRef", "Command"])
    await page.getByRole("option", { name: "DataRef", exact: true }).click()
    await page.getByRole("button", { name: "Save" }).click()

    await expect
      .poll(() => presetViewPage.hubHopPage.writeRequests("PUT"))
      .toHaveLength(1)
    expect(
      presetViewPage.hubHopPage.writeRequests("PUT")[0].body,
    ).toMatchObject({ codeType: "DataRef" })
  })
})

test.describe("Edit preset - preset list", () => {
  test.use({ storageState: authFile.moderator })

  test("Edit preset - all fields can be changed in an expanded row", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage()

    const details = await presetsPage.expand("Battery master on")
    await details.getByRole("button", { name: "View" }).click()

    await test.step("Change every field", async () => {
      await details.getByRole("textbox", { name: "Vendor" }).fill("Carenado")
      await details.getByRole("textbox", { name: "Aircraft" }).fill("C182")
      await details.getByRole("textbox", { name: "System" }).fill("Power")
      await choose(
        page,
        details.getByRole("combobox", { name: "Input / Output" }),
        "Output",
      )
      await details
        .getByRole("textbox", { name: "Preset name" })
        .fill("Battery master switch on")
      await details.getByRole("textbox", { name: "Code" }).fill("(>K:BAT_ON)")
      await details
        .getByRole("textbox", { name: "Description" })
        .fill("Turns on the battery")
      await details.getByRole("button", { name: "Save" }).click()
    })

    await expect
      .poll(() => presetsPage.hubHopPage.writeRequests("PUT"))
      .toHaveLength(1)
    expect(presetsPage.hubHopPage.writeRequests("PUT")[0].body).toMatchObject({
      vendor: "Carenado",
      aircraft: "C182",
      system: "Power",
      presetType: "Output",
      label: "Battery master switch on",
      code: "(>K:BAT_ON)",
      description: "Turns on the battery",
      path: "Carenado.C182.Power.Output.Battery master switch on",
    })
    await expect(page.getByText("Saved")).toBeVisible()
  })

  test("Edit preset - a failed save keeps the preset unchanged", async ({
    presetsPage,
    page,
  }) => {
    presetsPage.hubHopPage.api.writeStatus.PUT = 500
    await presetsPage.gotoPage()

    const details = await presetsPage.expand("Battery master on")
    await details.getByRole("button", { name: "View" }).click()
    await details
      .getByRole("textbox", { name: "Preset name" })
      .fill("Battery master switch on")
    await details.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Error - Preset not saved!")).toBeVisible()
    await expect
      .poll(() => presetsPage.hubHopPage.writeRequests("PUT"))
      .toHaveLength(1)

    await test.step("The cached list still has the old name", async () => {
      await presetsPage.hubHopPage.reload()
      await expect(presetsPage.row("Battery master on")).toHaveCount(1)
      await expect(presetsPage.row("Battery master switch on")).toHaveCount(0)
    })
  })

  test("Edit preset - edit mode stays on after the saved message disappears", async ({
    presetsPage,
    page,
  }) => {
    await page.clock.install()
    await presetsPage.gotoPage()

    await test.step("Save a change", async () => {
      const details = await presetsPage.expand("Battery master on")
      await details.getByRole("button", { name: "View" }).click()
      await details
        .getByRole("textbox", { name: "Preset name" })
        .fill("Battery master switch on")
      await details.getByRole("button", { name: "Save" }).click()
      await expect
        .poll(() => presetsPage.hubHopPage.writeRequests("PUT"))
        .toHaveLength(1)
    })

    const other = await presetsPage.expand("Landing lights on")
    await test.step("Edit another preset right away", async () => {
      await other.getByRole("button", { name: "View" }).click()
      await expect(other.getByRole("button", { name: "Save" })).toBeVisible()
    })

    await page.clock.fastForward(6000)

    await expect(other.getByRole("button", { name: "Save" })).toBeVisible()
  })
})
