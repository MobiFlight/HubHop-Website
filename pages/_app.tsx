"use client";

import "../styles/globals.css";
import { AppProps } from "next/app";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "../services/msal";

export const SafeHydrate: React.FC = ({ children }) => {
  return <div suppressHydrationWarning>{children}</div>;
};

const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}

function App({ Component, pageProps }: AppProps) {
  return (
    <MsalProvider instance={msalInstance}>
      <SafeHydrate>
        <Component {...pageProps} suppressHydrationWarning />
      </SafeHydrate>
    </MsalProvider>
  );
}

export default App;
