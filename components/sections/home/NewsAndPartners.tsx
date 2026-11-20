import PromoSlot from "../Shared/PromoSlot"
import { PROMOTIONS, type PromotionSim } from "../../../lib/promotions"
import { track } from "../../../services/analytics"

const donation = PROMOTIONS.find((promotion) => promotion.kind === "donation")

type NewsAndPartnersProps = {
  sim: PromotionSim
}

/** News from mobiflight.com, a sponsor and the MobiFlight Club, as on mobiflight.com */
const NewsAndPartners = ({ sim }: NewsAndPartnersProps) => (
  <section
    aria-labelledby="news-and-partners"
    className="container mx-auto flex flex-col gap-5 px-6"
  >
    <h2 id="news-and-partners" className="text-3xl font-extrabold">
      MobiFlight news &amp; partners
    </h2>
    <div className="grid gap-4 md:grid-cols-3">
      <PromoSlot slot="home-news" context={{ sim }} className="border" />
      <PromoSlot slot="home-sponsor" context={{ sim }} className="border" />
      <PromoSlot slot="home-club" context={{ sim }} className="border" />
    </div>
    {donation && (
      <p className="text-muted-foreground">
        Did HubHop help you?{" "}
        <a
          href={donation.action.url}
          target="_blank"
          rel="noopener"
          onClick={() => track("donate_click", { slot: "home" })}
          className="font-semibold text-primary hover:underline"
        >
          {donation.action.title}
        </a>
      </p>
    )}
  </section>
)

export default NewsAndPartners
