import Link from "next/link"
import { Button } from "@/components/ui/button"
import { presetListUrl, type Sim } from "@/lib/presetUrls"
import { track } from "@/services/analytics"

type ContributeBandProps = {
  sim: Sim
}

/** "Built a switch that works? Share it." */
const ContributeBand = ({ sim }: ContributeBandProps) => (
  <section aria-labelledby="contribute" className="container mx-auto px-6">
    <div className="relative flex flex-wrap items-center gap-8 overflow-hidden rounded-3xl border bg-card p-8 md:p-12">
      {/* low-poly facets of the HubHop background */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMaxYMax slice"
        className="pointer-events-none absolute right-0 bottom-0 h-full w-96 fill-primary"
      >
        <polygon points="400,60 220,300 400,300" opacity="0.14" />
        <polygon points="400,60 300,0 220,300" opacity="0.07" />
        <polygon points="220,300 300,0 140,120" opacity="0.04" />
      </svg>
      <div className="relative flex min-w-0 flex-[999_1_480px] flex-col gap-3">
        <h2 id="contribute" className="text-4xl font-extrabold">
          Built a switch that works? Share it.
        </h2>
        <p className="max-w-xl text-lg text-muted-foreground">
          Every preset here was added by someone in the cockpit-building
          community. Yours makes the next person’s panel work on the first try.
        </p>
      </div>
      <div className="relative flex flex-[1_1_340px] flex-wrap gap-3">
        {/* opens the preset list; the add form gets its own address in #193 */}
        <Button asChild size="lg" className="h-12 px-6 text-base">
          <Link
            href={presetListUrl({ sim })}
            onClick={() => track("add_preset_click")}
          >
            Add a preset
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-12 px-6 text-base"
        >
          <a
            href="https://discord.gg/YMExvWp8eX"
            target="_blank"
            onClick={() => track("discord_click")}
          >
            Join us on Discord
          </a>
        </Button>
      </div>
    </div>
  </section>
)

export default ContributeBand
