import Head from "next/head"
import Link from "next/link"
import Layout from "@/components/Layout"
import { aircraftUrl } from "@/lib/aircraftPages"
import { slugify, type Sim } from "@/lib/presetUrls"
import { useEffect, useState } from "react"

import PresetCard from "@/components/sections/presets/ui/PresetCard"
import type { Preset } from "@/interfaces/preset"
import { IconLoader2, IconMoodSad } from "@tabler/icons-react"

type PresetViewProps = {
  sim: Sim
  // undefined while loading, empty if the preset doesn't exist
  preset: Preset[] | undefined
  history: Preset[]
  loading: boolean
}

const PresetView = ({ sim, preset, history, loading }: PresetViewProps) => {
  const [id, setId] = useState("")
  const [updatedBy, setUpdatedBy] = useState<string>()
  const [createdDate, setCreatedDate] = useState<string>()
  const [version, setVersion] = useState(1)
  const [reported, setReported] = useState<number | null>()
  const [vendor, setVendor] = useState("")
  const [aircraft, setAircraft] = useState("")
  const [system, setSystem] = useState("")
  const [presetType, setPresetType] = useState<Preset["presetType"]>("Input")
  const [codeType, setCodeType] = useState<Preset["codeType"]>("")
  const [label, setLabel] = useState("")
  const [code, setCode] = useState("")
  const [description, setDescription] = useState<string | null>()
  const [author, setAuthor] = useState("")
  const [notFound, setNotFound] = useState(false)
  const [loadingPreset, setLoadingPreset] = useState(true)

  useEffect(() => {
    // undefined: preset is still being loaded
    if (preset === undefined) {
      setLoadingPreset(true)
      return
    }
    if (preset && preset.length) {
      setId(preset[0].id)
      setUpdatedBy(preset[0].updatedBy)
      setCreatedDate(preset[0].createdDate)
      setVersion(preset[0].version)
      setReported(preset[0].reported)
      setVendor(preset[0].vendor)
      setAircraft(preset[0].aircraft)
      setSystem(preset[0].system)
      setPresetType(preset[0].presetType)
      setCodeType(preset[0].codeType || "")
      setLabel(preset[0].label)
      setCode(preset[0].code)
      setDescription(preset[0].description)
      setAuthor(preset[0].author)
      setNotFound(false)
    } else {
      setNotFound(true)
    }
    setLoadingPreset(false)
  }, [preset])

  return (
    // single presets stay out of search engines; the aircraft cheat sheets are indexed instead
    <Layout title="Preset | Hubhop by Mobiflight" noindex>
      <Head>
        <title>{label || "Preset View"}</title>
      </Head>
      {loadingPreset ? (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <IconLoader2 className="size-16 animate-spin text-primary" />
          <p className="mt-5">Loading Preset</p>
        </div>
      ) : notFound ? (
        <div className="flex h-[80vh] items-center justify-center">
          <div className="flex flex-col items-center space-y-5">
            <IconMoodSad className="size-24" />
            <h2 className="text-center text-4xl">
              This preset does not exist or has been deleted
            </h2>
          </div>
        </div>
      ) : (
        <>
          <div className="container mx-auto mt-5 px-3 xl:px-0">
            <Link
              href={aircraftUrl(sim, slugify(vendor), slugify(aircraft))}
              className="font-semibold text-primary hover:underline"
            >
              All presets of the {vendor} {aircraft}: cheat sheet →
            </Link>
          </div>
          <PresetCard
            id={id}
            label={label}
            updatedBy={updatedBy}
            author={author}
            createdDate={createdDate}
            version={version}
            reported={reported}
            vendor={vendor}
            aircraft={aircraft}
            system={system}
            presetType={presetType}
            codeType={codeType}
            code={code}
            description={description}
            loading={loading}
            history={history}
            showingHistory={true}
            text=""
            card
            setVendor={setVendor}
            setAircraft={setAircraft}
            setSystem={setSystem}
            setPresetType={setPresetType}
            setCodeType={setCodeType}
            setLabel={setLabel}
            setCode={setCode}
            setDescription={setDescription}
          />
        </>
      )}
    </Layout>
  )
}

export default PresetView
