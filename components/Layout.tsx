import React, { ReactNode, useState, useEffect } from "react"
import Head from "next/head"
import Navbar from "@/components/sections/Navbar/Navbar"
import Footer from "@/components/sections/footer/Footer"
import { IconArrowUp } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

type LayoutProps = {
  children?: ReactNode
  title?: string
  // for search results and link previews
  description?: string
  // the page's own path, e.g. "/aircraft/msfs/": canonical URL and og:url
  path?: string
  // keep the page out of search engines
  noindex?: boolean
  // path of the link preview image (1200×630), e.g. an aircraft's own image
  image?: string
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
const IMAGE = "/images/og-hubhop.png"
const DEFAULT_DESCRIPTION =
  "HubHop is the community library of events and variables for MSFS and X-Plane that connects your home cockpit hardware to the sim through MobiFlight."

const Layout = ({
  children,
  title = "Hubhop",
  description = DEFAULT_DESCRIPTION,
  path,
  noindex = false,
  image = IMAGE,
}: LayoutProps) => {
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

  const url = path && `${SITE_URL}${path}`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        {noindex && <meta name="robots" content="noindex" />}
        {url && <link rel="canonical" href={url} />}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HubHop" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {url && <meta property="og:url" content={url} />}
        <meta property="og:image" content={`${SITE_URL}${image}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
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
