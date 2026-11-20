import { useState } from "react"
import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Potti from "@/components/sections/tools/Potti"

const Tools = () => {
  const [tool, setTool] = useState("potti")

  return (
    <Layout
      title="Tools | Hubhop by Mobiflight"
      description="Free tools for your home cockpit, like the potentiometer RPN tool: it writes the MobiFlight code that maps your potentiometer's range to a sim event."
      path="/tools/"
    >
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
