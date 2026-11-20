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
    <footer className="grid grid-cols-3 items-center justify-between bg-background/50 p-5">
      <div>
        <span>&#169;</span> HubHop and its contributors 2024 - Version 2.9.5
        <p className="text-xs text-muted-foreground">
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
      <div className="flex justify-center">
        <a
          href="https://discord.gg/YMExvWp8eX"
          target="_blank"
          className={linkClass}
          onClick={() => track("discord_click")}
          aria-label="Join us on Discord"
        >
          <IconBrandDiscord className="size-4" />
          <span className="hidden md:block">Join us on Discord</span>
        </a>
      </div>
      <div className="flex flex-col items-end gap-2">
        <a
          href="https://github.com/HubHopAPI/HubHop-Website"
          target="_blank"
          className={linkClass}
          aria-label="Hubhop Source Code"
        >
          <IconBrandGithub className="size-4" />
          <span className="hidden md:block">Hubhop Source Code</span>
        </a>
        <Link href="/terms" className={linkClass} aria-label="Terms of Service">
          <IconFileText className="size-4" />
          <span className="hidden md:block">Terms of Service</span>
        </Link>
        <Link href="/privacy" className={linkClass} aria-label="Privacy Policy">
          <IconFingerprint className="size-4" />
          <span className="hidden md:block">Privacy Policy</span>
        </Link>
        {cookieConsent.enabled && (
          <button
            className={linkClass}
            aria-label="Cookie settings"
            onClick={cookieConsent.openSettings}
          >
            <IconCookie className="size-4" />
            <span className="hidden md:block">Cookie settings</span>
          </button>
        )}
      </div>
    </footer>
  )
}

export default Footer
