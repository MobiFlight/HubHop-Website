import Link from "next/link"
import type { SheetPreset, SystemSheet } from "@/lib/aircraftPages"

type PresetColumnProps = {
  title: string
  presets: SheetPreset[]
  count: number
}

const PresetColumn = ({ title, presets, count }: PresetColumnProps) => (
  <div className="flex min-w-0 flex-col">
    <h3 className="border-b px-5 py-3 text-xs font-bold tracking-widest text-muted-foreground uppercase">
      {title} ({count})
    </h3>
    {presets.length > 0 ? (
      <ul className="divide-y">
        {presets.map((preset) => (
          <li key={preset.id} className="flex flex-col gap-1 px-5 py-3">
            <span className="font-semibold">{preset.label}</span>
            <code className="font-mono text-sm break-all text-primary">
              {preset.code}
            </code>
            {preset.author && (
              <span className="text-xs text-muted-foreground">
                by {preset.author}
              </span>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <p className="px-5 py-3 text-sm text-muted-foreground">None yet</p>
    )}
  </div>
)

type SystemSectionProps = {
  system: SystemSheet
  // the system's own page, when the cheat sheet shows only part of it
  allPresetsUrl?: string
  // h2 on a cheat sheet; the system page has its own h1
  heading?: boolean
}

/** A system: inputs ("what you press") and outputs ("what lights up") side by side */
const SystemSection = ({
  system,
  allPresetsUrl,
  heading = true,
}: SystemSectionProps) => (
  <section
    id={system.slug}
    aria-label={heading ? undefined : system.name}
    aria-labelledby={heading ? `${system.slug}-heading` : undefined}
    className="flex scroll-mt-4 flex-col gap-3"
  >
    {heading && (
      <h2 id={`${system.slug}-heading`} className="text-2xl font-extrabold">
        {system.name}{" "}
        <span className="text-base font-normal text-muted-foreground">
          {system.total} presets
        </span>
      </h2>
    )}
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="grid md:grid-cols-2 md:divide-x">
        <PresetColumn
          title="Inputs — what you press"
          presets={system.inputs}
          count={system.inputCount}
        />
        <PresetColumn
          title="Outputs — what lights up"
          presets={system.outputs}
          count={system.outputCount}
        />
      </div>
      {allPresetsUrl && (
        <div className="flex justify-end border-t px-5 py-3">
          <Link
            href={allPresetsUrl}
            className="font-semibold text-primary hover:underline"
          >
            Show all {system.total} {system.name} presets →
          </Link>
        </div>
      )}
    </div>
  </section>
)

export default SystemSection
