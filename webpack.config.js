var nodeExternals = require('webpack-node-externals');

module.exports = function(env, argv) {

// default to the server configuration
const base = {
        entry: "./src/server/server.js",
        output: {
            filename: "server.js",
            path: __dirname + "/dist"
        },

        // Enable sourcemaps for debugging webpack's output.
        devtool: "source-map",

        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: [".ts", ".tsx", ".js", ".json"]
        },

        module: {
            rules: [
                // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
                { test: /\.(js|ts|tsx)$/, loader: "awesome-typescript-loader" },

                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                { enforce: "pre", test: /\.js$/, loader: "source-map-loader", exclude: '/node_modules/'},

                // CSS style loader
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: 'style-loader',
                        },
                        {
                            loader: 'css-loader',
                        },
                    ],
                },
            ]
        },

        // When importing a module whose path matches one of the following, just
        // assume a corresponding global variable exists and use that instead.
        // This is important because it allows us to avoid bundling all of our
        // dependencies, which allows browsers to cache those libraries between builds.
        externals: [
            {
                "react": "React",
                "react-dom": "ReactDOM",
            },
                nodeExternals()
            ]       
    }

  // server-specific configuration
  if (env.platform === 'server') {
    base.target = 'node';
  }

  // client-specific configurations
  if (env.platform === 'client') {
    base.entry = './src/index.tsx';
    base.output.filename = 'client.js';
  }

  return base;
};