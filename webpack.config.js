var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry: './src/js/Laconic_Hover.user.js',
    output: {
        filename: 'dist/bundle.js',
        chunkFilename: "[id].js"
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        }]
    },

    plugins: [
        new ExtractTextPlugin("dist/bundle.css")
    ]
}
