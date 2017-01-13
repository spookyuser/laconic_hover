var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    entry: './src/js/Laconic_Hover.user.js',
    output: {
        filename: 'build/bundle.js'
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        }]
    },

    plugins: [
        new ExtractTextPlugin("build/bundle.css"),
        new CopyWebpackPlugin([
            {from: 'src/images/icons', to: 'build/icons'},
            {from: 'manifest.json', to: 'build'}

        ])

    ]

};