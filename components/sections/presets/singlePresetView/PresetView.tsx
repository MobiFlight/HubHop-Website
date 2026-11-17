import Head from "next/head"
import Layout from "../../../Layout"
import { useEffect, useState } from "react"

import PresetCard, { type PresetToasts } from "../ui/PresetCard"
import type { Preset } from "../../../../interfaces/preset"
import type { InputChangeEvent } from "../ui/PresetInputLabel"
import { BiSad } from "react-icons/bi"
import { AiOutlineLoading } from "react-icons/ai"

type PresetViewProps = PresetToasts & {
  // undefined while loading, empty if the preset doesn't exist
  preset: Preset[] | undefined
  history: Preset[]
  loading: boolean
}

const PresetView = ({
  preset,
  history,
  loading,
  deletedToast,
  reportedToast,
  fixedToast,
  savedToast,
}: PresetViewProps) => {
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
    <Layout title="Preset | Hubhop by Mobiflight">
      <Head>
        <title>{label || "Preset View"}</title>
      </Head>
      {loadingPreset ? (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="animate-spin text-6xl text-hhOrange">
            <AiOutlineLoading />
          </div>
          <p className="mt-5">Loading Preset</p>
        </div>
      ) : notFound ? (
        <div className="flex h-[80vh] items-center justify-center">
          <div className="flex flex-col items-center space-y-5">
            <div className="text-8xl">
              <BiSad />
            </div>
            <h2 className="text-center text-4xl">
              This preset does not exist or has been deleted
            </h2>
          </div>
        </div>
      ) : (
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
          setVendor={(e: InputChangeEvent) => setVendor(e.target.value)}
          setAircraft={(e: InputChangeEvent) => setAircraft(e.target.value)}
          setSystem={(e: InputChangeEvent) => setSystem(e.target.value)}
          setPresetType={(e: InputChangeEvent) =>
            setPresetType(e.target.value as Preset["presetType"])
          }
          setCodeType={(e: InputChangeEvent) =>
            setCodeType(e.target.value as Preset["codeType"])
          }
          setLabel={(e: InputChangeEvent) => setLabel(e.target.value)}
          setCode={(e: InputChangeEvent) => setCode(e.target.value)}
          setDescription={(e: InputChangeEvent) =>
            setDescription(e.target.value)
          }
          deletedToast={deletedToast}
          reportedToast={reportedToast}
          fixedToast={fixedToast}
          savedToast={savedToast}
        />
      )}
    </Layout>
  )
}

export default PresetView
