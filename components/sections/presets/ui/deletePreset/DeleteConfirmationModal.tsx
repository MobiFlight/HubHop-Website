import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { presetTable, type SimType } from "../../../../../services/presetSync"

type DeleteConfirmationModalProps = {
  label: string
  presetId: string
  onClose: () => void
}

const DeleteConfirmationModal = ({
  label,
  presetId,
  onClose,
}: DeleteConfirmationModalProps) => {
  async function deletePreset() {
    const sim = (localStorage.getItem("simType") || "msfs2020") as SimType
    const deleted = await fetch(
      process.env.NEXT_PUBLIC_HUBHOP_API_BASEURL +
        "/" +
        sim +
        "/presets/" +
        presetId,
      {
        credentials: "include",
        method: "DELETE",
        redirect: "follow",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      },
    )
      .then((res) => res.status === 200)
      .catch(() => false)
    if (!deleted) return toast.error("Error - Preset not deleted!")

    // remove only this preset from the local cache
    await presetTable(sim).delete(presetId)
    toast.success("Preset successfully deleted!")
  }

  return (
    <AlertDialog open onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Preset</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete:{" "}
            <span className="font-semibold text-foreground">{label}</span>? This
            process cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={deletePreset}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteConfirmationModal
