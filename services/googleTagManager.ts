/**
 * Google Tag Manager with Consent Mode v2 in "basic" mode: the container is
 * only loaded after the visitor accepted analytics cookies, so nothing is sent
 * to Google before. Ad signals always stay denied.
 */

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

/** Cookies set by Google Analytics */
const ANALYTICS_COOKIE = /^(_ga|_gid|_gat)/

// gtag() must push the `arguments` object; GTM ignores plain arrays.
const gtag: (...args: unknown[]) => void = function () {
  window.dataLayer = window.dataLayer ?? []
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments)
}

const isLoaded = () =>
  document.querySelector("script[data-google-tag-manager]") !== null

/** Loads the container once; call only after the visitor accepted. */
export const loadTagManager = (id: string) => {
  if (isLoaded()) return
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  })
  gtag("consent", "update", { analytics_storage: "granted" })
  window.dataLayer?.push({ "gtm.start": Date.now(), event: "gtm.js" })

  const script = document.createElement("script")
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`
  script.dataset.googleTagManager = ""
  document.head.appendChild(script)
}

/**
 * Withdraws consent: deletes the analytics cookies and, if the container is
 * already running, reloads the page so no Google tag stays active.
 */
export const revokeTagManager = () => {
  const loaded = isLoaded()
  if (loaded) gtag("consent", "update", { analytics_storage: "denied" })
  deleteAnalyticsCookies()
  if (loaded) window.location.reload()
}

/** Analytics cookies may be set on the host or any parent domain. */
const deleteAnalyticsCookies = () => {
  const parts = window.location.hostname.split(".")
  const domains = parts.map((_, i) => parts.slice(i).join("."))
  const expired = "expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
  document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0].trim())
    .filter((name) => ANALYTICS_COOKIE.test(name))
    .forEach((name) => {
      document.cookie = `${name}=; ${expired}`
      domains.forEach((domain) => {
        document.cookie = `${name}=; ${expired}; domain=${domain}`
      })
    })
}
