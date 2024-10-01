const SassResourcesLoader = require('craco-sass-resources-loader');
const path = require('path');
const webpack = require('webpack');

const webpackConfig = {
  alias: {
    '@': path.resolve(__dirname, './src/'),
  },
  plugins: [
    new webpack.DefinePlugin({
      RUN_ENV: JSON.stringify(process.env.RUN_ENV || 'dev'),
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'docs'),
    publicPath: '/',
  }
};

module.exports = {
  webpack: webpackConfig,
  babel: {
    plugins: [],
  },
  devServer: {
    proxy: {},
  },
  plugins: [
    {
      plugin: SassResourcesLoader,
      options: {
        resources: ['./src/common/css/mixins.scss'],
      },
    },
  ],
};
