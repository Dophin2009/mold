const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const NODE_MODULES = path.resolve(__dirname, "node_modules");
const SRC = path.resolve(__dirname, "src");
const STATIC = path.resolve(__dirname, "static");
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
                    {
                        from: path.resolve(NODE_MODULES, "@fontsource/fira-sans"),
                        to: path.resolve(DIST, "font"),
                    },
                ],
            }),
        ],
        devServer: { contentBase: DIST, compress: production, port: 8000 },
    };
};
