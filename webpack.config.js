const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: [
        './src/index'
    ],
    module: {
        loaders: [
          { test: /\.js?$/, loader: 'babel-loader', exclude: /node_modules/ }
        ]
    },
    resolve: {
        extensions: ['.js']
    },
    output: {
        path: path.join(__dirname, '/dist'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        proxy: {
            '/socket.io/*': {
                target: 'ws://localhost:8080',
                ws: true
            }
        }
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};
