import Head from "next/head";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/sections/Shared/LoadingSpinner";
import GeneralStats from "../components/sections/stats/GeneralStats";
import TableStats from "../components/sections/stats/TableStats";

const Stats: React.FC = () => {
  const [presets, setPresets] = useState([]);
  const [stats, setStats] = useState<any>([]);
  useEffect(() => {
    fetch(process.env.hubHopApiStats || "")
      .then((res) => res.json())
      .then((data) => setStats(data));
    fetch(process.env.hubHopPresets || "")
      .then((res) => res.json())
      .then((data) => setPresets(data));
  }, []);
  return (
    <Layout title="Stats | Hubhop by Mobiflight">
      <Head>
        <meta name="title" content="Stats | Hubhop by Mobiflight" />
        <meta
          name="description"
          content="Get the preset for your favorite aircraft from Hubhop. The database is a community driven project. If you find events/variables of your favorite aircraft, please share them on Hubhop too."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hubhop.mobiflight.com/" />
        <meta property="og:title" content="Stats | Hubhop by Mobiflight" />
        <meta
          property="og:description"
          content="Get the preset for your favorite aircraft from Hubhop. The database is a community driven project. If you find events/variables of your favorite aircraft, please share them on Hubhop too."
        />
        <meta property="og:image" content="@/assets/logo-big.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://hubhop.mobiflight.com/" />
        <meta property="twitter:title" content="Stats | Hubhop by Mobiflight" />
        <meta
          property="twitter:description"
          content="Get the preset for your favorite aircraft from Hubhop. The database is a community driven project. If you find events/variables of your favorite aircraft, please share them on Hubhop too."
        />
        <meta property="twitter:image" content="@/assets/logo-big.png" />
      </Head>
      <div className="mb-5 min-h-screen p-3">
        <GeneralStats presets={presets} stats={stats} />
        {presets.length ? (
          <div className="container mx-auto mt-5">
            <h2 className="text-2xl font-semibold">Latest added presets</h2>
            <TableStats data={stats.presetsAdded} added={true} />
          </div>
        ) : (
          <div className="container mx-auto mt-5">
            <h2 className="text-2xl font-semibold">Latest added presets</h2>
            <div className="mt-5 flex justify-center rounded-lg bg-hhCard/30 py-10 text-6xl">
              <LoadingSpinner />
            </div>
          </div>
        )}
        {presets.length ? (
          <div className="container mx-auto mt-5">
            <h2 className="text-2xl font-semibold">Latest updated presets</h2>
            <TableStats data={stats.presetsUpdated} added={false} />
          </div>
        ) : (
          <div className="container mx-auto mt-5">
            <h2 className="text-2xl font-semibold">Latest updated presets</h2>
            <div className="mt-5 flex justify-center rounded-lg bg-hhCard/30 py-10 text-6xl">
              <LoadingSpinner />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Stats;
