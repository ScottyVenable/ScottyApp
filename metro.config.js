const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, 'db', 'mp3', 'ttf', 'otf'],
    sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs', 'mjs'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
