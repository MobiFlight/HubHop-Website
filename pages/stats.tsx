import { motion } from "framer-motion";
import Head from "next/head";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/sections/Shared/LoadingSpinner";
import GeneralStats from "../components/sections/stats/GeneralStats";
import TableStats from "../components/sections/stats/TableStats";

const Stats: React.FC = () => {
  const [presets, setPresets] = useState([]);
  const [stats, setStats] = useState<any>([]);
  const [simType, setSimType] = useState<any>(
    localStorage.getItem("simType") === null
      ? localStorage.setItem("simType", "msfs2020")
      : localStorage.getItem("simType")
  );

  useEffect(() => {
    setStats([]);
    setPresets([]);
    simType === "msfs2020"
      ? fetch(process.env.NEXT_PUBLIC_HUBHOP_API_STATS_MSFS || "", {
          redirect: "follow",
        })
          .then((res) => res.json())
          .then((data) => setStats(data))
      : fetch(process.env.NEXT_PUBLIC_HUBHOP_API_STATS_XPLANE || "", {
          redirect: "follow",
        })
          .then((res) => res.json())
          .then((data) => setStats(data));
    simType === "msfs2020"
      ? fetch(
          process.env.NEXT_PUBLIC_HUBHOP_API_BASEURL + "/msfs2020/presets" ||
            "",
          { redirect: "follow" }
        )
          .then((res) => res.json())
          .then((data) => setPresets(data))
      : fetch(
          process.env.NEXT_PUBLIC_HUBHOP_API_BASEURL + "/xplane/presets" || "",
          { redirect: "follow" }
        )
          .then((res) => res.json())
          .then((data) => setPresets(data));
  }, [simType]);

  useEffect(() => {
    localStorage.getItem("simType") === "msfs2020"
      ? document.body.classList.remove("xplane")
      : document.body.classList.add("xplane");
  }, [localStorage.getItem("simType")]);

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
        <div className="container mx-auto flex grid-cols-4 gap-10 md:grid">
          <div className="mb-3 w-full rounded-lg bg-hhCard/40 py-3">
            <button
              onClick={() => {
                setSimType(
                  localStorage.getItem("simType") === "msfs2020"
                    ? "xplane"
                    : "msfs2020"
                );
                localStorage.getItem("simType") === "msfs2020"
                  ? localStorage.setItem("simType", "xplane")
                  : localStorage.setItem("simType", "msfs2020");
              }}
              className={`grid w-full grid-cols-3 items-center justify-items-center gap-x-5 px-3 text-xl`}
            >
              <div
                className={`transition-all ${
                  localStorage.getItem("simType") === "msfs2020"
                    ? "font-bold"
                    : "font-normal"
                }`}
              >
                MSFS 2020
              </div>
              <div
                className={`relative flex h-fit w-full items-center rounded-lg bg-hhBG transition-all ${
                  localStorage.getItem("simType") === "msfs2020"
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <motion.div
                  transition={{
                    type: "spring",
                    stiffness: 700,
                    damping: 50,
                  }}
                  layout
                  className={`h-4 w-10 rounded-lg transition-colors ${
                    localStorage.getItem("simType") === "msfs2020"
                      ? "bg-[#bfcad1]"
                      : "bg-[#0fb5e8]"
                  }`}
                ></motion.div>
              </div>
              <div
                className={`transition-all ${
                  localStorage.getItem("simType") === "xplane"
                    ? "font-bold"
                    : "font-normal"
                }`}
              >
                X-Plane
              </div>
            </button>
          </div>
        </div>
        <GeneralStats presets={presets} stats={stats} />
        {presets.length ? (
          <div className="container mx-auto mt-5">
            <h2 className="text-2xl font-semibold">Latest added presets</h2>
            <TableStats data={stats.presetsAdded} added={true} />
          </div>
        ) : (
          <div className="container mx-auto mt-5">
            <h2 className="text-2xl font-semibold">Latest added presets</h2>
            <div className="mt-5 flex justify-center rounded-lg bg-hhCard/40 py-10 text-6xl">
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
            <div className="mt-5 flex justify-center rounded-lg bg-hhCard/40 py-10 text-6xl">
              <LoadingSpinner />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Stats;
