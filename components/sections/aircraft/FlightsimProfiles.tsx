import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import ProfileCard from "@/components/sections/Shared/ProfileCard"
import { listOf } from "@/lib/aircraftPages"
import { brandUrl } from "@/lib/hardwarePages"
import { slugify } from "@/lib/presetUrls"
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
            {hardware.map((brand, index) => (
              <span key={brand.name}>
                {index > 0 && " · "}
                <Link
                  href={brandUrl(slugify(brand.name))}
                  className="text-primary hover:underline"
                >
                  {brandLabel(brand)}
                </Link>
                {brand.models.length > 0 &&
                  ` ${brand.models.map((m) => m.name).join(", ")}`}
              </span>
            ))}
          </p>
        )}
      </div>
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {shown.map((profile) => (
          <li key={profile.id}>
            <ProfileCard profile={profile} now={now} />
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
