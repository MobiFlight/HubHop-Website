import Link from "next/link"
import {
  IconBrandDiscord,
  IconBrandGithub,
  IconCookie,
  IconFileText,
  IconFingerprint,
} from "@tabler/icons-react"
import { useCookieConsent } from "../Shared/CookieConsent"
import { track } from "../../../services/analytics"

const linkClass = "flex items-center gap-1 transition-colors hover:text-primary"

const Footer = () => {
  const cookieConsent = useCookieConsent()
  return (
    <footer className="border-t bg-background/80">
      <div className="container mx-auto flex flex-wrap items-center gap-x-7 gap-y-3 px-6 py-8 text-sm text-muted-foreground">
        <div>
          <p>
            &#169; {new Date().getFullYear()} HubHop and its contributors ·
            Version 2.9.5
          </p>
          <p className="text-xs">
            Build {process.env.NEXT_PUBLIC_BUILD_NUMBER}
            {process.env.NEXT_PUBLIC_BUILD_COMMIT && (
              <>
                {" · "}
                <a
                  href={process.env.NEXT_PUBLIC_BUILD_COMMIT_URL}
                  target="_blank"
                  className="hover:text-primary"
                >
                  {process.env.NEXT_PUBLIC_BUILD_COMMIT}
                </a>
              </>
            )}
          </p>
        </div>
        <div className="flex-1" />
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center gap-x-7 gap-y-3"
        >
          <a
            href="https://discord.gg/YMExvWp8eX"
            target="_blank"
            className={linkClass}
            onClick={() => track("discord_click")}
            aria-label="Join us on Discord"
          >
            <IconBrandDiscord className="size-4" />
            Join us on Discord
          </a>
          <a
            href="https://github.com/HubHopAPI/HubHop-Website"
            target="_blank"
            className={linkClass}
            aria-label="Hubhop Source Code"
          >
            <IconBrandGithub className="size-4" />
            Source code
          </a>
          <Link
            href="/terms"
            className={linkClass}
            aria-label="Terms of Service"
          >
            <IconFileText className="size-4" />
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className={linkClass}
            aria-label="Privacy Policy"
          >
            <IconFingerprint className="size-4" />
            Privacy Policy
          </Link>
          {cookieConsent.enabled && (
            <button
              className={linkClass}
              aria-label="Cookie settings"
              onClick={cookieConsent.openSettings}
            >
              <IconCookie className="size-4" />
              Cookie settings
            </button>
          )}
        </nav>
      </div>
    </footer>
  )
}

export default Footer
