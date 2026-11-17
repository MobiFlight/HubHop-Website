import { test, expect, authFile } from "./fixtures"

test.describe("Edit preset - anonymous", () => {
  test("Edit preset - requires login", async ({ presetViewPage, page }) => {
    await presetViewPage.gotoPage("msfs-0006")

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
    // msfs-0006 "Landing lights on" is authored by the test user
    await presetViewPage.gotoPage("msfs-0006")

    await page.getByRole("button", { name: "View" }).click()

    await test.step("Moderator-only fields stay read-only", async () => {
      await expect(page.getByRole("textbox", { name: "System" })).toHaveCount(0)
      await expect(
        page.getByRole("textbox", { name: "Input / Output" }),
      ).toHaveCount(0)
    })

    await test.step("Change name and code", async () => {
      await page
        .getByRole("textbox", { name: "Preset name" })
        .fill("Landing lights all on")
      await page.getByRole("textbox", { name: "Code" }).fill("(>K:LANDING_ON)")
      await page.getByRole("button", { name: "Save" }).click()
    })

    await expect
      .poll(() => presetViewPage.hubHopPage.writeRequests("PUT"))
      .toHaveLength(1)
    const [request] = presetViewPage.hubHopPage.writeRequests("PUT")
    expect(request.path).toBe("/msfs2020/presets/msfs-0006")
    expect(request.headers["authorization"]).toBe("Bearer fake-access-token")
    expect(request.body).toMatchObject({
      label: "Landing lights all on",
      code: "(>K:LANDING_ON)",
      vendor: "Asobo",
      system: "Lights",
      path: "Asobo.A320neo.Lights.Input.Landing lights all on",
      status: "Updated",
      updatedBy: "Test User",
    })
    await expect(page.getByText("Saved")).toBeVisible()
  })

  test("Edit preset - user cannot edit presets of others", async ({
    presetViewPage,
    page,
  }) => {
    await presetViewPage.gotoPage("msfs-0009")

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
    await presetViewPage.gotoPage("msfs-0009")

    await page.getByRole("button", { name: "View" }).click()
    await page.getByRole("textbox", { name: "System" }).fill("Power")
    await page.getByRole("textbox", { name: "Input / Output" }).fill("Output")
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
    await presetViewPage.gotoPage("xplane-0001", "xplane")

    await page.getByRole("button", { name: "View" }).click()

    const codeType = page.getByRole("combobox", { name: "Code Type" })
    await expect(codeType.getByRole("option")).toHaveText([
      "DataRef",
      "Command",
    ])
    await codeType.selectOption("DataRef")
    await page.getByRole("button", { name: "Save" }).click()

    await expect
      .poll(() => presetViewPage.hubHopPage.writeRequests("PUT"))
      .toHaveLength(1)
    expect(
      presetViewPage.hubHopPage.writeRequests("PUT")[0].body,
    ).toMatchObject({ codeType: "DataRef" })
  })
})
