import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import {
  bestPromotions,
  pickWeighted,
  PROMOTIONS,
  promotionLabel,
  promotionUrl,
  type Promotion,
  type PromotionContext,
  type SlotId,
} from "@/lib/promotions"
import { loadMobiFlightPromotions } from "@/services/promotionSources"
import { track } from "@/services/analytics"

// shop promotions aren't counted yet
const trackClick = (kind: Promotion["kind"], slot: SlotId) => {
  if (kind === "news") track("news_click", { slot })
  if (kind === "sponsor") track("sponsor_click", { slot })
  if (kind === "club") track("club_click", { slot })
  if (kind === "donation") track("donate_click", { slot })
}

type PromoSlotProps = {
  slot: SlotId
  context?: PromotionContext
  // card: image on top; row: image on the left when the slot is wide enough
  layout?: "card" | "row"
  className?: string
}

// Promotions currently on screen, so two slots on one page show different ones.
const shownIds = new Set<string>()

// The single place that decides whether promotions are shown at all.
// Step 2 of #98 hides them for MobiFlight Club members here.
export const showPromotions = () => true

// images come from mobiflight.com as they are (next.config uses a custom loader)
const passThrough = ({ src }: { src: string }) => src

// The feed's texts use **bold**, its only Markdown.
const withBold = (line: string) =>
  line
    .split(/\*\*(.+?)\*\*/)
    .map((part, index) =>
      index % 2 ? <strong key={index}>{part}</strong> : part,
    )

const PromoSlot = ({
  slot,
  context = {},
  layout = "card",
  className = "",
}: PromoSlotProps) => {
  // our own promotions plus those from mobiflight.com; undefined while loading
  const [promotions, setPromotions] = useState<Promotion[]>()
  const [promotion, setPromotion] = useState<Promotion>()
  const current = useRef<Promotion>(undefined)
  const { sim, vendor, aircraft, search } = context

  useEffect(() => {
    if (!showPromotions()) return
    const effect = { active: true }
    loadMobiFlightPromotions().then((loaded) => {
      if (effect.active) setPromotions([...PROMOTIONS, ...loaded])
    })
    return () => {
      effect.active = false
    }
  }, [])

  // Picked on the client: the page is a static export and must render the same
  // HTML as on the server first. A new context only replaces the promotion if
  // it no longer fits, so typing a search doesn't make it flicker.
  useEffect(() => {
    if (!promotions) return
    const previous = current.current
    const fits = { sim, vendor, aircraft, search }
    const others = Array.from(shownIds).filter((id) => id !== previous?.id)
    const candidates = bestPromotions(slot, fits, promotions, others)
    const best = candidates.length
      ? candidates
      : bestPromotions(slot, fits, promotions)
    const next =
      previous && best.some((p) => p.id === previous.id)
        ? previous
        : pickWeighted(best)
    if (previous) shownIds.delete(previous.id)
    if (next) shownIds.add(next.id)
    current.current = next
    setPromotion(next)
  }, [promotions, slot, sim, vendor, aircraft, search])

  useEffect(
    () => () => {
      if (current.current) shownIds.delete(current.current.id)
    },
    [],
  )

  if (!promotion) return null

  const href = promotionUrl(promotion, slot)
  const rel = promotion.kind === "sponsor" ? "sponsored noopener" : "noopener"
  const row = layout === "row"
  const { media } = promotion
  return (
    <aside
      aria-label="Promotion"
      className={`@container overflow-hidden rounded-lg bg-card text-foreground ${className}`}
    >
      {/* row: image on the left once the slot itself is wide enough */}
      <div className={`flex h-full flex-col ${row ? "@md:flex-row" : ""}`}>
        {media && (
          // the button below is the accessible link; the image is a larger click target
          <a
            href={href}
            target="_blank"
            rel={rel}
            onClick={() => trackClick(promotion.kind, slot)}
            tabIndex={-1}
            aria-hidden="true"
            // the same box for all images, so slots next to each other line up: 16:9 on top,
            // or a column as high as the slot on the left; feed images have no fixed
            // aspect ratio, so they are scaled to fit, not cropped
            className={`relative block aspect-video w-full shrink-0 ${
              row ? "@md:aspect-auto @md:min-h-32 @md:w-56" : ""
            } ${media.type === "logo" ? "bg-white" : "bg-black/30"}`}
          >
            <Image
              src={media.src}
              alt={media.alt}
              fill
              unoptimized
              loader={passThrough}
              sizes={row ? "224px" : "384px"}
              className={`object-contain ${media.type === "logo" ? "p-6" : ""}`}
            />
          </a>
        )}
        <div className="flex flex-1 flex-col p-4">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            {promotionLabel[promotion.kind]}
            {promotion.date && ` · ${promotion.date}`}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-primary">
            {promotion.title}
          </h2>
          {promotion.content.map((line) => (
            <p key={line} className="mt-1 text-sm">
              {withBold(line)}
            </p>
          ))}
          {/* keeps the buttons of slots next to each other on one line */}
          <div className="min-h-3 flex-1" />
          <a
            href={href}
            target="_blank"
            rel={rel}
            onClick={() => trackClick(promotion.kind, slot)}
            className="self-start rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground transition-all hover:bg-primary/80"
          >
            {promotion.action.title}
          </a>
        </div>
      </div>
    </aside>
  )
}

export default PromoSlot
