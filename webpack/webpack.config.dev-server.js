const path = require("path");
const webpack = require("webpack");

const assetsPath = path.join(__dirname, "..", "static", "assets");
const publicPath = "/assets/";

const commonLoaders = [
  {
    test: /\.js$|\.jsx$/,
    loader: "babel-loader",
    query: {
      presets: ["es2015", "react", "stage-0"],
      plugins: ["transform-decorators-legacy"]
    },
    include: path.join(__dirname, "..", "app"),
    exclude: path.join(__dirname, "..", "node_modules")
  },
  {
    test: /\.json$/, loader: "json-loader"
  },
  {
    test: /\.css$/, loader: "css"
  }
];

module.exports = {
  // The configuration for the server-side rendering
  name: "server-side rendering",
  context: path.join(__dirname, "..", "app"),
  entry: {server: "./server"},
  target: "node",
  output: {
    path: assetsPath,
    filename: "server.js",
    publicPath,
    libraryTarget: "commonjs2"
  },
  module: {
    loaders: commonLoaders
  },
  resolve: {
    root: [path.join(__dirname, "..", "app")],
    extensions: ["", ".js", ".jsx", ".css"]
  },
  plugins: [
    new webpack.DefinePlugin({__DEVCLIENT__: false, __DEVSERVER__: true}),
    new webpack.IgnorePlugin(/vertx/)
  ]
};
