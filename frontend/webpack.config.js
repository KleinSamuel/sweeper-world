const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const express = require("express");

let host_dev = "http://localhost";
let host_prod = "http://sks-dev.de";

let host_backend_dev = host_dev+":8090";
let host_backend_prod = host_prod+":8090";

let host_assets_dev = host_dev+":8080";
let host_assets_prod = host_prod+":8080";

let isProduction = (process.env.IS_PRODUCTION === "true");

module.exports = {
    entry: './src/index.js',
    mode: 'development',

    output: {
        filename: 'bundle-[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "sweeper world",
            filename: "index.html",
            path: "./dist",
            template: "./src/index.html"
        }),
        new webpack.DefinePlugin({
            HOST_BACKEND: JSON.stringify(isProduction ? host_backend_prod : host_backend_dev),
            HOST_ASSETS: JSON.stringify(isProduction ? host_assets_prod : host_assets_dev)
        })
    ],
    devtool: "inline-source-map",
    devServer: {
        contentBase: "./dist",
        host: '0.0.0.0',
        port: 8080,
        before: function(app) {
            app.use("/assets", express.static(__dirname+"/src/assets/"));
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            }
            /*
            {
                test: /\.(png|svg|jpg|gif|ico|mp3)$/,
                use:[
                    {
                        loader: "file-loader",
                        options: {
                            name: "texture-[name]-[hash].[ext]"
                        }
                    }
                ]
            },
            {
                test: /\.ttf$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "font-[name]-[hash].ttf"
                        }
                    }
                ]
            }
            */
        ]
    }
};