import Image from "next/image"
import { useState } from "react"
import { IconExternalLink, IconStarFilled } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/aircraftPages"
import {
  PROFILE_PREVIEW,
  PROFILES_ANCHOR,
  type FlightsimProfile,
} from "@/lib/flightsimProfiles"

type FlightsimProfilesProps = {
  aircraft: string
  profiles: FlightsimProfile[]
}

// flightsim.to's CDN serves the thumbnail as is
const passThrough = ({ src }: { src: string }) => src

/** Community MobiFlight profiles for the aircraft, on flightsim.to */
const FlightsimProfiles = ({ aircraft, profiles }: FlightsimProfilesProps) => {
  const [showAll, setShowAll] = useState(false)
  if (profiles.length === 0) return null
  const shown = showAll ? profiles : profiles.slice(0, PROFILE_PREVIEW)

  return (
    <section
      id={PROFILES_ANCHOR}
      aria-labelledby={`${PROFILES_ANCHOR}-title`}
      className="flex scroll-mt-4 flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <h2 id={`${PROFILES_ANCHOR}-title`} className="text-2xl font-extrabold">
          MobiFlight profiles on flightsim.to
        </h2>
        <p className="text-muted-foreground">
          Ready-made profiles for the {aircraft} and the cockpit hardware they
          were built for, shared by the community on flightsim.to.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((profile) => (
          <li key={profile.id}>
            <a
              href={profile.link}
              target="_blank"
              rel="noopener"
              className="flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-primary"
            >
              {profile.thumbnail && (
                <span className="relative block aspect-video w-full bg-black/30">
                  <Image
                    src={profile.thumbnail}
                    alt=""
                    fill
                    unoptimized
                    loader={passThrough}
                    sizes="384px"
                    className="object-cover"
                  />
                </span>
              )}
              <span className="flex flex-1 flex-col gap-1 p-4">
                <span className="font-semibold">{profile.title}</span>
                <span className="text-sm text-muted-foreground">
                  by {profile.author}
                  {profile.rating > 0 && (
                    <>
                      {" · "}
                      <IconStarFilled
                        aria-hidden="true"
                        className="inline size-3.5 text-primary"
                      />{" "}
                      <span className="sr-only">rated </span>
                      {profile.rating.toFixed(1)}
                    </>
                  )}
                </span>
                <span className="text-sm text-muted-foreground">
                  Updated {formatDate(profile.updatedAt)}
                </span>
                <span className="mt-auto flex items-center gap-1 pt-2 text-sm font-semibold text-primary">
                  View on flightsim.to
                  <IconExternalLink aria-hidden="true" className="size-4" />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      {!showAll && profiles.length > PROFILE_PREVIEW && (
        <Button
          variant="outline"
          className="self-start"
          onClick={() => setShowAll(true)}
        >
          Show all {profiles.length} profiles
        </Button>
      )}
    </section>
  )
}

export default FlightsimProfiles
