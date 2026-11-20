import { createContext, useContext, useEffect } from "react"
import * as CookieConsent from "vanilla-cookieconsent"
import { ANALYTICS, cookieConsentConfig } from "@/lib/cookieConsent"
import {
  GTM_ID,
  loadTagManager,
  revokeTagManager,
} from "@/services/googleTagManager"

type CookieConsentContextValue = {
  /** false when no tag is configured, so there is nothing to consent to */
  enabled: boolean
  openSettings: () => void
}

const CookieConsentContext = createContext<CookieConsentContextValue>({
  enabled: false,
  openSettings: () => {},
})

export const useCookieConsent = () => useContext(CookieConsentContext)

type CookieConsentProviderProps = {
  children: React.ReactNode
}

const analyticsAccepted = (cookie: CookieConsent.CookieValue) =>
  cookie.categories.includes(ANALYTICS)

/**
 * Asks for consent with vanilla-cookieconsent (as on mobiflight.com) and loads
 * Google Tag Manager only after the visitor accepted "analytics".
 */
export const CookieConsentProvider = ({
  children,
}: CookieConsentProviderProps) => {
  useEffect(() => {
    if (!GTM_ID) return
    const gtmId = GTM_ID
    // choice stored by the first version of the banner (#141)
    localStorage.removeItem("cookieConsent")
    CookieConsent.run(
      cookieConsentConfig({
        // on every page load with a stored choice, and on the first choice
        onConsent: ({ cookie }) => {
          if (analyticsAccepted(cookie)) loadTagManager(gtmId)
        },
        onChange: ({ cookie }) => {
          if (analyticsAccepted(cookie)) loadTagManager(gtmId)
          else revokeTagManager()
        },
      }),
    )
  }, [])

  return (
    <CookieConsentContext.Provider
      value={{
        enabled: !!GTM_ID,
        openSettings: () => CookieConsent.showPreferences(),
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  )
}
