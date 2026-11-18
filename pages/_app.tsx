"use client"

import "vanilla-cookieconsent/dist/cookieconsent.css"
import "../styles/globals.css"
import { AppProps } from "next/app"
import { MsalProvider } from "@azure/msal-react"
import { msalInstance } from "../services/msal"
import { CookieConsentProvider } from "../components/sections/Shared/CookieConsent"

type SafeHydrateProps = {
  children: React.ReactNode
}

export const SafeHydrate = ({ children }: SafeHydrateProps) => {
  return <div suppressHydrationWarning>{children}</div>
}

function App({ Component, pageProps }: AppProps) {
  return (
    <MsalProvider instance={msalInstance}>
      <CookieConsentProvider>
        <SafeHydrate>
          <Component {...pageProps} suppressHydrationWarning />
        </SafeHydrate>
      </CookieConsentProvider>
    </MsalProvider>
  )
}

export default App
