module.exports = function(api) {
  api.cache(true);
  const nativewindConfig = require('nativewind/babel')();
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ...nativewindConfig.plugins.filter(Boolean),
    ],
  };
};

