
module.exports = {

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"],
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.(js|ts|tsx)$/, loader: "awesome-typescript-loader"},//, exclude: '/node_modules/'},

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader"},//, exclude: '/node_modules/'},

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
    }

    };