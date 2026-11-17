import * as msal from "@azure/msal-browser"

export const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_HUBHOP_OAUTH_CLIENTID,
    authority: process.env.NEXT_PUBLIC_HUBHOP_OAUTH_AUTHORITY,
    knownAuthorities: [process.env.NEXT_PUBLIC_HUBHOP_OAUTH_KNOWN_AUTHORITIES],
    redirectUri: process.env.NEXT_PUBLIC_HUBHOP_OAUTH_REDIRECT_URI_DEV,
    postLogoutRedirectUri: "/",
  },
  cache: {
    cacheLocation: "localStorage",
  },
}

export const msalInstance = new msal.PublicClientApplication(msalConfig)

// MSAL (v3+) must be initialized before any other API is used.
// Await this before calling msalInstance directly.
export const msalReady =
  typeof window === "undefined"
    ? Promise.resolve()
    : msalInstance.initialize().then(() => {
        const accounts = msalInstance.getAllAccounts()
        if (accounts.length > 0) {
          msalInstance.setActiveAccount(accounts[0])
        }
      })
