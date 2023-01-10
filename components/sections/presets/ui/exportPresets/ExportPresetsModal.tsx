import { useState } from "react";
import Modal from "../../../Shared/Modal";
import ExportButton from "./ExportButton";

interface Props {
  setExportModalOpen: Function;
}

const ExportPresetsModal: React.FC<Props> = ({ setExportModalOpen }) => {
  const [downloadTxt, setDownloadTxt] = useState(false);
  const [downloadCip, setDownloadCip] = useState(false);
  const [downloadSimvars, setDownloadSimvars] = useState(false);

  function downloadEventsTxt() {
    setDownloadTxt(true);
    fetch("https://hubhop-api-mgtm.azure-api.net/api/v1/export/presets", {
      redirect: "follow",
    })
      .then((response) => response.blob())
      .then((blob) => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "events.txt";
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .then(() => setDownloadTxt(false));
  }
  function downloadEventsCip() {
    setDownloadCip(true);
    fetch(
      "https://hubhop-api-mgtm.azure-api.net/api/v1/export/presets?type=cip",
      { redirect: "follow" }
    )
      .then((response) => response.blob())
      .then((blob) => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "msfs2020_eventids.cip";
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .then(() => setDownloadCip(false));
  }

  function downloadSimVars() {
    setDownloadSimvars(true);
    fetch(
      "https://hubhop-api-mgtm.azure-api.net/api/v1/export/presets?type=simVars",
      { redirect: "follow" }
    )
      .then((response) => response.blob())
      .then((blob) => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "msfs2020_simvars.cip";
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .then(() => setDownloadSimvars(false));
  }

  return (
    <Modal
      position="fixed"
      title="Export Presets"
      closeModal={setExportModalOpen}
      closeModalX={setExportModalOpen}
    >
      <div className="mt-3 grid grid-cols-5 items-start gap-5">
        <div className="flex flex-col items-center justify-center align-top">
          <h2 className="border-b-2 border-hhCard text-xl font-semibold">
            Mobiflight
          </h2>
          <p className="max-w-[13rem] rounded-lg bg-red-800 p-3 text-justify text-xs font-semibold leading-3 text-hhText">
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
              loading={downloadCip}
              disabled={true}
            />
            <ExportButton
              text={"msfs2020_simvars.cip"}
              loading={downloadSimvars}
              disabled={true}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center align-top">
          <h2 className="border-b-2 border-hhCard text-xl font-semibold">
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
          <h2 className="border-b-2 border-hhCard text-xl font-semibold">
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
          <h2 className="border-b-2 border-hhCard text-xl font-semibold">
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
          <h2 className="border-b-2 border-hhCard text-xl font-semibold">
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
          onClick={(e) => setExportModalOpen(e)}
          className="flex items-center space-x-1 rounded-lg bg-hhBG px-4 py-1.5 text-sm font-semibold transition-all hover:bg-hhBG/70"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default ExportPresetsModal;
