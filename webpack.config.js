"use strict";
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  devtool: "sourcemap",
  entry: {
    "laconic-hover": "./src/laconic-hover.js"
  },
  output: {
    path: path.join(__dirname, "distribution"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "**/*",
        context: "src",
        ignore: "*.js"
      }
    ]),
    new CleanWebpackPlugin(["distribution"])
  ],
  optimization: {
    // From https://github.com/sindresorhus/refined-github/blob/65fd58a1f1505ff348e3a9111ccda1236c3b563f/webpack.config.js
    // Without this, function names will be garbled and enableFeature won't work
    concatenateModules: true,

    // Automatically enabled on prod; keeps it somewhat readable for AMO reviewers
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: false,
          compress: false,
          output: {
            beautify: true,
            indent_level: 2 // eslint-disable-line camelcase
          }
        }
      })
    ]
  }
};
