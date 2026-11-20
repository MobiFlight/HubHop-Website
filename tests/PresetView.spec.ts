import { test, expect, authFile } from "./fixtures"

test.describe("Preset view", () => {
  test("Preset view - shows a single preset", async ({
    presetViewPage,
    page,
  }) => {
    await presetViewPage.gotoPage("msfs-0009")

    await expect(
      page.getByRole("heading", { name: "Battery master on" }),
    ).toBeVisible()
    await expect(page).toHaveTitle("Battery master on")
    await expect(page.getByRole("textbox", { name: "Code" })).toHaveValue(
      "(>K:TEST_0009)",
    )
    await expect(page.getByText("No History available")).toBeVisible()
  })

  test("Preset view - unknown preset shows a not found message", async ({
    presetViewPage,
    page,
  }) => {
    await presetViewPage.gotoPage("does-not-exist")

    await expect(
      page.getByRole("heading", {
        name: "This preset does not exist or has been deleted",
      }),
    ).toBeVisible()
  })

  test("Preset view - shows the version history", async ({
    presetViewPage,
    page,
  }) => {
    await presetViewPage.gotoPage("msfs-0001")

    await expect(presetViewPage.historyToggle).toContainText(
      "Preset history with 3 versions",
    )

    await presetViewPage.historyToggle.click()
    const labels = page.getByRole("textbox", { name: "Preset name" })
    await expect(labels).toHaveCount(0)
    await expect(page.getByText("AP master on", { exact: true })).toBeVisible()
    await expect(page.getByText("AP master", { exact: true })).toBeVisible()
    await expect(page.getByText("Revert to version")).toHaveCount(0)
  })

  test("Preset view - X-Plane preset shows its code type", async ({
    presetViewPage,
    page,
  }) => {
    await presetViewPage.gotoPage("xplane-0002", "xplane")

    await expect(page.getByRole("heading", { name: "AP state" })).toBeVisible()
    await expect(page.getByText("DataRef", { exact: true })).toBeVisible()
    await expect(presetViewPage.historyToggle).toHaveCount(0)
  })
})

test.describe("Preset view - moderator", () => {
  test.use({ storageState: authFile.moderator })

  test("Preset view - moderator can revert to an older version", async ({
    presetViewPage,
    page,
  }) => {
    await presetViewPage.gotoPage("msfs-0001")
    await presetViewPage.historyToggle.click()

    // the revert action is a clickable element, not a button
    const revertButtons = page.getByText("Revert to version")
    await expect(revertButtons).toHaveCount(3)

    await test.step("Revert to version 1", async () => {
      // history is sorted newest first
      await revertButtons.last().click()
      await expect(
        page.getByText("Are you sure you want to revert this preset?"),
      ).toBeVisible()
      await page.getByRole("button", { name: "Yes" }).click()
    })

    await expect
      .poll(() => presetViewPage.hubHopPage.writeRequests("PUT"))
      .toHaveLength(1)
    const [request] = presetViewPage.hubHopPage.writeRequests("PUT")
    expect(request.path).toBe("/msfs2020/presets/msfs-0001")
    expect(request.body).toMatchObject({ label: "AP master", version: 1 })
    await expect(presetViewPage.title).toHaveText("AP master")
  })
})
