var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ArchivePlugin = require('webpack-archive-plugin');

module.exports = {
    entry: './src/js/Laconic_Hover.user.js',
    output: {
        filename: 'build/bundle.js',
        chunkFilename: "[id].js",
        path: '/dist'
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        }]
    },

    plugins: [
        new ExtractTextPlugin("build/bundle.css"),
        new ArchivePlugin()
    ]
};;;;;;;;;;;;;;
