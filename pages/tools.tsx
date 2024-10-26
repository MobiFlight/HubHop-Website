import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import { useState } from "react";
import Layout from "../components/Layout";
import ButtonOrange from "../components/sections/Shared/ButtonOrange";
import Potti from "../components/sections/tools/Potti";

const Tools: React.FC = () => {
  const [tool, setTool] = useState("potti");

  return (
    <Layout title="Tools | Hubhop by Mobiflight">
      <Head>
        <meta name="title" content="Tools | Hubhop by Mobiflight" />
        <meta
          name="description"
          content="Get the preset for your favorite aircraft from Hubhop. The database is a community driven project. If you find events/variables of your favorite aircraft, please share them on Hubhop too."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hubhop.mobiflight.com/" />
        <meta property="og:title" content="Tools | Hubhop by Mobiflight" />
        <meta
          property="og:description"
          content="Get the preset for your favorite aircraft from Hubhop. The database is a community driven project. If you find events/variables of your favorite aircraft, please share them on Hubhop too."
        />
        <meta property="og:image" content="@/assets/logo-big.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://hubhop.mobiflight.com/" />
        <meta property="twitter:title" content="Tools | Hubhop by Mobiflight" />
        <meta
          property="twitter:description"
          content="Get the preset for your favorite aircraft from Hubhop. The database is a community driven project. If you find events/variables of your favorite aircraft, please share them on Hubhop too."
        />
        <meta property="twitter:image" content="@/assets/logo-big.png" />
      </Head>
      <div className="min-h-screen p-3">
        <div className="flex w-full flex-col space-y-3 xl:flex-row xl:space-y-0 xl:space-x-3">
          <div className="flex h-fit w-full flex-col space-y-3 rounded-lg bg-hhCard/40 p-3 xl:w-1/6">
            <h2 className="text-xl">Tools</h2>
            <button onClick={() => setTool("potti")} className="w-full">
              <ButtonOrange>Potentiometer RPN-Tool</ButtonOrange>
            </button>
            <button
              disabled
              onClick={() => setTool("more")}
              className="w-full cursor-not-allowed"
            >
              <ButtonOrange>More tools will follow</ButtonOrange>
            </button>
          </div>
          <div className="w-full rounded-lg bg-hhCard/40 p-3 xl:w-5/6">
            {tool === "potti" && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Potti />
                </motion.div>
              </AnimatePresence>
            )}
            {tool === "more" && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div>More</div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Tools;
