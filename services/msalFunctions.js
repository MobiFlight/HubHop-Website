import { msalInstance, msalReady } from "./msal"

export async function getUserSettings() {
  const url = process.env.NEXT_PUBLIC_HUBHOP_API_BASEURL + "/settings/user"
  const options = {
    method: "GET",
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  }
  fetch(url, options)
    .then((response) => response.json())
    .then((userSettings) => {
      localStorage.setItem("roles", userSettings.roles)
    })
}

export async function getAccessToken() {
  await msalReady
  const accounts = msalInstance.getAllAccounts()
  var silentRequest = {
    scopes: [process.env.NEXT_PUBLIC_HUBHOP_OAUTH_SCOPES],
    account: accounts[0],
    forceRefresh: false,
  }
  try {
    const tokenResponse = await msalInstance.acquireTokenSilent(silentRequest)
    localStorage.setItem("accessToken", tokenResponse.accessToken)
  } catch (error) {
    console.error(
      `"Silent token acquisition failed. Using interactive mode" + ${error}`,
    )
    const tokenResponse = await msalInstance.acquireTokenPopup(silentRequest)
    console.log(
      `Access token acquired via interactive auth ${tokenResponse.accessToken}`,
    )
    localStorage.setItem("accessToken", tokenResponse.accessToken)
  }
}
