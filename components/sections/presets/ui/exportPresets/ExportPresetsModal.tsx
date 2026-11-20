import { useState } from "react"
import Modal from "../../../Shared/Modal"
import ExportButton from "./ExportButton"
import { buttonVariants } from "@/components/ui/button"

type ExportPresetsModalProps = {
  onClose: () => void
}

const ExportPresetsModal = ({ onClose }: ExportPresetsModalProps) => {
  const [downloadTxt, setDownloadTxt] = useState(false)

  function downloadEventsTxt() {
    setDownloadTxt(true)
    fetch("https://hubhop-api-mgtm.azure-api.net/api/v1/export/presets", {
      redirect: "follow",
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "events.txt"
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
      .then(() => setDownloadTxt(false))
  }
  return (
    <Modal title="Export Presets" onClose={onClose}>
      <div className="mt-3 grid grid-cols-[repeat(5,auto)] items-start gap-5">
        <div className="flex flex-col items-center justify-center align-top">
          <h2 className="border-b-2 border-border text-xl font-semibold">
            Mobiflight
          </h2>
          <p className="max-w-52 rounded-lg bg-destructive/20 p-3 text-justify text-xs leading-3 font-semibold text-destructive">
            Please use the build-in update funcionality inside Mobiflight to
            update your Hubhop presets.
          </p>
          <div className="mt-3 flex flex-col justify-center space-y-3 align-top">
            <ExportButton
              text={"events.txt"}
              loading={downloadTxt}
              disabled={true}
            />
            <ExportButton
              text={"msfs2020_eventids.cip"}
              loading={false}
              disabled={true}
            />
            <ExportButton
              text={"msfs2020_simvars.cip"}
              loading={false}
              disabled={true}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center align-top">
          <h2 className="border-b-2 border-border text-xl font-semibold">
            Mobiflight WASM Module
          </h2>
          <div className="mt-3 flex flex-col justify-center space-y-3 align-top">
            <button disabled={downloadTxt} onClick={() => downloadEventsTxt()}>
              <ExportButton
                text={"events.txt"}
                loading={downloadTxt}
                disabled={false}
              />
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="border-b-2 border-border text-xl font-semibold">
            FSUIPC
          </h2>
          <div className="mt-3 flex flex-col justify-center space-y-3">
            <div onClick={() => {}}>
              <ExportButton
                text={"mobiflight.evt"}
                loading={false}
                disabled={true}
              />
            </div>
            <div className="flex justify-center">Available soon</div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="border-b-2 border-border text-xl font-semibold">
            SPAD.neXt
          </h2>
          <div className="mt-3 flex flex-col justify-center space-y-3">
            <div onClick={() => {}}>
              <ExportButton
                text={"Configuration file"}
                loading={false}
                disabled={true}
              />
            </div>
            <div className="flex justify-center">Available soon</div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="border-b-2 border-border text-xl font-semibold">
            Axis and Ohs
          </h2>
          <div className="mt-3 flex flex-col justify-center space-y-3">
            <div onClick={() => {}}>
              <ExportButton
                text={"Configuration file"}
                loading={false}
                disabled={true}
              />
            </div>
            <div className="flex justify-center">Available soon</div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex w-full items-center justify-end">
        <button
          onClick={onClose}
          className={buttonVariants({ variant: "secondary" })}
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}

export default ExportPresetsModal
