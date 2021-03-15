const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const NODE_MODULES = path.resolve(__dirname, "node_modules");
const SRC = path.resolve(__dirname, "src");
const STATIC = path.resolve(__dirname, "static");
const FAVICON = path.resolve(__dirname, "favicon");
const DIST = path.resolve(__dirname, "dist");

module.exports = (_, argv) => {
    const production = argv.mode == "production";

    return {
        entry: path.resolve(SRC, "index.ts"),
        output: {
            path: DIST,
            filename: "index.js",
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".sass", ".scss", ".wasm"],
        },
        module: {
            rules: [{ test: /\.tsx?$/, use: ["swc-loader"] }],
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: STATIC, to: DIST },
                    { from: FAVICON, to: DIST },
                    {
                        from: path.resolve(NODE_MODULES, "@fontsource/fira-sans"),
                        to: path.resolve(DIST, "font/fira-sans"),
                    },
                    {
                        from: path.resolve(NODE_MODULES, "@fortawesome/fontawesome-free/css"),
                        to: path.resolve(DIST, "font/fontawesome"),
                    },
                    {
                        from: path.resolve(NODE_MODULES, "@fortawesome/fontawesome-free/webfonts"),
                        to: path.resolve(DIST, "font/webfonts"),
                    },
                ],
            }),
        ],
        devtool: production ? false : "eval-source-map",
        devServer: { contentBase: DIST, compress: production, port: 8000 },
    };
};
