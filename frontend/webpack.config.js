const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
        host: '0.0.0.0',
        port: 8080
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.(png|svg|jpg|gif|ico)$/,
                use:[
                    {
                        loader: "file-loader",
                        options: {
                            name: "texture-[name]-[hash].[ext]"
                        }
                    }
                ]
            }
        ]
    }
};