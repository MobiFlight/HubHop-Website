import { test as setup } from "@playwright/test"
import { loadEnvConfig } from "@next/env"
import fs from "fs"
import path from "path"
import { AUTH_DIR, authFile, testUser } from "./fixtures/auth"

/**
 * Creates Playwright storage states for the test personas.
 *
 * Logged-in states are a fake MSAL session: an account entry in the MSAL
 * localStorage cache (what `msalInstance.getAllAccounts()` reads), plus the
 * values the app keeps in localStorage after login (`username`, `roles`,
 * `accessToken`). No real B2C credentials are involved; the API is mocked.
 */

const ORIGIN = "http://localhost:3000"

loadEnvConfig(path.join(__dirname, ".."))
const clientId = process.env.NEXT_PUBLIC_HUBHOP_OAUTH_CLIENTID || "client-id"
const environment =
  process.env.NEXT_PUBLIC_HUBHOP_OAUTH_KNOWN_AUTHORITIES || "login.example.com"

const writeState = (file: string, localStorage: Record<string, string>) => {
  fs.mkdirSync(AUTH_DIR, { recursive: true })
  const state = {
    cookies: [],
    origins: [
      {
        origin: ORIGIN,
        localStorage: Object.entries(localStorage).map(([name, value]) => ({
          name,
          value,
        })),
      },
    ],
  }
  fs.writeFileSync(file, JSON.stringify(state, null, 2))
}

const fakeSession = (roles: string): Record<string, string> => {
  const realm = "test-tenant"
  const localAccountId = "test-user-id"
  const homeAccountId = `${localAccountId}-b2c_1_signin.${realm}`
  const accountKey = `${homeAccountId}-${environment}-${realm}`.toLowerCase()
  const account = {
    homeAccountId,
    environment,
    realm,
    localAccountId,
    username: testUser.username,
    name: testUser.name,
    authorityType: "MSSTS",
  }
  return {
    "msal.account.keys": JSON.stringify([accountKey]),
    [`msal.token.keys.${clientId}`]: JSON.stringify({
      idToken: [],
      accessToken: [],
      refreshToken: [],
    }),
    [accountKey]: JSON.stringify(account),
    username: testUser.name,
    roles,
    accessToken: "fake-access-token",
  }
}

setup("create anonymous state", async () => {
  writeState(authFile.anonymous, {})
})

setup("create user state", async () => {
  writeState(authFile.user, fakeSession("user"))
})

setup("create moderator state", async () => {
  writeState(authFile.moderator, fakeSession("user,moderator"))
})
