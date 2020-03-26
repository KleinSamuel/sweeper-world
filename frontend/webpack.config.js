const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const express = require("express");

module.exports = {
    entry: './src/index.js',
    mode: 'development',

    output: {
        filename: 'bundle-[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [new HtmlWebpackPlugin({
        title: "infinite minesweeper",
        filename: "index.html",
        path: "./dist",
        template: "./src/index.html"
    })],
    devtool: "inline-source-map",
    devServer: {
        contentBase: "./dist",
        host: 'localhost',
        port: 8080,
        before: function(app) {
            app.use("/assets", express.static(__dirname+"/src/assets/"));
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
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
        ]
    }
};