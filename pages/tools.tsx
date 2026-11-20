import Head from "next/head"
import { useState } from "react"
import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Potti from "@/components/sections/tools/Potti"

const Tools = () => {
  const [tool, setTool] = useState("potti")

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
        <div className="flex w-full flex-col gap-3 xl:flex-row">
          <Card className="h-fit w-full xl:w-1/6">
            <CardHeader>
              <CardTitle className="text-xl">Tools</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button onClick={() => setTool("potti")}>
                Potentiometer RPN-Tool
              </Button>
              <Button disabled>More tools will follow</Button>
            </CardContent>
          </Card>
          <Card className="w-full xl:w-5/6">
            <CardContent>{tool === "potti" && <Potti />}</CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default Tools
