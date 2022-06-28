import React, { ReactNode, useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "./sections/Navbar/Navbar";
import Footer from "./sections/footer/Footer";
import { FiArrowUpCircle } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "Hubhop" }: Props) => {
  const [clientWindowHeight, setClientWindowHeight] = useState(0);

  const handleScroll = () => {
    setClientWindowHeight(window.scrollY);
  };

  useEffect(() => {
    let isSubscribed = true;
    window.addEventListener("scroll", handleScroll);
    return () => (
      (isSubscribed = false), window.removeEventListener("scroll", handleScroll)
    );
  });

  function toTop() {
    window.scrollTo(0, 0);
  }

  const banner = "../../public/images/logo-big-banner.png";

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta
          name="description"
          content="HubHop is an API which consolidates Microsoft Flight Simulator 2020 variables and events and provides unique, understandable and standardized events and variables."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hubhop.mobiflight.com/" />
        <meta property="og:title" content="Hubhop" />
        <meta
          property="og:description"
          content="HubHop is an API which consolidates Microsoft Flight Simulator 2020 variables and events and provides unique, understandable and standardized events and variables."
        />
        <meta property="og:image" content={banner} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://hubhop.mobiflight.com/" />
        <meta property="twitter:title" content="Hubhop" />
        <meta
          property="twitter:description"
          content="HubHop is an API which consolidates Microsoft Flight Simulator 2020 variables and events and provides unique, understandable and standardized events and variables."
        />
        <meta property="twitter:image" content={banner} />
      </Head>
      <Navbar />
      {children}
      <Footer />
      <AnimatePresence>
        {clientWindowHeight > 10 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => toTop()}
              className="fixed right-5 bottom-5 rounded-xl bg-hhOrange p-4 text-2xl font-bold text-hhBG"
            >
              <FiArrowUpCircle />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
