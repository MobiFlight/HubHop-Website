import Link from "next/link"
import { presetListUrl, type Sim } from "../../../lib/presetUrls"
import { track } from "../../../services/analytics"
import type { VendorCount } from "../../../services/libraryStats"

const format = (value: number) => value.toLocaleString("en-US")

type MakersProps = {
  sim: Sim
  // the vendors with the most presets, from the build
  vendors: VendorCount[]
  vendorCount: number
}

/** "Browse by aircraft maker": the vendors with the most presets */
const Makers = ({ sim, vendors, vendorCount }: MakersProps) => {
  const more = vendorCount - vendors.length
  return (
    <section
      aria-labelledby="makers"
      className="container mx-auto flex flex-col gap-5 px-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 id="makers" className="text-3xl font-extrabold">
          Browse by aircraft maker
        </h2>
        <Link
          href={presetListUrl({ sim })}
          className="font-semibold text-primary hover:underline"
        >
          All presets →
        </Link>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
        {vendors.map((vendor) => (
          <li key={vendor.slug}>
            <Link
              href={presetListUrl({ sim, vendor: vendor.slug })}
              onClick={() => track("vendor_click", { vendor: vendor.name })}
              className="flex h-full flex-col gap-1 rounded-xl border bg-card p-5 transition-colors hover:border-primary"
            >
              <strong className="text-lg">{vendor.name}</strong>
              <span className="text-sm text-muted-foreground">
                {format(vendor.presets)} presets
              </span>
            </Link>
          </li>
        ))}
        {more > 0 && (
          <li>
            <Link
              href={presetListUrl({ sim })}
              className="flex h-full items-center rounded-xl border border-dashed p-5 text-lg font-bold text-primary transition-colors hover:border-primary"
            >
              + {more} more makers
            </Link>
          </li>
        )}
      </ul>
    </section>
  )
}

export default Makers
