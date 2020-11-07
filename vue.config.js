module.exports = {
  productionSourceMap: false,
  configureWebpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'element-ui': '@pwp-app/better-element-ui',
    };
  }
};
