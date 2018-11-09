"use strict";
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

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
  ]
  // TODO: Add optimization
};
