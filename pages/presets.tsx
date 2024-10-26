import Head from "next/head";
import Layout from "../components/Layout";
import PresetList from "../components/sections/presets/Presets";

const Presets: React.FC = () => {
  return (
    <Layout title="Presets | Hubhop by Mobiflight">
      <Head>
        <meta name="title" content="Presets | Hubhop by Mobiflight" />
        <meta
          name="description"
          content="Get the preset for your favorite aircraft from Hubhop. The database is a community driven project. If you find events/variables of your favorite aircraft, please share them on Hubhop too."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hubhop.mobiflight.com/" />
        <meta property="og:title" content="Presets | Hubhop by Mobiflight" />
        <meta
          property="og:description"
          content="Get the preset for your favorite aircraft from Hubhop. The database is a community driven project. If you find events/variables of your favorite aircraft, please share them on Hubhop too."
        />
        <meta property="og:image" content="@/assets/logo-big.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://hubhop.mobiflight.com/" />
        <meta property="twitter:title" content="Presets | Hubhop by Mobiflight" />
        <meta
          property="twitter:description"
          content="Get the preset for your favorite aircraft from Hubhop. The database is a community driven project. If you find events/variables of your favorite aircraft, please share them on Hubhop too."
        />
        <meta property="twitter:image" content="@/assets/logo-big.png" />
      </Head>
      <PresetList />
    </Layout>
  );
};

export default Presets;
