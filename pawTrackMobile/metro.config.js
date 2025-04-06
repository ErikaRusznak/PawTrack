// // Learn more https://docs.expo.io/guides/customizing-metro
// const { getDefaultConfig } = require('expo/metro-config');

// /** @type {import('expo/metro-config').MetroConfig} */
// const config = getDefaultConfig(__dirname);

// module.exports = config;


const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts = [...defaultConfig.resolver.sourceExts, "mjs", "cjs"];
defaultConfig.resolver.extraNodeModules = {
    ...defaultConfig.resolver.extraNodeModules,
};

module.exports = defaultConfig;
