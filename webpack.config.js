var debug = process.env.NODE_ENV !== "production";
var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: path.join(__dirname),
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./src/js/app.js",
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015'],
          plugins: ['add-module-exports', 'transform-class-properties', 'transform-decorators-legacy']
        }
      },
      {
        test: /\.scss$/,
        loaders: [          
          'style',
          'css',
          'resolve-url',
          'autoprefixer?browsers=last 3 versions',
          'sass?outputStyle=expanded',
        ]
      },
      {
        test: /\.(woff2?|ttf|eot|svg)$/,
        loader: 'url?limit=10000'
      }
    ]
  },
  output: {
    path: path.join(__dirname, "assets/js"),    
    filename: "bundle.min.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};