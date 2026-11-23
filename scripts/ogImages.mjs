// Draws link preview images (og:image, 1200×630) after `next build` (npm
// "postbuild"), on HubHop's background:
// - every aircraft cheat sheet: the aircraft's name, its numbers and the sim,
//   out/og/aircraft/<sim>/<vendor>/<aircraft>.jpg (lib/aircraftPages.ts)
// - the profiles overview and every brand page: the brand and its numbers,
//   out/og/profiles/<sim>.jpg and out/og/profiles/<sim>/<brand>.jpg (lib/hardwarePages.ts)
// The numbers come from the exported page itself (its __NEXT_DATA__), so image
// and page always match.
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

// big for short names, smaller for long ones, on one line unless more are allowed
// (Assistant ExtraBold is about 0.55 em wide per character)
const fitted = (text, max, lines = 1) =>
  Math.min(
    max,
    Math.floor(((WIDTH - 2 * PADDING) * lines) / (text.length * 0.56)),
  )

const badge = (sim) =>
  h(
    "div",
    {
      backgroundColor: SIMS[sim].color,
      color: "#1b1b1f",
      fontWeight: 800,
      fontSize: 40,
      padding: "2px 24px",
      borderRadius: 12,
    },
    SIMS[sim].label,
  )

/**
 * One preview image, as a satori element tree: logo and sim badges on top, a
 * small line, the big title, a coloured subtitle, and the numbers at the
 * bottom. Background and subtitle colour are those of the first sim.
 */
const card = ({ sims, kicker, title, titleLines = 1, subtitle, stats }) => {
  const [sim] = sims
  const { color } = SIMS[sim]
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
      h("div", { display: "flex", gap: 16 }, ...sims.map(badge)),
    ),
    // the small line above the title is optional
    ...(kicker
      ? [
          h(
            "div",
            {
              marginTop: 40,
              fontSize: fitted(kicker, 60),
              fontWeight: 600,
              color: "#b4b4bb",
              lineHeight: 1,
            },
            kicker,
          ),
        ]
      : []),
    h(
      "div",
      {
        marginTop: kicker ? 6 : 46,
        fontSize: fitted(title, 150, titleLines),
        fontWeight: 800,
        lineHeight: titleLines > 1 ? 1.05 : 1,
      },
      title,
    ),
    h(
      "div",
      {
        marginTop: 14,
        fontSize: fitted(subtitle, 58),
        fontWeight: 700,
        color,
        lineHeight: 1,
      },
      subtitle,
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

/** A cheat sheet's image */
const aircraftCard = ({ sim, vendor, aircraft, presets, systems, profiles }) =>
  card({
    sims: [sim],
    kicker: vendor,
    title: aircraft,
    subtitle: "home cockpit presets",
    stats: [
      count(presets, "preset", "presets"),
      count(systems, "system", "systems"),
      ...(profiles > 0 ? [count(profiles, "profile", "profiles")] : []),
    ],
  })

/** A hardware brand's image */
const brandCard = (sim, brand) => {
  const profiles = [
    ...brand.products.flatMap((product) => product.profiles),
    ...brand.other,
  ]
  const aircraft = new Set(
    profiles.flatMap((profile) => profile.aircraft.map((entry) => entry.url)),
  ).size
  return card({
    sims: [sim],
    kicker: brand.formerly
      ? `Hardware · formerly ${brand.formerly}`
      : "Hardware",
    title: brand.name,
    subtitle: "MobiFlight profiles",
    stats: [
      count(brand.profiles, "profile", "profiles"),
      ...(brand.products.length > 0
        ? [count(brand.products.length, "product", "products")]
        : []),
      ...(aircraft > 0 ? [count(aircraft, "aircraft", "aircraft")] : []),
    ],
  })
}

/** The profiles overview's image */
const hardwareIndexCard = ({ sim, brands, profiles }) =>
  card({
    sims: [sim],
    // the same words as the page title
    title: "MobiFlight profiles",
    subtitle: "that make your hardware plug-and-play",
    stats: [
      count(profiles, "profile", "profiles"),
      count(brands.length, "brand", "brands"),
    ],
  })

/** The homepage's image: the same heading and tagline as the page */
const homeCard = ({ library, profiles }) =>
  card({
    sims: ["msfs2020", "xplane"],
    title: "Get the most out of your flight sim hardware",
    titleLines: 2,
    subtitle: "Less time configuring, more time flying",
    stats: [
      count(
        library.msfs2020.presets + library.xplane.presets,
        "preset",
        "presets",
      ),
      ...(profiles > 0 ? [count(profiles, "profile", "profiles")] : []),
    ],
  })

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

const draw = async (element, ...target) => {
  const svg = await satori(element, { width: WIDTH, height: HEIGHT, fonts })
  const file = path.join(OUT, "og", ...target)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(file)
}

const homeFile = path.join(OUT, "index.html")
const homeProps = fs.existsSync(homeFile) && pagePropsOf(homeFile)
if (homeProps?.library) await draw(homeCard(homeProps), "home.jpg")

let aircraftImages = 0
for (const { segments } of cheatSheets()) {
  const props = pagePropsOf(
    path.join(OUT, "aircraft", ...segments, "index.html"),
  )
  if (!props?.sheet) continue
  const [sim, vendor, aircraft] = segments
  await draw(
    aircraftCard({
      sim: props.sim,
      vendor: props.sheet.vendor,
      aircraft: props.sheet.aircraft,
      presets: props.sheet.presets,
      systems: props.sheet.systems.length,
      profiles: props.profiles?.length ?? 0,
    }),
    "aircraft",
    sim,
    vendor,
    `${aircraft}.jpg`,
  )
  aircraftImages++
}

/** The profiles overview and brand pages: <out>/profiles/<sim>/[<brand>/]index.html */
const subdirs = (dir) =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    : []
const hardwareRoot = path.join(OUT, "profiles")
let brandImages = 0
for (const simDir of subdirs(hardwareRoot)) {
  const indexFile = path.join(hardwareRoot, simDir, "index.html")
  const indexProps = fs.existsSync(indexFile) && pagePropsOf(indexFile)
  if (!indexProps?.brands) continue
  await draw(hardwareIndexCard(indexProps), "profiles", `${simDir}.jpg`)
  for (const slug of subdirs(path.join(hardwareRoot, simDir))) {
    const file = path.join(hardwareRoot, simDir, slug, "index.html")
    const props = fs.existsSync(file) && pagePropsOf(file)
    if (!props?.brand) continue
    await draw(
      brandCard(props.sim, props.brand),
      "profiles",
      simDir,
      `${slug}.jpg`,
    )
    brandImages++
  }
}
console.info(
  `preview images: ${aircraftImages} aircraft, ${brandImages} hardware brands`,
)
