const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtract = require('mini-css-extract-plugin');
const isDevMode = process.env.NODE_ENV === 'development';

module.exports = {
    entry: {
        app: path.resolve(__dirname, 'src/assets/js/index.js')
    },

    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: '[name].bundle.[hash].js'
    },

    module: {
        rules: [{
                test: /\.js$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [isDevMode ? 'style-loader' : miniCssExtract.loader, 'css-loader']
            }
        ]
    },

    plugins: [
        new miniCssExtract({
            filename: '[name].[hash].css'
        }),
        new htmlWebpackPlugin({
            filename: path.join(__dirname, 'public/index.html'),
            template: path.join(__dirname, 'src/index.html'),
        })
    ],

    devServer: {
        contentBase: path.join(__dirname, 'public'),
        publicPath: '/dist/',
        port: 9090
    }
}