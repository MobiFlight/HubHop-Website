import { test, expect } from "@/tests/fixtures"
import { brandLabel, hardwareOf, hardwareSummary } from "@/lib/profileHardware"

// "WINCTRL FCU", "Rowsfire" (brand only)
const names = (title: string) =>
  hardwareOf(title).map((h) => [h.brand, h.model].filter(Boolean).join(" "))

test.describe("Profile hardware", () => {
  test("Profile hardware - brand and model are read from the title", () => {
    expect(
      names("Fenix A320 | WINCTRL FCU + EFIS L | MobiFlight Profile"),
    ).toEqual(["WINCTRL FCU", "WINCTRL EFIS L"])
    expect(names("FSS E-Jets | WINCTRL PAP3 + PDC 3M L + RMP + MCDU")).toEqual([
      "WINCTRL PAP3",
      "WINCTRL PDC 3M",
      "WINCTRL RMP",
      "WINCTRL MCDU",
    ])
  })

  test("Profile hardware - WinWing, WinCtrl and typos are the brand WINCTRL", () => {
    for (const title of [
      "WinWing FCU",
      "WinCtrl FCU",
      "WINCRTL 737 MCP, FMC, EFIS",
      "iFly 737 MAX | WinWingSim FCU",
    ])
      expect(hardwareOf(title)[0]?.brand).toBe("WINCTRL")
    expect(brandLabel({ name: "WINCTRL", formerly: "WinWing" })).toBe(
      "WINCTRL (formerly WinWing)",
    )
  })

  test("Profile hardware - a model only one brand makes names the brand", () => {
    expect(names("Bluebird 757 PAP3 Mobiflight")).toEqual(["WINCTRL PAP3"])
    expect(names("Ocatvi IFR1 Profile Synaptic A220")).toEqual(["Octavi IFR-1"])
    expect(names("Honeycomb Bravo | miniFCU | FSS 727")).toEqual([
      "Honeycomb Bravo",
      "MiniCockpit miniFCU",
    ])
  })

  test("Profile hardware - a model several brands make needs the brand", () => {
    // WINCTRL, WingFlex and others make an MCDU or an RMP
    expect(names("PMDG B737 NG MCDU MobiFlight Profile")).toEqual([])
    expect(names("Wingflex RMP Cube - PMDG 737/777 Profiles")).toEqual([
      "WingFlex RMP",
    ])
    // the FCU belongs to the brand named before it
    expect(
      names(
        "iFly Boeing 737-8 MAX with WinWing A320 FCU and Thrustmaster TCA Pack",
      ),
    ).toEqual(["WINCTRL FCU", "Thrustmaster TCA"])
  })

  test("Profile hardware - the exact model wins over the shorter name", () => {
    expect(
      names("WINCTRL URSA MINOR 32 Throttle Metal / 32 PAC Metal"),
    ).toEqual(["WINCTRL URSA MINOR 32 Throttle Metal", "WINCTRL 32 PAC Metal"])
    expect(names("BlueBird 757 WINCTRL EFIS L&R, FCU")).toEqual([
      "WINCTRL EFIS L",
      "WINCTRL EFIS R",
      "WINCTRL FCU",
    ])
  })

  test("Profile hardware - a brand without a known model counts on its own", () => {
    expect(names("TFDi MD-11 Sim Gauges Overhead Mobiflight Profile")).toEqual([
      "Sim Gauges",
    ])
  })

  test("Profile hardware - the summary counts profiles per brand and model, most first", () => {
    expect(
      hardwareSummary([
        "Rowsfire A107",
        "WINCTRL FCU",
        "WINCTRL FCU + MCDU",
        "WinWing MCDU",
        "WINCTRL PAP3",
      ]),
    ).toEqual([
      {
        name: "WINCTRL",
        formerly: "WinWing",
        profiles: 4,
        models: [
          { name: "FCU", profiles: 2 },
          { name: "MCDU", profiles: 2 },
          { name: "PAP3", profiles: 1 },
        ],
      },
      {
        name: "Rowsfire",
        formerly: undefined,
        profiles: 1,
        models: [{ name: "A107", profiles: 1 }],
      },
    ])
  })
})
