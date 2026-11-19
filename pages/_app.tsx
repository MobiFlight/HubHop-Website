"use client"

import "vanilla-cookieconsent/dist/cookieconsent.css"
import "../styles/globals.css"
import { AppProps } from "next/app"
import { MsalProvider } from "@azure/msal-react"
import { msalInstance } from "../services/msal"
import { CookieConsentProvider } from "../components/sections/Shared/CookieConsent"
import { Assistant, JetBrains_Mono } from "next/font/google"

const assistant = Assistant({ subsets: ["latin"] })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

type SafeHydrateProps = {
  children: React.ReactNode
}

export const SafeHydrate = ({ children }: SafeHydrateProps) => {
  return <div suppressHydrationWarning>{children}</div>
}

function App({ Component, pageProps }: AppProps) {
  return (
    <MsalProvider instance={msalInstance}>
      {/* on :root, so dialogs and menus rendered outside the app get the fonts too */}
      <style jsx global>{`
        :root {
          --font-assistant: ${assistant.style.fontFamily};
          --font-jetbrains-mono: ${jetbrainsMono.style.fontFamily};
        }
      `}</style>
      <CookieConsentProvider>
        <SafeHydrate>
          <Component {...pageProps} suppressHydrationWarning />
        </SafeHydrate>
      </CookieConsentProvider>
    </MsalProvider>
  )
}

export default App
