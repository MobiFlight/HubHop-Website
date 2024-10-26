module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    loader: "custom",
  },
  env: {
    hubHopApiStats:
      "https://hubhop-api-mgtm.azure-api.net/api/v1/statistics/general",
    hubHopPresets: "https://hubhop-api-mgtm.azure-api.net/api/v1/presets",
  },
};
