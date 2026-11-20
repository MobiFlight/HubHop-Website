import { test as setup, expect, authFile, testUser } from "@/tests/fixtures"

/**
 * Creates Playwright storage states for the test personas by logging in
 * through the UI against the fake identity provider. MSAL encrypts its
 * localStorage cache with a key kept in a session cookie; storage states
 * contain both, so later tests start logged in.
 */

setup("create anonymous state", async ({ page }) => {
  await page.context().storageState({ path: authFile.anonymous })
})

setup("create user state", async ({ hubHopPage, page }) => {
  await hubHopPage.login("user")
  await expect(page.getByRole("button", { name: testUser.name })).toBeVisible()
  await page.context().storageState({ path: authFile.user })
})

setup("create moderator state", async ({ hubHopPage, page }) => {
  await hubHopPage.login("user,moderator")
  await expect(page.getByRole("button", { name: testUser.name })).toBeVisible()
  await page.context().storageState({ path: authFile.moderator })
})
