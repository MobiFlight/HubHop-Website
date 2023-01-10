import Layout from "../components/Layout";
import Hero from "../components/sections/home/Hero";
import { db } from "../services/db";
import { useEffect } from "react";

const Home: React.FC = () => {
  useEffect(() => {
    db.presets.count();
    db.presetsMsfs.count();
    db.presetsXplane.count();
  }, []);

  return (
    <Layout title="Home | Hubhop by Mobiflight">
      <Hero />
    </Layout>
  );
};

export default Home;
