import { Button } from "@/components/ui/button"

const steps = [
  { title: "Install MobiFlight", text: "and connect your board or device." },
  {
    title: "Download the latest presets",
    text: "Extras › HubHop › Download Latest Presets.",
  },
  {
    title: "Assign and fly",
    text: "Pick a preset for each button, encoder or light.",
  },
]

type NewToMobiFlightProps = {
  // "the FenixSim A320"
  aircraft: string
}

/** For visitors from search engines who don't know MobiFlight yet */
const NewToMobiFlight = ({ aircraft }: NewToMobiFlightProps) => (
  <section
    aria-labelledby="new-to-mobiflight"
    className="grid gap-6 rounded-2xl border bg-card p-8 lg:grid-cols-[2fr_3fr]"
  >
    <div className="flex flex-col items-start gap-4">
      <h2 id="new-to-mobiflight" className="text-3xl font-extrabold">
        New to MobiFlight?
      </h2>
      <p className="text-muted-foreground">
        MobiFlight connects your switches, encoders and displays to {aircraft} —
        every preset on this page is ready to use in it.
      </p>
      <Button asChild size="lg">
        <a href="https://www.mobiflight.com/en/download.html">
          Download MobiFlight
        </a>
      </Button>
    </div>
    <ol className="grid gap-3 sm:grid-cols-3">
      {steps.map(({ title, text }, index) => (
        <li
          key={title}
          className="flex flex-col gap-2 rounded-xl border bg-background p-5"
        >
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-lg bg-primary font-extrabold text-primary-foreground"
          >
            {index + 1}
          </span>
          <strong>{title}</strong>
          <span className="text-sm text-muted-foreground">{text}</span>
        </li>
      ))}
    </ol>
  </section>
)

export default NewToMobiFlight
