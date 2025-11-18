/**
 * Custom Webpack Configuration for Web Build
 * Extends Expo's default webpack config with optimizations
 */

const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['@expo/vector-icons'],
      },
    },
    argv
  );

  // Performance optimizations
  config.optimization = {
    ...config.optimization,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        // Vendor chunk
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /node_modules/,
          priority: 20,
        },
        // Common chunk
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
        // React/React-DOM
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 30,
        },
        // Zustand & Storage
        store: {
          test: /[\\/]node_modules[\\/](zustand|@react-native-async-storage)[\\/]/,
          name: 'store',
          chunks: 'all',
          priority: 25,
        },
      },
    },
    runtimeChunk: {
      name: 'runtime',
    },
    minimize: env.mode === 'production',
  };

  // Add compression plugin for production
  if (env.mode === 'production') {
    const CompressionPlugin = require('compression-webpack-plugin');
    config.plugins.push(
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 8192,
        minRatio: 0.8,
      })
    );
  }

  // Bundle analyzer (optional - enable when needed)
  // const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  // if (process.env.ANALYZE) {
  //   config.plugins.push(new BundleAnalyzerPlugin());
  // }

  // Add source maps for better debugging
  if (env.mode === 'development') {
    config.devtool = 'eval-source-map';
  } else {
    config.devtool = 'source-map';
  }

  // Add performance hints
  config.performance = {
    maxAssetSize: 512000,
    maxEntrypointSize: 512000,
    hints: env.mode === 'production' ? 'warning' : false,
  };

  return config;
};
