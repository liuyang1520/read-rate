const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

if (process.env.ENV == null) {
      process.env.ENV = "development";
}
const ENV = process.env.ENV;

const plugins = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "src/popup/index.html"),
    filename: "popup/index.html",
    chunks: ["popup"]
  }),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "src/options/index.html"),
    filename: "options/index.html",
    chunks: ["options"]
  }),
  new CopyWebpackPlugin([
    path.resolve(__dirname, "src/manifest.json"),
    {
      from: './src/_locales',
      to: '_locales'
    },
    {
      from: path.resolve(__dirname, "./src/images"),
      to: "images"
    }
  ]),
  new webpack.DefinePlugin({
    "process.env": {
      "ENV": JSON.stringify(ENV)
    }
  })
]

module.exports = {
  mode: ENV,
  devtool: "inline-source-map",
  entry: {
    contentscript: path.resolve(__dirname, "src/contentscript/index.ts"),
    background: path.resolve(__dirname, "src/background/index.ts"),
    popup: path.resolve(__dirname, "src/popup/index.tsx"),
    options: path.resolve(__dirname, "src/options/index.tsx"),
    utils: path.resolve(__dirname, "src/utils/index.ts"),
    lib: path.resolve(__dirname, "src/lib/index.ts")
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: plugins
};
