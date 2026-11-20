// Writes out/sitemap.xml and out/robots.txt after `next build` (npm "postbuild").
// The sitemap lists every exported page with a canonical URL that isn't
// noindex, so it follows the pages themselves and needs no preset data.
import fs from "node:fs"
import path from "node:path"

// the export folder; tests pass their own
const OUT = process.argv[2] ?? "out"

/** Absolute paths of all index.html files below `dir` */
const htmlFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return htmlFiles(full)
    return entry.name === "index.html" ? [full] : []
  })

const canonicalOf = (html) =>
  /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1]

const isNoindex = (html) =>
  /<meta name="robots" content="[^"]*noindex/.test(html)

const urls = htmlFiles(OUT)
  .map((file) => fs.readFileSync(file, "utf8"))
  .filter((html) => !isNoindex(html))
  .map(canonicalOf)
  .filter(Boolean)
  .sort()

const home = urls.find((url) => new URL(url).pathname === "/")
if (!home) throw new Error("sitemap: the homepage has no canonical URL")

const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;")

fs.writeFileSync(
  path.join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${escape(url)}</loc></url>`).join("\n")}
</urlset>
`,
)
fs.writeFileSync(
  path.join(OUT, "robots.txt"),
  `User-agent: *
Allow: /

Sitemap: ${new URL("/sitemap.xml", home)}
`,
)
console.log(`sitemap: ${urls.length} pages`)
