import { test, expect, authFile, testUser } from "./fixtures"

test.describe("User menu - anonymous", () => {
  test("User menu - shows the login button", async ({ hubHopPage, page }) => {
    await hubHopPage.goto("/")

    await expect(page.getByRole("button", { name: "Log-in" })).toBeVisible()
  })

  test("User menu - log in and log out", async ({ hubHopPage, page }) => {
    await hubHopPage.goto("/")

    await test.step("Log in through the login popup", async () => {
      await hubHopPage.login("user")
      await expect(
        page.getByRole("button", { name: testUser.name }),
      ).toBeVisible()
      expect(hubHopPage.requests.some((r) => r.path === "/settings/user")).toBe(
        true,
      )
    })

    await test.step("Log out", async () => {
      // the pointer still rests where the Log-in button was; move it away so
      // hovering the user name triggers mouseenter
      await page.mouse.move(0, 0)
      await page.getByRole("button", { name: testUser.name }).hover()
      await page.getByRole("button", { name: "Log-out" }).click()
      await expect(page.getByRole("button", { name: "Log-in" })).toBeVisible()
      expect(
        await page.evaluate(() => localStorage.getItem("roles")),
      ).toBeNull()
    })
  })
})

test.describe("User menu - logged in", () => {
  test.use({ storageState: authFile.user })

  test("User menu - shows the user and offers logout", async ({
    hubHopPage,
    page,
  }) => {
    await hubHopPage.goto("/")

    const userButton = page.getByRole("button", { name: testUser.name })
    await expect(userButton).toBeVisible()
    await expect(page.getByRole("button", { name: "Log-in" })).toHaveCount(0)

    await userButton.hover()
    await expect(page.getByText(testUser.username)).toBeVisible()
    await expect(page.getByRole("button", { name: "Log-out" })).toBeVisible()
  })

  test("User menu - show my presets filters the list", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage()

    await page.getByRole("button", { name: "Show my presets" }).click()

    // one preset authored and one updated by the test user
    await expect(presetsPage.rows).toHaveCount(2)
    await expect(
      page.getByRole("button", { name: "Show reported presets" }),
    ).toHaveCount(0)
  })
})

test.describe("User menu - moderator", () => {
  test.use({ storageState: authFile.moderator })

  test("User menu - moderators can show reported presets", async ({
    presetsPage,
    page,
  }) => {
    await presetsPage.gotoPage()

    await page.getByRole("button", { name: "Show reported presets" }).click()

    await expect(presetsPage.rows).toHaveCount(1)
    await expect(presetsPage.row("Battery master on")).toHaveCount(1)
  })
})
