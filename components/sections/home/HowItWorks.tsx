const steps = [
  {
    title: "Find the preset",
    text: "Filter by vendor, aircraft and system — or just search.",
  },
  {
    title: "Update MobiFlight",
    text: "Extras › HubHop › Download Latest Presets.",
  },
  {
    title: "Assign it to your hardware",
    text: "Pick it in any button, encoder or display config.",
  },
]

/** "From HubHop to your panel": three steps and an example from a real preset */
const HowItWorks = () => (
  <section
    aria-labelledby="how-it-works"
    className="flex min-w-0 flex-[1_1_340px] flex-col gap-4"
  >
    <h2 id="how-it-works" className="text-3xl font-extrabold">
      From HubHop to your panel
    </h2>
    <ol className="flex flex-col gap-3">
      {steps.map(({ title, text }, index) => (
        <li key={title} className="flex gap-4 rounded-2xl border bg-card p-5">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary font-extrabold text-primary-foreground"
          >
            {index + 1}
          </span>
          <span className="flex flex-col">
            <strong className="text-lg">{title}</strong>
            <span className="text-muted-foreground">{text}</span>
          </span>
        </li>
      ))}
    </ol>
    <figure className="flex flex-col gap-1 rounded-2xl border bg-background px-5 py-4">
      <figcaption className="text-sm text-muted-foreground">
        FenixSim · A320 · APU master switch on
      </figcaption>
      <code className="font-mono text-sm text-primary">
        1 (&gt;L:S_OH_ELEC_APU_MASTER)
      </code>
    </figure>
  </section>
)

export default HowItWorks
