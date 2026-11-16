import { test, expect, authFile } from "./fixtures"

test.describe("Delete preset - user", () => {
  test.use({ storageState: authFile.user })

  test("Delete preset - only moderators may delete", async ({
    presetViewPage,
    page,
  }) => {
    await presetViewPage.gotoPage("msfs-0006")

    await page.getByRole("button", { name: "Delete" }).click()

    await expect(
      page.getByText("No permission to delete a preset."),
    ).toBeVisible()
    expect(presetViewPage.hubHopPage.writeRequests()).toHaveLength(0)
  })
})

test.describe("Delete preset - moderator", () => {
  test.use({ storageState: authFile.moderator })

  test("Delete preset - cancel keeps the preset", async ({
    presetViewPage,
    page,
  }) => {
    await presetViewPage.gotoPage("msfs-0009")

    await page.getByRole("button", { name: "Delete" }).click()
    await expect(
      page.getByRole("heading", { name: "Delete Preset" }),
    ).toBeVisible()

    await page.getByRole("button", { name: "Cancel" }).click()

    await expect(
      page.getByRole("heading", { name: "Delete Preset" }),
    ).toHaveCount(0)
    expect(presetViewPage.hubHopPage.writeRequests()).toHaveLength(0)
  })

  test("Delete preset - confirm sends the delete request", async ({
    presetViewPage,
    page,
  }) => {
    await presetViewPage.gotoPage("msfs-0009")

    await page.getByRole("button", { name: "Delete" }).click()
    await expect(
      page.getByText("Are you sure you want to delete:"),
    ).toContainText("Battery master on")
    await page.getByRole("button", { name: "Delete" }).last().click()

    await expect(page.getByText("Preset successfully deleted!")).toBeVisible()
    const requests = presetViewPage.hubHopPage.writeRequests("DELETE")
    expect(requests).toHaveLength(1)
    expect(requests[0].path).toBe("/msfs2020/presets/msfs-0009")
    expect(requests[0].headers["authorization"]).toBe(
      "Bearer fake-access-token",
    )
  })
})
