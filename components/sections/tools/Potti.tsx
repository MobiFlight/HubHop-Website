import Link from "next/link";
import { useState } from "react";
import { MdSwapHoriz } from "react-icons/md";
import ButtonOrange from "../Shared/ButtonOrange";

const Potti: React.FC = () => {
  const presets = [
    { name: "Arduino", min: 0, max: 1023 },
    { name: "Joystick", min: 0, max: 65535 },
    { name: "Custom", min: 0, max: 0 },
  ];

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
      event: "COM1_VOL_SET",
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
  ];

  const [Mindo, setMindo] = useState(0);
  const [Maxdo, setMaxdo] = useState(0);
  const [Mineir, setMineir] = useState(0);
  const [Maxeir, setMaxeir] = useState(0);
  const [NameEir, setNameEir] = useState("");

  function invertMinMax() {
    var max2 = Mineir;
    var min2 = Maxeir;

    setMineir(min2);
    setMaxeir(max2);
  }

  function eir_delta() {
    return Maxeir - Mineir;
  }
  function dor_delta() {
    return Maxdo - Mindo;
  }
  function dor_eir_ratio() {
    return parseFloat((eir_delta() / dor_delta()).toFixed(4));
  }
  function dor_eir_ratio2() {
    return parseFloat((dor_delta() / eir_delta()).toFixed(4));
  }
  function rpnDorMin() {
    if (Mindo == 0) {
      return "";
    } else {
      return Mindo + " - ";
    }
  }
  function rpnGrRatio() {
    if (Math.abs(dor_eir_ratio()) > Math.abs(dor_eir_ratio2())) {
      return dor_eir_ratio();
    } else {
      return dor_eir_ratio2();
    }
  }
  function rpnGrRatioMath() {
    if (Math.abs(dor_eir_ratio()) > Math.abs(dor_eir_ratio2())) {
      return "* ";
    } else {
      return "/ ";
    }
  }
  function rpnEirMin() {
    if (Mineir == 0) {
      return "";
    } else {
      return Math.abs(Mineir);
    }
  }
  function rpnEirMinMath() {
    if (Mineir == 0) {
      return "";
    } else {
      if (Mineir > 0) {
        return " + ";
      } else {
        return " - ";
      }
    }
  }
  function rpnMin() {
    return Math.min(Mineir, Maxeir);
  }
  function rpnMax() {
    return Math.max(Mineir, Maxeir);
  }
  function rpnLeft() {
    for (let index = 0; index < eir_preset.length; index++) {
      const preset = eir_preset[index];
      if (preset.event == NameEir) {
        if (preset.event.substring(0, 1) == "2") {
          return "index ";
        } else "";
      }
    }
    return "";
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
          tool, please visit the
          <Link href="https://github.com/MobiFlight/MobiFlight-Connector/wiki">
            <a
              className="mx-1 rounded-lg bg-hhOrange px-1 py-0.5 text-sm font-semibold text-hhBG transition-all hover:bg-hhOrangeShade-600"
              target={"_blank"}
            >
              Mobiflight&nbsp;Community
            </a>
          </Link>
          {}
          Wiki.
        </p>
      </div>
      <div className="mt-5 grid grid-cols-1 justify-items-center gap-5 xl:grid-cols-2">
        <div className="flex w-full flex-col items-center space-y-5">
          <h4 className="text-xl font-semibold">Device output range</h4>
          <select
            onChange={(e) => (
              setMindo(
                presets
                  .filter((preset) => preset.name === e.target.value)
                  .map((pres) => pres.min)[0]
              ),
              setMaxdo(
                presets
                  .filter((preset) => preset.name === e.target.value)
                  .map((pres) => pres.max)[0]
              )
            )}
            id="selectedPreset"
            defaultValue={""}
            className="w-full rounded-lg bg-hhBG p-3"
          >
            <option value={""} disabled>
              Select preset
            </option>
            {presets.map((preset) => {
              return <option key={preset.name}>{preset.name}</option>;
            })}
          </select>
          <div className="flex w-full flex-col items-center sm:flex-row sm:space-x-5">
            <div className="flex w-full flex-col">
              <label>Min device output range</label>
              <input
                className="rounded-lg bg-hhBG p-3"
                placeholder="0"
                type="number"
                onChange={(e) => setMindo(parseFloat(e.target.value))}
                value={Mindo}
              />
            </div>
            <div className="flex w-full flex-col">
              <label>Max device output range</label>
              <input
                className="rounded-lg bg-hhBG p-3"
                placeholder="0"
                type="number"
                onChange={(e) => setMaxdo(parseFloat(e.target.value))}
                value={Maxdo}
              />
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center space-y-5">
          <h4 className="text-xl font-semibold">MSFS2020 event input range</h4>
          <select
            onChange={(e) => (
              setMineir(
                parseFloat(
                  eir_preset
                    .filter((preset) => preset.name === e.target.value)
                    .map((pres) => pres.min)[0]
                )
              ),
              setMaxeir(
                parseFloat(
                  eir_preset
                    .filter((preset) => preset.name === e.target.value)
                    .map((pres) => pres.max)[0]
                )
              ),
              setNameEir(
                eir_preset
                  .filter((preset) => preset.name === e.target.value)
                  .map((pres) => pres.event)
                  .toString()
              )
            )}
            defaultValue={""}
            className="w-full rounded-lg bg-hhBG p-3"
          >
            <option value={""} disabled>
              Select preset
            </option>
            {eir_preset.map((preset) => {
              return <option key={preset.name}>{preset.name}</option>;
            })}
          </select>
          <div className="flex w-full flex-col items-center sm:flex-row sm:space-x-5">
            <div className="flex w-full flex-col">
              <label>Min event input range</label>
              <input
                className="rounded-lg bg-hhBG p-3"
                placeholder="0"
                type="number"
                value={Mineir}
                onChange={(e) => setMineir(parseFloat(e.target.value))}
              />
            </div>
            <div className="flex w-full flex-col">
              <label>Max event input range</label>
              <input
                className="rounded-lg bg-hhBG p-3"
                placeholder="0"
                type="number"
                value={Maxeir}
                onChange={(e) => setMaxeir(parseFloat(e.target.value))}
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center">
            <p className="text-xs">
              Note: The scale can be inverted by inverting the Min and Max
              values.
            </p>
            <button onClick={invertMinMax} className="w-fit">
              <ButtonOrange>
                <div className="text-xl">
                  <MdSwapHoriz />
                </div>
                <p>Invert Values</p>
              </ButtonOrange>
            </button>
          </div>
        </div>
      </div>
      <h2 className="mt-5 mb-5 text-center text-xl font-semibold">
        Generated RPN Code
      </h2>
      <textarea
        cols={30}
        rows={5}
        className="w-full rounded-lg bg-hhBG p-3"
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
        onChange={() => {}}
      ></textarea>
    </div>
  );
};
export default Potti;
