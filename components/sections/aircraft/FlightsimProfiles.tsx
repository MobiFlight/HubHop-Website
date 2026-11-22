import Image from "next/image"
import { useEffect, useState } from "react"
import { IconStarFilled } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { formatDate, listOf, timeAgo } from "@/lib/aircraftPages"
import {
  PROFILE_PREVIEW,
  PROFILES_ANCHOR,
  type FlightsimProfile,
} from "@/lib/flightsimProfiles"
import { brandLabel, type BrandSummary } from "@/lib/profileHardware"

type FlightsimProfilesProps = {
  aircraft: string
  profiles: FlightsimProfile[]
  // the brands and models named in the profiles' titles, most profiles first
  hardware: BrandSummary[]
  // when the page was built: "3 days ago" in the HTML, recalculated in the browser
  builtAt: string
}

// flightsim.to's CDN serves the thumbnail as is
const passThrough = ({ src }: { src: string }) => src

/** Community MobiFlight profiles for the aircraft, on flightsim.to */
const FlightsimProfiles = ({
  aircraft,
  profiles,
  hardware,
  builtAt,
}: FlightsimProfilesProps) => {
  const [showAll, setShowAll] = useState(false)
  // the page is built at night: the browser knows how long ago it really was
  const [now, setNow] = useState(() => new Date(builtAt).getTime())
  useEffect(() => setNow(Date.now()), [])
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
          {hardware.length > 0
            ? `MobiFlight profiles for ${listOf(hardware.slice(0, 3).map(brandLabel))}`
            : "MobiFlight profiles on flightsim.to"}
        </h2>
        <p className="text-muted-foreground">
          Ready-made profiles for the {aircraft} and the cockpit hardware they
          were built for, shared by the community on flightsim.to.
        </p>
        {/* every exact model, as people search for it */}
        {hardware.length > 0 && (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Hardware:</span>{" "}
            {hardware
              .map((brand) =>
                brand.models.length
                  ? `${brandLabel(brand)} ${brand.models.map((m) => m.name).join(", ")}`
                  : brandLabel(brand),
              )
              .join(" · ")}
          </p>
        )}
      </div>
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {shown.map((profile) => (
          <li key={profile.id}>
            <a
              href={profile.link}
              target="_blank"
              rel="noopener"
              className="flex h-full items-center overflow-hidden rounded-lg border bg-card transition-colors hover:border-primary"
            >
              {profile.thumbnail && (
                <span className="relative block w-28 shrink-0 self-stretch bg-black/30 sm:w-34">
                  <Image
                    src={profile.thumbnail}
                    alt=""
                    fill
                    unoptimized
                    loader={passThrough}
                    sizes="136px"
                    className="object-cover"
                  />
                </span>
              )}
              <span className="flex min-w-0 flex-1 flex-col gap-1 px-4 py-3">
                <span className="line-clamp-2 font-semibold">
                  {profile.title}
                </span>
                <span className="text-sm text-muted-foreground sm:truncate">
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
                  {" · updated "}
                  <time
                    dateTime={profile.updatedAt}
                    title={formatDate(profile.updatedAt)}
                  >
                    {timeAgo(profile.updatedAt, now)}
                  </time>
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
