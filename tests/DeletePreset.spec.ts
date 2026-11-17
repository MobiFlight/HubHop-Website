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

  test("Delete preset - the close button hides the dialog", async ({
    presetViewPage,
    page,
  }) => {
    await presetViewPage.gotoPage("msfs-0009")

    await page.getByRole("button", { name: "Delete" }).click()
    await page.getByRole("button", { name: "Close dialog" }).click()

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

    await expect(
      page
        .getByRole("status")
        .filter({ hasText: "Preset successfully deleted!" }),
    ).toHaveClass(/bg-green-800/)
    const requests = presetViewPage.hubHopPage.writeRequests("DELETE")
    expect(requests).toHaveLength(1)
    expect(requests[0].path).toBe("/msfs2020/presets/msfs-0009")
    expect(requests[0].headers["authorization"]).toBe(
      "Bearer fake-access-token",
    )
  })
})

test.describe("Delete preset - preset list", () => {
  test.use({ storageState: authFile.moderator })

  test("Delete preset - a failed delete keeps the preset", async ({
    presetsPage,
    page,
  }) => {
    presetsPage.hubHopPage.api.writeStatus.DELETE = 500
    page.on("dialog", (dialog) => dialog.accept())
    await presetsPage.gotoPage()

    const details = await presetsPage.expand("Battery master on")
    await details.getByRole("button", { name: "Delete" }).click()
    await page.getByRole("button", { name: "Delete" }).last().click()
    await expect
      .poll(() => presetsPage.hubHopPage.writeRequests("DELETE"))
      .toHaveLength(1)

    await test.step("The cached list still has the preset", async () => {
      await presetsPage.hubHopPage.reload()
      await expect(presetsPage.row("Battery master on")).toHaveCount(1)
    })
  })
})
