import { useState } from "react"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { IconExternalLink, IconLoader2 } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import ComboBox from "../../../Shared/ComboBox"
import Modal from "../../../Shared/Modal"
import { CODE_TYPES } from "../../../../../lib/codeTypes"
import { presetTypesFor } from "../../../../../lib/presetTypes"
import { sortedUnique } from "../../../../../lib/presetFacets"
import type { Preset } from "../../../../../interfaces/preset"
import { isModerator } from "../../../../../services/roles"

type AddPresetsModalProps = {
  onClose: () => void
  presets: Preset[]
}

const required = (message: string) => z.string().trim().min(1, message)

/** X-Plane presets also need a code type */
const schemaFor = (sim: string | null) =>
  z.object({
    vendor: required("Select Vendor"),
    aircraft: required("Select Aircraft"),
    system: required("Select System"),
    presetType: required("Select preset type"),
    codeType: sim === "xplane" ? required("Select code type") : z.string(),
    label: required("Name required"),
    code: required("Code required"),
    description: z.string(),
  })

type AddPresetForm = z.infer<ReturnType<typeof schemaFor>>

// the preset list's filters preselect the form
const storedFilter = (key: string) => localStorage.getItem(key) || ""

const AddPresetsModal = ({ onClose, presets }: AddPresetsModalProps) => {
  const sim = localStorage.getItem("simType")
  const [buttonSubmit, setButtonSubmit] = useState(false)
  const [bulkUpload, setBulkUpload] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    watch,
    resetField,
    setValue,
    formState: { errors },
  } = useForm<AddPresetForm>({
    resolver: zodResolver(schemaFor(sim)),
    defaultValues: {
      vendor: storedFilter("vendorFilter"),
      aircraft: storedFilter("aircraftFilter"),
      system: storedFilter("systemFilter"),
      presetType: storedFilter("presetTypeFilter"),
      codeType: storedFilter("codeTypeFilter"),
      label: "",
      code: "",
      description: "",
    },
  })
  const { vendor, aircraft, system, presetType, label, code, description } =
    watch()

  const includesText = (text: string, search: string) =>
    text.toLowerCase().includes(search.toLowerCase())
  // without a selection only presets with a value match, as before
  const matchesSelection = (value: string, selected: string) =>
    selected ? value.toLowerCase() === selected.toLowerCase() : value !== ""

  // presets similar to the input, shown next to the form
  const filteredItems = presets.filter(
    (preset) =>
      includesText(preset.vendor, vendor) &&
      matchesSelection(preset.aircraft, aircraft) &&
      matchesSelection(preset.system, system) &&
      (!preset.presetType || matchesSelection(preset.presetType, presetType)) &&
      includesText(preset.label, label) &&
      includesText(preset.code, code) &&
      (!preset.description || includesText(preset.description, description)),
  )

  // An aircraft belongs to a vendor: each list only offers values that fit the other
  const vendorsOf = (aircraft: string) =>
    sortedUnique(
      presets
        .filter((preset) => !aircraft || preset.aircraft === aircraft)
        .map((preset) => preset.vendor),
    )
  const vendorOptions = vendorsOf(aircraft)
  const aircraftOptions = sortedUnique(
    presets
      .filter((preset) => !vendor || preset.vendor === vendor)
      .map((preset) => preset.aircraft),
  )
  const systemOptions = sortedUnique(presets.map((preset) => preset.system))

  // picking an aircraft first fills in its vendor
  const chooseAircraft = (value: string) => {
    setValue("aircraft", value, { shouldValidate: true })
    const [onlyVendor, ...others] = vendorsOf(value)
    if (!vendor && onlyVendor && !others.length)
      setValue("vendor", onlyVendor, { shouldValidate: true })
  }

  async function addPreset(data: AddPresetForm) {
    setButtonSubmit(true)
    const url =
      process.env.NEXT_PUBLIC_HUBHOP_API_BASEURL + "/" + sim + "/presets"
    const common = {
      vendor: data.vendor,
      aircraft: data.aircraft,
      system: data.system,
      code: data.code,
      label: data.label,
      presetType: data.presetType,
      status: "Submitted",
      createdDate: new Date().toUTCString(),
      author: localStorage.getItem("username"),
      description: data.description,
    }
    const preset =
      sim === "msfs2020"
        ? {
            path: [
              data.vendor,
              data.aircraft,
              data.system,
              data.presetType,
              data.label,
            ].join("."),
            ...common,
          }
        : { ...common, codeType: data.codeType }

    const added = await fetch(url, {
      method: "POST",
      body: JSON.stringify(preset),
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((res) => res.ok)
      .catch(() => false)
    setButtonSubmit(false)
    // on error keep the input, so the user can try again
    if (!added) return toast.error("Error - Preset not added!")

    resetField("label", { defaultValue: "" })
    resetField("code", { defaultValue: "" })
    resetField("description", { defaultValue: "" })
    toast.success("Preset successfully added!")
  }

  return (
    <Modal title="Add Preset" onClose={onClose} dismissible={false}>
      <form
        onSubmit={handleSubmit(addPreset)}
        className="flex w-[70vw] flex-col gap-6"
      >
        <div className="grid grid-cols-[2fr_3fr_1fr] gap-5">
          <div className="flex flex-col gap-4">
            <Controller
              name="vendor"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="add-vendor">Vendor</FieldLabel>
                  <ComboBox
                    id="add-vendor"
                    options={vendorOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select vendor"
                    allowCreate
                    invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="aircraft"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="add-aircraft">Aircraft</FieldLabel>
                  <ComboBox
                    id="add-aircraft"
                    options={aircraftOptions}
                    value={field.value}
                    onValueChange={chooseAircraft}
                    placeholder="Select aircraft"
                    allowCreate
                    invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="system"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="add-system">System</FieldLabel>
                  <ComboBox
                    id="add-system"
                    options={systemOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select system"
                    allowCreate={isModerator()}
                    invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="presetType"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="add-preset-type">
                    Input/Output
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="add-preset-type"
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select Input/Output" />
                    </SelectTrigger>
                    <SelectContent>
                      {presetTypesFor(sim).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            {sim === "xplane" && (
              <Controller
                name="codeType"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="add-code-type">Code Type</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="add-code-type"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select Code Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {CODE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            )}
          </div>
          <div className="flex flex-col gap-4">
            <Field data-invalid={!!errors.label}>
              <FieldLabel htmlFor="add-label">Name</FieldLabel>
              <Input
                id="add-label"
                placeholder="Alternator 1 On"
                aria-invalid={!!errors.label}
                {...register("label")}
              />
              <FieldError errors={[errors.label]} />
            </Field>
            <Field data-invalid={!!errors.code}>
              <FieldLabel htmlFor="add-code">Code</FieldLabel>
              <Textarea
                id="add-code"
                rows={5}
                className="font-mono"
                placeholder="(>L:somecode) (>K:somecodeToo) * near"
                aria-invalid={!!errors.code}
                {...register("code")}
              />
              <FieldError errors={[errors.code]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="add-description">Description</FieldLabel>
              <Textarea
                id="add-description"
                rows={5}
                placeholder="This is your space for a nice description"
                {...register("description")}
              />
            </Field>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Similar Presets</p>
            <div className="flex flex-col gap-1 rounded-md border p-2 text-sm">
              <p>{filteredItems.length} presets found.</p>
              {filteredItems.length === 0 ? (
                <p className="text-muted-foreground">No matches</p>
              ) : filteredItems.length <= 10 ? (
                filteredItems.map((preset) => (
                  <Link
                    key={preset.id}
                    href={{ pathname: "/preset", query: { id: preset.id } }}
                    target="_blank"
                    className="flex items-center justify-between gap-1 rounded-sm px-2 py-0.5 hover:bg-muted"
                  >
                    <span className="truncate">{preset.label}</span>
                    <IconExternalLink className="size-4 shrink-0" />
                  </Link>
                ))
              ) : (
                <p className="text-muted-foreground">
                  Maximum 10 will be displayed here.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setBulkUpload(true)}
            >
              Bulk upload
            </Button>
            <Button type="submit" disabled={buttonSubmit}>
              {buttonSubmit && <IconLoader2 className="animate-spin" />}
              Add preset
            </Button>
          </div>
        </div>
      </form>
      {bulkUpload && (
        <Modal title={"Bulk Upload"} onClose={() => setBulkUpload(false)}>
          <p className="max-w-lg">
            If you want to upload many presets at once, you can download or open
            the import-file and post it on the{" "}
            <a
              className="text-primary underline underline-offset-4"
              href="https://discord.gg/weZwE4sD"
              target="_blank"
            >
              Discord
            </a>{" "}
            bulk-upload channel.
          </p>
          <div className="flex flex-col items-start gap-2">
            <Button asChild>
              <a href="/import_events_yourName.xlsx">
                Download import-file (MS Excel Required)
              </a>
            </Button>
            <Button asChild>
              <a
                href="https://docs.google.com/spreadsheets/d/1HHDvuA1rgdLZvdy0MTXB3QNIxba4iZZUcit8TQysD_k/edit#gid=664333323"
                target="_blank"
              >
                Open import-file (Google-Account required)
              </a>
            </Button>
          </div>
        </Modal>
      )}
    </Modal>
  )
}

export default AddPresetsModal
