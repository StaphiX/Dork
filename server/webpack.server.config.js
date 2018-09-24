var nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');
const baseConfig = require('../webpack.base.config.js');

module.exports = merge(baseConfig, {
    entry: "./server.ts",
    output: {
        filename: "server.js",
        path: __dirname + "/dist"
    },
    target: 'node',

    externals: [nodeExternals({
        modulesFromFile: true
    })]
});
