import Head from "next/head";
import Layout from "../../../Layout";
import { useEffect, useState } from "react";

import PresetCard from "../ui/PresetCard";
import { BiSad } from "react-icons/bi";
import { AiOutlineLoading } from "react-icons/ai";

interface Props {
  preset: any;
  history: any;
  loading: boolean;
  deletedToast: Function;
  reportedToast: Function;
  savedToast: Function;
  fixedToast: Function;
}

const PresetView: React.FC<Props> = ({
  preset,
  history,
  loading,
  deletedToast,
  reportedToast,
  fixedToast,
  savedToast,
}) => {
  const [id, setId] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [version, setVersion] = useState("");
  const [reported, setReported] = useState("");
  const [vendor, setVendor] = useState("");
  const [aircraft, setAircraft] = useState("");
  const [system, setSystem] = useState("");
  const [presetType, setPresetType] = useState("");
  const [codeType, setCodeType] = useState("");
  const [label, setLabel] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [loadingPreset, setLoadingPreset] = useState(true);

  useEffect(() => {
    if (preset && preset.length) {
      setId(preset[0].id);
      setUpdatedBy(preset[0].updatedBy);
      setCreatedDate(preset[0].createdDate);
      setVersion(preset[0].version);
      setReported(preset[0].reported);
      setVendor(preset[0].vendor);
      setAircraft(preset[0].aircraft);
      setSystem(preset[0].system);
      setPresetType(preset[0].presetType);
      setCodeType(preset[0].codeType || "");
      setLabel(preset[0].label);
      setCode(preset[0].code);
      setDescription(preset[0].description);
      setAuthor(preset[0].author);
      setNotFound(false);
    } else {
      setNotFound(true);
    }
    setLoadingPreset(false);
  }, [preset]);

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
          setVendor={(e: any) => setVendor(e.target.value)}
          setAircraft={(e: any) => setAircraft(e.target.value)}
          setSystem={(e: any) => setSystem(e.target.value)}
          setPresetType={(e: any) => setPresetType(e.target.value)}
          setCodeType={(e: any) => setCodeType(e.target.value)}
          setLabel={(e: any) => setLabel(e.target.value)}
          setCode={(e: any) => setCode(e.target.value)}
          setDescription={(e: any) => setDescription(e.target.value)}
          deletedToast={deletedToast}
          reportedToast={reportedToast}
          fixedToast={fixedToast}
          savedToast={savedToast}
        />
      )}
    </Layout>
  );
};

export default PresetView;
