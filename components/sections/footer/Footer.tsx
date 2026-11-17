import Link from "next/link"
import { FaDiscord, FaFingerprint, FaGithub, FaReadme } from "react-icons/fa"

const Footer: React.FC = () => {
  return (
    <footer className="grid grid-cols-3 items-center justify-between bg-hhBG/50 px-5 py-5 text-hhText">
      <div>
        <span>&#169;</span> HubHop and its contributors 2024 - Version 2.9.5
        <p className="text-xs text-hhText/50">
          Build {process.env.NEXT_PUBLIC_BUILD_NUMBER}
          {process.env.NEXT_PUBLIC_BUILD_COMMIT && (
            <>
              {" · "}
              <a
                href={process.env.NEXT_PUBLIC_BUILD_COMMIT_URL}
                target="_blank"
                className="hover:text-hhOrange"
              >
                {process.env.NEXT_PUBLIC_BUILD_COMMIT}
              </a>
            </>
          )}
        </p>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex">
          <Link legacyBehavior href="https://discord.gg/YMExvWp8eX">
            <a
              className="flex items-center space-x-1 transition-all hover:text-hhOrange"
              target="_blank"
            >
              <FaDiscord />
              <p className="hidden md:block">Join us on Discord</p>
            </a>
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <div>
          <Link
            legacyBehavior
            href="https://github.com/HubHopAPI/HubHop-Website"
          >
            <a
              className="flex items-center justify-around space-x-1 transition-all hover:text-hhOrange"
              target="_blank"
            >
              <FaGithub />
              <p className="hidden md:block">Hubhop Source Code</p>
            </a>
          </Link>
        </div>
        <div>
          <button className="flex items-center justify-around">
            <Link legacyBehavior href="/terms">
              <a className="flex items-center justify-around space-x-1 transition-all hover:text-hhOrange">
                <FaReadme />
                <p className="hidden md:block">Terms of Service</p>
              </a>
            </Link>
          </button>
        </div>
        <div>
          <button className="flex items-center justify-around">
            <Link legacyBehavior href="/privacy">
              <a className="flex items-center justify-around space-x-1 transition-all hover:text-hhOrange">
                <FaFingerprint />
                <p className="hidden md:block">Privacy Policy</p>
              </a>
            </Link>
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
