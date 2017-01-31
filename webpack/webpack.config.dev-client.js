const path = require("path");
const webpack = require("webpack");

const assetsPath = path.join(__dirname, "..", "static", "assets");
const publicPath = "/assets/";

const hotMiddlewareScript = "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true";

const commonLoaders = [
  {
    test: /\.js$|\.jsx$/,
    loader: "babel-loader",
    query: {
      presets: ["react-hmre", "es2015", "react", "stage-0"],
      plugins: ["transform-decorators-legacy"]
    },
    include: path.join(__dirname, "..", "app"),
    exclude: path.join(__dirname, "..", "node_modules")
  },
  {
    test: /\.json$/, loader: "json-loader"
  },
  {
    test: /\.css$/, loader: "style!css!postcss-loader"
  }
];

function postCSSConfig() {
  return [
    require("postcss-import")({
      path: path.join(__dirname, "..", "app"),
      addDependencyTo: webpack // for hot-reloading
    }),
    require("postcss-simple-vars")(),
    require("postcss-nesting")(),
    require("postcss-cssnext")({browsers: ["> 1%", "last 2 versions"]}),
    require("postcss-reporter")({clearMessages: true, filter: msg => msg.type === "warning" || msg.type !== "dependency"})
  ];
}

module.exports = {
  devtool: "eval",
  name: "browser",
  context: path.join(__dirname, "..", "app"),
  entry: {
    app: ["./client", hotMiddlewareScript]
  },
  output: {
    path: assetsPath,
    filename: "[name].js",
    publicPath
  },
  module: {
    loaders: commonLoaders
  },
  resolve: {
    root: [path.join(__dirname, "..", "app")],
    extensions: ["", ".js", ".jsx", ".css"]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({__DEVCLIENT__: true, __DEVSERVER__: false})
  ],
  postcss: postCSSConfig
};
