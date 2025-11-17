const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add additional metro configuration if needed
config.resolver.alias = {
  '@': './',
};

module.exports = config;