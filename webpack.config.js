const path = require('path');
const webpack = require('webpack');

const pkg = require('./package');

const env = process.env.WEBPACK_ENV;
const plugins = [];

if (env === 'build') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
}

module.exports = {
  entry: path.join(__dirname, 'index.js'),
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `${pkg.name}${env === 'build' ? '.min' : ''}.js`,
    library: pkg.name,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    'mobx': {
      root: 'mobx',
      commonjs2: 'mobx',
      commonjs: 'mobx',
      amd: 'mobx',
    },
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: [
            'babel-preset-es2015',
            'babel-preset-stage-0',
          ].map(require.resolve),
          plugins: [
            'babel-plugin-add-module-exports',
            'babel-plugin-transform-decorators-legacy',
          ].map(require.resolve),
        },
      },
    ],
  },
  plugins,
};
