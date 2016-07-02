const path = require('path');
const webpack = require('webpack');

const pkg = require('./package');

const library = pkg.name;
const env = process.env.WEBPACK_ENV;
const plugins = [];

if (env === 'build') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
  filename = library + '.min.js';
} else {
  filename = library + '.js';
}

module.exports = {
  entry: path.join(__dirname, 'index.js'),
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename,
    library,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: [
            'es2015',
            'stage-0',
          ],
          plugins: [
            'add-module-exports',
          ],
        },
      },
    ],
  },
  plugins,
};
