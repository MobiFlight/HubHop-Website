import * as msal from "@azure/msal-browser";

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
    storeAuthStateInCookie: true,
  },
};

export const msalInstance = new msal.PublicClientApplication(msalConfig);