/** The visitor's cookie choice, stored in localStorage */
export type CookieConsent = {
  analytics: boolean
  /** ISO date of the choice */
  date: string
}

export const CONSENT_STORAGE_KEY = "cookieConsent"

/** A choice is valid for a year; after that the banner asks again. */
const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000

/** The stored choice, or null if there is none or it has expired */
export const readConsent = (): CookieConsent | null => {
  try {
    const stored = JSON.parse(
      localStorage.getItem(CONSENT_STORAGE_KEY) ?? "null",
    ) as CookieConsent | null
    if (typeof stored?.analytics !== "boolean") return null
    const age = Date.now() - new Date(stored.date).getTime()
    return age >= 0 && age < CONSENT_MAX_AGE_MS ? stored : null
  } catch {
    return null
  }
}

export const saveConsent = (analytics: boolean): CookieConsent => {
  const consent = { analytics, date: new Date().toISOString() }
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent))
  return consent
}
