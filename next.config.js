// Build info shown in the footer, to tell which deployment is live.
// GitHub Actions (and the Azure deploy action's build container) provide these.
const commit = process.env.GITHUB_SHA || ""
const repository = process.env.GITHUB_REPOSITORY || "MobiFlight/HubHop-Website"

module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    loader: "custom",
  },
  env: {
    NEXT_PUBLIC_BUILD_NUMBER: process.env.GITHUB_RUN_NUMBER || "dev",
    NEXT_PUBLIC_BUILD_COMMIT: commit.slice(0, 7),
    NEXT_PUBLIC_BUILD_COMMIT_URL: commit
      ? `https://github.com/${repository}/commit/${commit}`
      : "",
    hubHopApiStats:
      "https://hubhop-api-mgtm.azure-api.net/api/v1/statistics/general",
    hubHopPresets: "https://hubhop-api-mgtm.azure-api.net/api/v1/presets",
  },
  output: "export",
}
