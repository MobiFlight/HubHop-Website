module.exports = {
  devServer: {
    host: "hubhop.io",
    https: true,
  },
  configureWebpack: {
    resolve: { mainFields: ["main", "module"] },
  },
  transpileDependencies: ["vue-meta"],
};
