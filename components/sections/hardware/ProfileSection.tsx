import { useState } from "react"
import ProfileCard from "@/components/sections/Shared/ProfileCard"
import { Button } from "@/components/ui/button"
import { PROFILE_PREVIEW } from "@/lib/flightsimProfiles"
import type { HardwareProfile } from "@/lib/hardwarePages"

type ProfileSectionProps = {
  id: string
  heading: string
  profiles: HardwareProfile[]
  now: number
}

/** One product of a brand (or its other profiles), newest profiles first */
const ProfileSection = ({
  id,
  heading,
  profiles,
  now,
}: ProfileSectionProps) => {
  const [showAll, setShowAll] = useState(false)
  const shown = showAll ? profiles : profiles.slice(0, PROFILE_PREVIEW)
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="flex scroll-mt-4 flex-col gap-4"
    >
      <h2 id={`${id}-heading`} className="text-2xl font-extrabold">
        {heading}{" "}
        <span className="text-base font-normal text-muted-foreground">
          {profiles.length} {profiles.length === 1 ? "profile" : "profiles"}
        </span>
      </h2>
      <ul className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {shown.map((profile) => (
          <li key={profile.id}>
            <ProfileCard
              profile={profile}
              aircraft={profile.aircraft}
              now={now}
            />
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

export default ProfileSection
