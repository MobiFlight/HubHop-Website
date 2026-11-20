import { useState } from "react"
import { IconArrowsExchange } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type RangeInputProps = {
  id: string
  label: string
  value: number | string
  onValueChange: (value: number | string) => void
}

// text while typing ("-", "12."), a number after leaving the field
const RangeInput = ({ id, label, value, onValueChange }: RangeInputProps) => (
  <div className="flex w-full flex-col gap-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      placeholder="0"
      type="text"
      value={value}
      onChange={(e) => {
        const text = e.target.value
        if (text === "-" || !isNaN(parseFloat(text))) onValueChange(text)
      }}
      onBlur={() => onValueChange(parseFloat(String(value)) || 0)}
    />
  </div>
)

const Potti = () => {
  const presets = [
    { name: "Arduino", min: 0, max: 1023 },
    { name: "Joystick", min: 0, max: 65535 },
    { name: "Custom", min: 0, max: 0 },
  ]

  const eir_preset = [
    {
      name: "Aileron",
      min: "-16383",
      max: "16383",
      event: "AILERON_SET",
    },
    {
      name: "Elev",
      min: "-16383",
      max: "16383",
      event: "ELEVATOR_SET",
    },
    {
      name: "Flaps",
      min: "0",
      max: "16383",
      event: "FLAPS_SET",
    },
    {
      name: "Light pot",
      min: "0",
      max: "100",
      event: "2:LIGHT_POTENTIOMETER_SET",
    },
    {
      name: "Com volume",
      min: "0",
      max: "100",
      event: "COM1_VOLUME_SET",
    },
    {
      name: "Mixture",
      min: "0",
      max: "16383",
      event: "MIXTURE_SET",
    },
    {
      name: "Prop",
      min: "0",
      max: "16383",
      event: "PROP_PITCH_SET",
    },
    {
      name: "PWM",
      min: "0",
      max: "255",
      event: "PWM",
    },
    {
      name: "Rudder",
      min: "-16383",
      max: "16383",
      event: "RUDDER_SET",
    },
    {
      name: "Spoiler",
      min: "0",
      max: "16383",
      event: "SPOILERS_SET",
    },
    {
      name: "Thr/Rev",
      min: "-16383",
      max: "16383",
      event: "THROTTLE_SET",
    },
    {
      name: "Throttle",
      min: "0",
      max: "16383",
      event: "THROTTLE_SET",
    },
    {
      name: "Aileron Trim",
      min: "-16383",
      max: "16383",
      event: "AILERON_TRIM_SET",
    },
    {
      name: "Aileron Trim Ex 1",
      min: "-16383",
      max: "16383",
      event: "AILERON_TRIM_SET_EX1",
    },
    {
      name: "Elevator Trim",
      min: "-16383",
      max: "16383",
      event: "ELEVATOR_TRIM_SET",
    },
    {
      name: "Axis Elevator Trim",
      min: "-16383",
      max: "16383",
      event: "AXIS_ELEV_TRIM_SET",
    },
    {
      name: "Rudder Trim",
      min: "-16383",
      max: "16383",
      event: "RUDDER_TRIM_SET",
    },
    {
      name: "Rudder Trim Ex 1",
      min: "-16383",
      max: "16383",
      event: "RUDDER_TRIM_SET_EX1",
    },
    {
      name: "User",
      min: "0",
      max: "16383",
      event: "Your_Event_SET",
    },
  ]

  const [Mindo, setMindo] = useState<number | string>(0)
  const [Maxdo, setMaxdo] = useState<number | string>(0)
  const [Mineir, setMineir] = useState<number | string>(0)
  const [Maxeir, setMaxeir] = useState<number | string>(0)
  const [NameEir, setNameEir] = useState("")

  function invertMinMax() {
    const max2 = Mineir
    const min2 = Maxeir

    setMineir(min2)
    setMaxeir(max2)
  }

  function eir_delta() {
    return Number(Maxeir) - Number(Mineir)
  }
  function dor_delta() {
    return Number(Maxdo) - Number(Mindo)
  }
  function dor_eir_ratio() {
    return parseFloat((eir_delta() / dor_delta()).toFixed(4))
  }
  function dor_eir_ratio2() {
    return parseFloat((dor_delta() / eir_delta()).toFixed(4))
  }
  function rpnDorMin() {
    if (Mindo == 0) {
      return ""
    } else {
      return Mindo + " - "
    }
  }
  function rpnGrRatio() {
    if (Math.abs(dor_eir_ratio()) > Math.abs(dor_eir_ratio2())) {
      return dor_eir_ratio()
    } else {
      return dor_eir_ratio2()
    }
  }
  function rpnGrRatioMath() {
    if (Math.abs(dor_eir_ratio()) > Math.abs(dor_eir_ratio2())) {
      return "* "
    } else {
      return "/ "
    }
  }
  function rpnEirMin() {
    if (Mineir == 0) {
      return ""
    } else {
      return Math.abs(Number(Mineir))
    }
  }
  function rpnEirMinMath() {
    if (Mineir == 0) {
      return ""
    } else {
      if (Number(Mineir) > 0) {
        return " + "
      } else {
        return " - "
      }
    }
  }
  function rpnMin() {
    return Math.min(Number(Mineir), Number(Maxeir))
  }
  function rpnMax() {
    return Math.max(Number(Mineir), Number(Maxeir))
  }
  function rpnLeft() {
    for (let index = 0; index < eir_preset.length; index++) {
      const preset = eir_preset[index]
      if (preset.event == NameEir) {
        if (preset.event.substring(0, 1) == "2") {
          return "index "
        }
      }
    }
    return ""
  }

  function selectDevice(name: string) {
    const preset = presets.find((p) => p.name === name)
    if (!preset) return
    setMindo(preset.min)
    setMaxdo(preset.max)
  }

  function selectEvent(name: string) {
    const preset = eir_preset.find((p) => p.name === name)
    if (!preset) return
    setMineir(parseFloat(preset.min))
    setMaxeir(parseFloat(preset.max))
    setNameEir(preset.event)
  }

  return (
    <div>
      <div>
        <h2 className="text-xl">Potentiometer RPN-Tool</h2>
        <p>
          Idea and logic design by Jaime, an active member of the mobiflight
          community.
        </p>
        <p>
          If you want to learn more about potentiometers and how to use this
          tool, please visit the{" "}
          <a
            href="https://github.com/MobiFlight/MobiFlight-Connector/wiki"
            target="_blank"
            className="text-primary underline underline-offset-4"
          >
            Mobiflight Community Wiki
          </a>
          .
        </p>
      </div>
      <div className="mt-5 grid grid-cols-1 justify-items-center gap-5 xl:grid-cols-2">
        <div className="flex w-full flex-col items-center gap-5">
          <h4 className="text-xl font-semibold">Device output range</h4>
          <Select onValueChange={selectDevice}>
            <SelectTrigger className="w-full" aria-label="Device preset">
              <SelectValue placeholder="Select preset" />
            </SelectTrigger>
            <SelectContent>
              {presets.map((preset) => (
                <SelectItem key={preset.name} value={preset.name}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex w-full flex-col gap-5 sm:flex-row">
            <RangeInput
              id="device-min"
              label="Min device output range"
              value={Mindo}
              onValueChange={setMindo}
            />
            <RangeInput
              id="device-max"
              label="Max device output range"
              value={Maxdo}
              onValueChange={setMaxdo}
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-5">
          <h4 className="text-xl font-semibold">MSFS event input range</h4>
          <Select onValueChange={selectEvent}>
            <SelectTrigger className="w-full" aria-label="Event preset">
              <SelectValue placeholder="Select preset" />
            </SelectTrigger>
            <SelectContent>
              {eir_preset.map((preset) => (
                <SelectItem key={preset.name} value={preset.name}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex w-full flex-col gap-5 sm:flex-row">
            <RangeInput
              id="event-min"
              label="Min event input range"
              value={Mineir}
              onValueChange={setMineir}
            />
            <RangeInput
              id="event-max"
              label="Max event input range"
              value={Maxeir}
              onValueChange={setMaxeir}
            />
          </div>
          <div className="flex w-full flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground">
              Note: The scale can be inverted by inverting the Min and Max
              values.
            </p>
            <Button onClick={invertMinMax}>
              <IconArrowsExchange />
              Invert Values
            </Button>
          </div>
        </div>
      </div>
      <Label
        htmlFor="rpn-code"
        className="mt-5 mb-5 block text-center text-xl font-semibold"
      >
        Generated RPN Code
      </Label>
      <Textarea
        id="rpn-code"
        rows={5}
        readOnly
        className="font-mono"
        value={
          Maxdo
            ? "@ " +
              rpnDorMin() +
              rpnGrRatio() +
              " " +
              rpnGrRatioMath() +
              rpnEirMin() +
              rpnEirMinMath() +
              rpnMin() +
              " max " +
              rpnMax() +
              " min " +
              rpnLeft() +
              "(>K:" +
              NameEir +
              ")"
            : "RPN Code will be displayed here"
        }
      />
    </div>
  )
}
export default Potti
