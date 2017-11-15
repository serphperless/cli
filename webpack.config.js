// Packages
const nodeExternals = require('webpack-node-externals')
const FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin')
const webpack = require('webpack');

module.exports = {
    entry: './cmd/serphperless.js',
    target: 'node',
    externals: [nodeExternals()],
    node: {
        __dirname: false
    },
    output: {
        filename: 'dist/serphperless.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['shebang-loader', 'babel-loader']
            }
        ]
    },
    plugins: [
        new FlowBabelWebpackPlugin(),
        new webpack.BannerPlugin({
            banner: '#!/usr/bin/env node',
            raw: true,
        }),
    ]
}
