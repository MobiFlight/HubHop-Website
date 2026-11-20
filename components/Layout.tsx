import React, { ReactNode, useState, useEffect } from "react"
import Head from "next/head"
import Navbar from "./sections/Navbar/Navbar"
import Footer from "./sections/footer/Footer"
import { IconArrowUp } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = "Hubhop" }: Props) => {
  const [clientWindowHeight, setClientWindowHeight] = useState(0)

  useEffect(() => {
    const handleScroll = () => setClientWindowHeight(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  function toTop() {
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    if (localStorage.getItem("simType") === null)
      localStorage.setItem("simType", "msfs2020")
  }, [])

  const banner = "../../public/images/logo-big-banner.png"

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta
          name="description"
          content="HubHop is the community library of events and variables for MSFS and X-Plane that connects your cockpit hardware to the sim through MobiFlight."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hubhop.mobiflight.com/" />
        <meta property="og:title" content="Hubhop" />
        <meta
          property="og:description"
          content="HubHop is the community library of events and variables for MSFS and X-Plane that connects your cockpit hardware to the sim through MobiFlight."
        />
        <meta property="og:image" content={banner} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://hubhop.mobiflight.com/" />
        <meta property="twitter:title" content="Hubhop" />
        <meta
          property="twitter:description"
          content="HubHop is the community library of events and variables for MSFS and X-Plane that connects your cockpit hardware to the sim through MobiFlight."
        />
        <meta property="twitter:image" content={banner} />
      </Head>
      <Navbar />
      {children}
      <Footer />
      {clientWindowHeight > 10 && (
        <div className="animate-in fade-in-0">
          <Button
            size="icon-lg"
            onClick={() => toTop()}
            className="fixed right-5 bottom-5"
            aria-label="Back to top"
          >
            <IconArrowUp className="size-6" />
          </Button>
        </div>
      )}
    </>
  )
}

export default Layout
