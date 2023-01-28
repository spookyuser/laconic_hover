const path = require("path"); // eslint-disable-line import/no-extraneous-dependencies
const SizePlugin = require("size-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const RemovePlugin = require("remove-files-webpack-plugin");

const config = {
  stats: "errors-only",
  entry: {
    "content-script": "./source/content-script.ts",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    extensionAlias: {
      ".js": [".js", ".ts"],
      ".cjs": [".cjs", ".cts"],
      ".mjs": [".mjs", ".mts"],
    },
  },
  module: {
    rules: [
      {
        test: /\.([cm]?ts|tsx)$/,
        loader: "ts-loader",
        include: /node_modules/,
      },
      { test: /\.css$/i, use: [MiniCssExtractPlugin.loader, "css-loader"] },
    ],
  },

  output: {
    path: path.join(__dirname, "distribution"),
    filename: "[name].js",
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "content-script.css" }),
    new SizePlugin(),
    new RemovePlugin({
      /**
       * Before compilation permanently removes
       * entire `./dist` folder.
       */
      before: {
        include: ["./distribution"],
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          context: "source",
          from: "**/*",
          globOptions: {
            ignore: ["*.ts", "*.css"],
          },
        },
      ],
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: false,
          compress: false,
          output: {
            beautify: true,
            indent_level: 2, // eslint-disable-line camelcase
          },
        },
      }),
    ],
  },
};

// Mode specific settings
// From: https://webpack.js.org/configuration/mode/
module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.devtool = "inline-source-map";
  }

  if (argv.mode === "production") {
    config.plugins.push(new CssMinimizerPlugin());
  }

  return config;
};
