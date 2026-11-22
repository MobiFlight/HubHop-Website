import Image from "next/image"
import Link from "next/link"
import { IconStarFilled } from "@tabler/icons-react"
import { formatDate, timeAgo } from "@/lib/aircraftPages"
import type { FlightsimProfile } from "@/lib/flightsimProfiles"

type ProfileCardProps = {
  profile: FlightsimProfile
  // the aircraft's cheat sheets, on the hardware pages
  aircraft?: { name: string; url: string }[]
  // "updated 3 days ago" is counted from here
  now: number
}

// flightsim.to's CDN serves the thumbnail as is
const passThrough = ({ src }: { src: string }) => src

/** A MobiFlight profile on flightsim.to: thumbnail, title, author, rating, last update */
const ProfileCard = ({ profile, aircraft = [], now }: ProfileCardProps) => (
  <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-colors has-[a.profile:hover]:border-primary">
    <a
      href={profile.link}
      target="_blank"
      rel="noopener"
      className="profile flex flex-1 items-center"
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
        <span className="line-clamp-2 font-semibold">{profile.title}</span>
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
    {aircraft.length > 0 && (
      <p className="border-t px-4 py-2 text-sm text-muted-foreground">
        Cheat sheet:{" "}
        {aircraft.map((entry, index) => (
          <span key={entry.url}>
            {index > 0 && ", "}
            <Link href={entry.url} className="text-primary hover:underline">
              {entry.name}
            </Link>
          </span>
        ))}
      </p>
    )}
  </div>
)

export default ProfileCard
