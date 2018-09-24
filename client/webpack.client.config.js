const merge = require('webpack-merge');
const baseConfig = require('../webpack.base.config.js');
const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./indexTemplate.html",
  filename: "./index.html"
});

module.exports = merge(baseConfig, {

    entry: './index.tsx',
    output: {
        filename: "client.js",
        path: __dirname + "/dist"
    },

    plugins: [htmlPlugin]
});