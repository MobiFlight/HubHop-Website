import Link from "next/link"
import { IconAppWindow } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

type OpenPresetButtonProps = {
  id: string
}

const OpenPresetButton = ({ id }: OpenPresetButtonProps) => {
  return (
    <Button asChild>
      <Link
        href={{
          pathname: "/preset",
          query: { simType: localStorage.getItem("simType"), id: id },
        }}
        target="_blank"
      >
        <IconAppWindow />
        View Details
      </Link>
    </Button>
  )
}

export default OpenPresetButton
