import { useEffect, useRef, useState } from "react"
import { PROMOTIONS_ENABLED } from "../../../lib/features"
import {
  bestPromotions,
  pickWeighted,
  PROMOTIONS,
  promotionLabel,
  promotionUrl,
  type Promotion,
  type PromotionContext,
  type SlotId,
} from "../../../lib/promotions"

type PromoSlotProps = {
  slot: SlotId
  context?: PromotionContext
  className?: string
}

// Promotions currently on screen, so two slots on one page show different ones.
const shownIds = new Set<string>()

// The single place that decides whether promotions are shown at all.
// Step 2 of #98 hides them for MobiFlight Club members here.
export const showPromotions = () => PROMOTIONS_ENABLED

const PromoSlot = ({ slot, context = {}, className = "" }: PromoSlotProps) => {
  const [promotion, setPromotion] = useState<Promotion>()
  const current = useRef<Promotion>(undefined)
  const { sim, vendor, aircraft, search } = context

  // Picked on the client: the page is a static export and must render the same
  // HTML as on the server first. A new context only replaces the promotion if
  // it no longer fits, so typing a search doesn't make it flicker.
  useEffect(() => {
    if (!showPromotions()) return
    const previous = current.current
    const fits = { sim, vendor, aircraft, search }
    const others = Array.from(shownIds).filter((id) => id !== previous?.id)
    const candidates = bestPromotions(slot, fits, PROMOTIONS, others)
    const best = candidates.length
      ? candidates
      : bestPromotions(slot, fits, PROMOTIONS)
    const next =
      previous && best.some((p) => p.id === previous.id)
        ? previous
        : pickWeighted(best)
    if (previous) shownIds.delete(previous.id)
    if (next) shownIds.add(next.id)
    current.current = next
    setPromotion(next)
  }, [slot, sim, vendor, aircraft, search])

  useEffect(
    () => () => {
      if (current.current) shownIds.delete(current.current.id)
    },
    [],
  )

  if (!promotion) return null

  const sponsored = promotion.kind === "sponsor"
  return (
    <aside
      aria-label="Promotion"
      className={`rounded-lg bg-hhCard/40 p-4 text-hhText ${className}`}
    >
      <p className="text-xs tracking-wide text-hhText/60 uppercase">
        {promotionLabel[promotion.kind]}
      </p>
      <h2 className="mt-1 text-lg font-semibold text-hhOrange">
        {promotion.title}
      </h2>
      <p className="mt-1 text-sm">{promotion.text}</p>
      <a
        href={promotionUrl(promotion, slot)}
        target="_blank"
        rel={sponsored ? "sponsored noopener" : "noopener"}
        className="mt-3 inline-block rounded-lg bg-hhOrange px-4 py-2 font-semibold text-hhBG transition-all hover:bg-hhOrangeShade-600"
      >
        {promotion.cta}
      </a>
    </aside>
  )
}

export default PromoSlot
