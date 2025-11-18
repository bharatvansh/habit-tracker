const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add additional metro configuration if needed
config.resolver.alias = {
  '@': './',
};

// Web-specific optimizations
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    compress: {
      // Remove console logs in production
      drop_console: process.env.NODE_ENV === 'production',
    },
  },
};

// Asset resolutions for web
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'woff',
  'woff2',
  'ttf',
  'otf',
  'eot',
];

// Source extensions
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'jsx',
  'js',
  'ts',
  'tsx',
  'json',
  'wasm',
  'mjs',
  'cjs',
];

// Enable symlinks for better module resolution
config.resolver.unstable_enableSymlinks = true;

// Platform-specific extensions resolution
config.resolver.platforms = ['web', 'ios', 'android', 'windows'];

module.exports = config;