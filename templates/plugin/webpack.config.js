require('dotenv').config({ quiet: true });
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const wordpressConfig = require('@wordpress/scripts/config/webpack.config');

const srcPath = path.join(__dirname, process.env.WP_SOURCE_PATH || 'src');
const buildPath = path.join(__dirname, process.env.WP_BUILD_PATH || 'build');

module.exports = {
  ...wordpressConfig,
  entry: {
    ...wordpressConfig.entry(),
    'admin/index': path.join(srcPath, 'admin', 'index'),
    'client/index': path.join(srcPath, 'client', 'index'),
  },
  output: {
    ...wordpressConfig.output,
    path: buildPath,
  },
  plugins: [
    ...wordpressConfig.plugins,
    new BrowserSyncPlugin(
      {
        proxy: process.env.BROWSER_SYNC_PROXY || 'http://localhost:8000',
        port: process.env.BROWSER_SYNC_PORT || 3000,
        injectCss: true,
        files: ['**/*.php', '**/*.html', '**/*.json'],
        notify: false,
      },
      { reload: true },
    ),
  ],
  resolve: {
    ...wordpressConfig.resolve,
    alias: {
      ...wordpressConfig.resolve?.alias,
      '@': srcPath,
    },
  },
  devServer: {
    ...wordpressConfig.devServer,
    port: process.env.WEBPACK_DEV_SERVER_PORT || 3002,
  },
};
