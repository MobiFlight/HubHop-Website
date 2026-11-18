import Link from "next/link"
import { createContext, useContext, useEffect, useId, useState } from "react"
import {
  type CookieConsent as Consent,
  readConsent,
  saveConsent,
} from "../../../lib/consent"
import {
  GTM_ID,
  loadTagManager,
  revokeTagManager,
} from "../../../services/googleTagManager"

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

/**
 * Asks for consent to analytics cookies and loads Google Tag Manager only
 * after the visitor accepted.
 */
export const CookieConsentProvider = ({
  children,
}: CookieConsentProviderProps) => {
  // undefined until the stored choice has been read on the client
  const [consent, setConsent] = useState<Consent | null | undefined>()
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    if (GTM_ID) setConsent(readConsent())
  }, [])

  useEffect(() => {
    if (GTM_ID && consent?.analytics) loadTagManager(GTM_ID)
  }, [consent])

  const choose = (analytics: boolean) => {
    setConsent(saveConsent(analytics))
    setSettingsOpen(false)
    if (!analytics) revokeTagManager()
  }

  return (
    <CookieConsentContext.Provider
      value={{ enabled: !!GTM_ID, openSettings: () => setSettingsOpen(true) }}
    >
      {children}
      {GTM_ID && (consent === null || settingsOpen) && (
        <CookieBanner consent={consent ?? null} onChoose={choose} />
      )}
    </CookieConsentContext.Provider>
  )
}

type CookieBannerProps = {
  consent: Consent | null
  onChoose: (analytics: boolean) => void
}

const buttonClass =
  "rounded-lg bg-hhOrange px-6 py-1.5 text-sm font-semibold text-hhBG transition-all hover:bg-hhOrangeShade-600"

const CookieBanner = ({ consent, onChoose }: CookieBannerProps) => {
  const titleId = useId()
  return (
    <section
      role="dialog"
      aria-labelledby={titleId}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-hhOrange/50 bg-hhBG px-5 py-4 text-hhText shadow-lg"
    >
      <div className="container mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1 text-sm">
          <h2 id={titleId} className="text-base font-bold">
            Cookies on HubHop
          </h2>
          <p>
            We&apos;d like to use Google Analytics to learn how HubHop is used
            and to improve it. This sets cookies and sends usage data to Google,
            including to servers in the USA. Nothing is sent unless you accept.
            You can change your choice at any time under &quot;Cookie
            settings&quot; at the bottom of every page. Details are in our{" "}
            <Link href="/privacy" className="underline hover:text-hhOrange">
              privacy policy
            </Link>
            .
          </p>
          {consent && (
            <p className="text-hhText/70">
              Your current choice: {consent.analytics ? "accepted" : "rejected"}
              .
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-3">
          <button className={buttonClass} onClick={() => onChoose(true)}>
            Accept
          </button>
          <button className={buttonClass} onClick={() => onChoose(false)}>
            Reject
          </button>
        </div>
      </div>
    </section>
  )
}
