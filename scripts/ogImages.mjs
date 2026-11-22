// Draws a link preview image (og:image, 1200×630) for every aircraft cheat sheet
// after `next build` (npm "postbuild"): the aircraft's name, its numbers and the
// sim, on HubHop's background. The numbers come from the exported page itself
// (its __NEXT_DATA__), so image and page always match. The page's og:image
// points to out/og/aircraft/<sim>/<vendor>/<aircraft>.jpg (lib/aircraftPages.ts).
import fs from "node:fs"
import path from "node:path"
import satori from "satori"
import sharp from "sharp"

// the export folder; tests pass their own
const OUT = process.argv[2] ?? "out"
const WIDTH = 1200
const HEIGHT = 630
const PADDING = 72

const SIMS = {
  msfs2020: { label: "MSFS", color: "#ffa047", background: "bg-hubhop.png" },
  xplane: {
    label: "X-Plane",
    color: "#0fb5e8",
    background: "bg-hubhop-xplane.png",
  },
}

const asset = (...parts) => path.join(import.meta.dirname, "..", ...parts)

// static instances of the site's variable font Assistant (satori can't read variable fonts)
const fonts = [600, 700, 800].map((weight) => ({
  name: "Assistant",
  weight,
  style: "normal",
  data: fs.readFileSync(asset("scripts", "og", `Assistant-${weight}.ttf`)),
}))

const dataUri = async (image, mime) =>
  `data:${mime};base64,${(await image.toBuffer()).toString("base64")}`

// the backgrounds and the logo, scaled once to the size they're drawn at
const backgrounds = Object.fromEntries(
  await Promise.all(
    Object.entries(SIMS).map(async ([sim, { background }]) => [
      sim,
      await dataUri(
        sharp(asset("public", "images", background))
          .resize(WIDTH, HEIGHT, { fit: "cover" })
          .jpeg({ quality: 90 }),
        "image/jpeg",
      ),
    ]),
  ),
)
const LOGO_HEIGHT = 96
const logo = await dataUri(
  sharp(asset("public", "images", "logo-big.png"))
    .resize({ height: LOGO_HEIGHT * 2 })
    .png(),
  "image/png",
)
const logoWidth = Math.round(
  (LOGO_HEIGHT * 2000) / 495, // logo-big.png is 2000×495
)

const h = (type, style, ...children) => ({
  type,
  props: { style, children: children.length === 1 ? children[0] : children },
})

const count = (value, one, many) => [
  h(
    "span",
    { fontWeight: 800, color: "#ffffff" },
    value.toLocaleString("en-US"),
  ),
  h("span", { marginLeft: 12 }, value === 1 ? one : many),
]

// big for short names, smaller for long ones, always one line
// (Assistant ExtraBold is about 0.55 em wide per character)
const fitted = (text, max) =>
  Math.min(max, Math.floor((WIDTH - 2 * PADDING) / (text.length * 0.56)))

/** The image of one cheat sheet, as a satori element tree */
const card = ({ sim, vendor, aircraft, presets, systems, profiles }) => {
  const { label, color } = SIMS[sim]
  const stats = [
    count(presets, "preset", "presets"),
    count(systems, "system", "systems"),
    ...(profiles > 0 ? [count(profiles, "profile", "profiles")] : []),
  ]
  return h(
    "div",
    {
      // satori adds the padding to the size
      width: WIDTH - 2 * PADDING,
      height: HEIGHT - 56 - 60,
      display: "flex",
      flexDirection: "column",
      padding: `56px ${PADDING}px 60px`,
      fontFamily: "Assistant",
      color: "#f4f4f5",
      backgroundColor: "#202228",
      backgroundImage: `url(${backgrounds[sim]})`,
      backgroundSize: `${WIDTH}px ${HEIGHT}px`,
    },
    h(
      "div",
      {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },
      {
        type: "img",
        props: { src: logo, width: logoWidth, height: LOGO_HEIGHT },
      },
      h(
        "div",
        {
          backgroundColor: color,
          color: "#1b1b1f",
          fontWeight: 800,
          fontSize: 40,
          padding: "2px 24px",
          borderRadius: 12,
        },
        label,
      ),
    ),
    h(
      "div",
      {
        marginTop: 40,
        fontSize: fitted(vendor, 60),
        fontWeight: 600,
        color: "#b4b4bb",
        lineHeight: 1,
      },
      vendor,
    ),
    h(
      "div",
      {
        marginTop: 6,
        fontSize: fitted(aircraft, 150),
        fontWeight: 800,
        lineHeight: 1,
      },
      aircraft,
    ),
    h(
      "div",
      { marginTop: 14, fontSize: 58, fontWeight: 700, color, lineHeight: 1 },
      "home cockpit presets",
    ),
    h(
      "div",
      {
        marginTop: "auto",
        display: "flex",
        fontSize: 50,
        fontWeight: 600,
        color: "#e4e4e7",
        lineHeight: 1,
      },
      ...stats.flatMap((stat, index) => [
        ...(index > 0
          ? [h("span", { color: "#71717a", margin: "0 24px" }, "·")]
          : []),
        h("span", { display: "flex" }, ...stat),
      ]),
    ),
  )
}

/** The cheat sheet pages: <out>/aircraft/<sim>/<vendor>/<aircraft>/index.html */
const cheatSheets = () => {
  const root = path.join(OUT, "aircraft")
  if (!fs.existsSync(root)) return []
  const dirs = (dir) =>
    fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
  return dirs(root).flatMap((sim) =>
    dirs(path.join(root, sim)).flatMap((vendor) =>
      dirs(path.join(root, sim, vendor))
        .map((aircraft) => ({ segments: [sim, vendor, aircraft] }))
        .filter(({ segments }) =>
          fs.existsSync(path.join(root, ...segments, "index.html")),
        ),
    ),
  )
}

const pagePropsOf = (file) => {
  const html = fs.readFileSync(file, "utf8")
  const json =
    /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s.exec(
      html,
    )?.[1]
  return json && JSON.parse(json).props.pageProps
}

let written = 0
for (const { segments } of cheatSheets()) {
  const props = pagePropsOf(
    path.join(OUT, "aircraft", ...segments, "index.html"),
  )
  if (!props?.sheet) continue
  const svg = await satori(
    card({
      sim: props.sim,
      vendor: props.sheet.vendor,
      aircraft: props.sheet.aircraft,
      presets: props.sheet.presets,
      systems: props.sheet.systems.length,
      profiles: props.profiles?.length ?? 0,
    }),
    { width: WIDTH, height: HEIGHT, fonts },
  )
  const [sim, vendor, aircraft] = segments
  const target = path.join(
    OUT,
    "og",
    "aircraft",
    sim,
    vendor,
    `${aircraft}.jpg`,
  )
  fs.mkdirSync(path.dirname(target), { recursive: true })
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(target)
  written++
}
console.info(`preview images: ${written} aircraft`)
