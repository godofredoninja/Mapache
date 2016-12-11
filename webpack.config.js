const debug = process.env.NODE_ENV !== 'production';
const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.join(__dirname),
  devtool: debug ? 'inline-sourcemap' : null,
  entry: './src/js/app.js',
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: [/bower_components/, /node_modules/],
        loader: 'eslint-loader',
      },
    ],
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015'],
          plugins: ['add-module-exports'],
        },
      },
    ],
  },
  output: {
    path: path.join(__dirname, 'assets/js'),
    filename: 'bundle.min.js',
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};
