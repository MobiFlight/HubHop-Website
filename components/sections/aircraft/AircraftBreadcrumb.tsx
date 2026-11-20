import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { aircraftIndexUrl, aircraftUrl } from "@/lib/aircraftPages"
import type { Sim } from "@/lib/presetUrls"

type AircraftBreadcrumbProps = {
  sim: Sim
  vendor: string
  vendorSlug: string
  aircraft: string
  aircraftSlug: string
  // on a system page
  system?: string
}

/** Aircraft › Vendor › Aircraft (› System); the vendor links to its aircraft in the index */
const AircraftBreadcrumb = ({
  sim,
  vendor,
  vendorSlug,
  aircraft,
  aircraftSlug,
  system,
}: AircraftBreadcrumbProps) => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href={aircraftIndexUrl(sim)}>Aircraft</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href={aircraftIndexUrl(sim, vendorSlug)}>{vendor}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        {system ? (
          <BreadcrumbLink asChild>
            <Link href={aircraftUrl(sim, vendorSlug, aircraftSlug)}>
              {aircraft}
            </Link>
          </BreadcrumbLink>
        ) : (
          <BreadcrumbPage>{aircraft}</BreadcrumbPage>
        )}
      </BreadcrumbItem>
      {system && (
        <>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{system}</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
    </BreadcrumbList>
  </Breadcrumb>
)

export default AircraftBreadcrumb
